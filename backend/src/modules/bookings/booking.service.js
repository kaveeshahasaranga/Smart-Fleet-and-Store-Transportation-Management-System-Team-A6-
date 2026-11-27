import { randomBytes } from 'node:crypto';
import Booking from './booking.model.js';
import { calculateLoad } from '../../validators/load.js';
import { enumValue, objectBody, text, validateId } from '../../validators/masterData.js';
import { httpError, serialize } from '../../utils/http.js';

const deliverySlots = [
  'Morning (08:00 AM – 12:00 PM)',
  'Afternoon (12:00 PM – 04:00 PM)',
  'Evening (04:00 PM – 08:00 PM)',
];
const bookingStatuses = ['Pending Review', 'Approved', 'Rejected', 'Completed', 'Cancelled'];

function validateDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw httpError(400, 'Delivery date must use YYYY-MM-DD format.');
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw httpError(400, 'Enter a valid delivery date.');
  }
  if (value < new Date().toISOString().slice(0, 10)) throw httpError(400, 'Delivery date cannot be in the past.');
  return value;
}

function validateStoreId(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,32}$/.test(value)) {
    throw httpError(400, 'A valid store ID is required.');
  }
  return value;
}

function validatePhone(value) {
  if (typeof value !== 'string' || !/^\+94[0-9]{9}$/.test(value)) {
    throw httpError(400, 'Contact number must be a Sri Lankan number in +94 format.');
  }
  return value;
}

function validateInstructions(value, optional = false) {
  if (optional && value === undefined) return undefined;
  if (typeof value !== 'string' || value.length > 1000) throw httpError(400, 'Instructions must be at most 1,000 characters.');
  return value.trim();
}

function validateFields(body, partial = false, includeStoreId = false) {
  const fields = ['destinationStoreId', 'deliveryDate', 'deliverySlot', 'contactName', 'contactPhone', 'instructions', 'items'];
  objectBody(body, [...fields, ...(includeStoreId ? ['storeId'] : [])]);
  const result = {};
  for (const field of fields) {
    if (partial && body[field] === undefined) continue;
    if (field === 'destinationStoreId') result[field] = validateStoreId(body[field]);
    else if (field === 'deliveryDate') result[field] = validateDate(body[field]);
    else if (field === 'deliverySlot') result[field] = enumValue(body[field], deliverySlots, field);
    else if (field === 'contactName') result[field] = text(body[field], field);
    else if (field === 'contactPhone') result[field] = validatePhone(body[field]);
    else if (field === 'instructions') result[field] = validateInstructions(body[field], true) ?? '';
    else if (field === 'items') {
      if (!Array.isArray(body.items)) throw httpError(400, 'Items must be an array.');
      result.items = body.items;
    }
  }
  if (includeStoreId && body.storeId !== undefined) result.storeId = validateStoreId(body.storeId);
  if (partial && !Object.keys(result).length) throw httpError(400, 'Provide at least one field to update.');
  return result;
}

function bookingFilter(req, id) {
  validateId(id);
  const filter = { _id: id, deletedAt: null };
  if (req.user.role === 'store') filter.storeId = req.user.storeId;
  return filter;
}

function serializedBooking(booking) {
  return serialize(booking);
}

export async function listBookings(req) {
  const filter = { deletedAt: null };
  if (req.user.role === 'store') filter.storeId = req.scopedStoreId;
  else if (req.query.storeId) filter.storeId = validateStoreId(req.query.storeId);
  if (req.query.status) filter.status = enumValue(req.query.status, bookingStatuses, 'status');
  const records = await Booking.find(filter).sort({ createdAt: -1 });
  return records.map(serializedBooking);
}

export async function getBooking(req, id) {
  const booking = await Booking.findOne(bookingFilter(req, id));
  if (!booking) throw httpError(404, 'Booking not found.');
  return serializedBooking(booking);
}

export async function createBooking(req, body) {
  const fields = validateFields(body, false, req.user.role === 'admin');
  const storeId = req.user.role === 'store' ? req.scopedStoreId : fields.storeId;
  if (!storeId) throw httpError(400, 'Store ID is required when an administrator creates a booking.');
  if (fields.destinationStoreId === storeId) throw httpError(400, 'Destination store must be different from the requesting store.');
  const load = await calculateLoad(fields.items);
  const booking = await Booking.create({
    ...fields,
    storeId,
    bookingCode: `BK-${randomBytes(4).toString('hex').toUpperCase()}`,
    items: load.lines,
    totalWeight: load.totalWeight,
  });
  return serializedBooking(booking);
}

export async function updateBooking(req, id, body, replace = false) {
  const booking = await Booking.findOne(bookingFilter(req, id));
  if (!booking) throw httpError(404, 'Booking not found.');
  if (booking.status !== 'Pending Review') throw httpError(409, 'Only bookings pending review can be edited.');
  const fields = validateFields(body, !replace);
  if (fields.destinationStoreId && fields.destinationStoreId === booking.storeId) {
    throw httpError(400, 'Destination store must be different from the requesting store.');
  }
  if (fields.items) {
    const load = await calculateLoad(fields.items);
    fields.items = load.lines;
    booking.totalWeight = load.totalWeight;
  }
  Object.assign(booking, fields);
  await booking.save();
  return serializedBooking(booking);
}

export async function deleteBooking(req, id) {
  const booking = await Booking.findOne(bookingFilter(req, id));
  if (!booking) throw httpError(404, 'Booking not found.');
  if (booking.status !== 'Pending Review') throw httpError(409, 'Only bookings pending review can be cancelled.');
  booking.status = 'Cancelled';
  booking.deletedAt = new Date();
  await booking.save();
}

export async function reviewBooking(req, id, body) {
  objectBody(body, ['decision', 'note']);
  const decision = enumValue(body.decision, ['approve', 'reject'], 'decision');
  const note = body.note === undefined ? '' : text(body.note, 'note');
  if (decision === 'reject' && !note) throw httpError(400, 'A rejection reason is required.');
  const booking = await Booking.findOne(bookingFilter(req, id));
  if (!booking) throw httpError(404, 'Booking not found.');
  if (booking.status !== 'Pending Review') throw httpError(409, 'Only bookings pending review can be reviewed.');
  booking.status = decision === 'approve' ? 'Approved' : 'Rejected';
  booking.reviewStatus = decision === 'approve' ? 'Approved' : 'Rejected';
  booking.reviewNote = note;
  booking.reviewedBy = req.user.id;
  booking.reviewedAt = new Date();
  await booking.save();
  return serializedBooking(booking);
}

export async function getHandoverBooking(req, id) {
  const booking = await Booking.findOne(bookingFilter(req, id));
  if (!booking) throw httpError(404, 'Booking not found.');
  if (!['Approved', 'Completed'].includes(booking.status)) {
    throw httpError(409, 'Goods can only be confirmed for an approved booking.');
  }
  return serializedBooking(booking);
}

function validateCount(value, field, unit) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1000000) {
    throw httpError(400, `${field} must be between zero and 1,000,000.`);
  }
  if (Math.abs(value * 1000 - Math.round(value * 1000)) > 0.000001) {
    throw httpError(400, `${field} supports up to three decimal places.`);
  }
  if (unit !== 'kg' && !Number.isSafeInteger(value)) throw httpError(400, `${field} must be a whole number for ${unit}.`);
  return value;
}

function receiptCondition(expected, received, accepted) {
  if (received < expected && accepted < received) return 'Damaged and short';
  if (received < expected) return 'Short';
  if (received > expected) return accepted < received ? 'Damaged' : 'Extra';
  return accepted < received ? 'Damaged' : 'Good';
}

export async function confirmGoods(req, id, body) {
  objectBody(body, ['items', 'discrepancyNote']);
  if (!Array.isArray(body.items) || body.items.length === 0) throw httpError(400, 'Provide received quantities for every booking item.');
  if (body.discrepancyNote !== undefined && (typeof body.discrepancyNote !== 'string' || body.discrepancyNote.length > 500)) {
    throw httpError(400, 'Discrepancy note must be at most 500 characters.');
  }
  const booking = await Booking.findOne(bookingFilter(req, id));
  if (!booking) throw httpError(404, 'Booking not found.');
  if (booking.status !== 'Approved') throw httpError(409, 'Goods can only be confirmed for an approved booking.');
  if (booking.goodsConfirmation?.confirmedAt) throw httpError(409, 'Goods have already been confirmed for this booking.');

  const expectedItems = new Map(booking.items.map(item => [String(item.itemId), item]));
  const receivedIds = new Set();
  const receivedItems = body.items.map(line => {
    objectBody(line, ['itemId', 'receivedQuantity', 'acceptedQuantity']);
    validateId(line.itemId);
    const itemId = line.itemId.toLowerCase();
    const expected = expectedItems.get(itemId);
    if (!expected || receivedIds.has(itemId)) throw httpError(400, 'Each booking item must appear exactly once.');
    receivedIds.add(itemId);
    const receivedQuantity = validateCount(line.receivedQuantity, 'receivedQuantity', expected.unit);
    const acceptedQuantity = validateCount(line.acceptedQuantity, 'acceptedQuantity', expected.unit);
    if (acceptedQuantity > receivedQuantity) throw httpError(400, 'Accepted quantity cannot exceed received quantity.');
    return {
      itemId: expected.itemId,
      itemName: expected.itemName,
      unit: expected.unit,
      expectedQuantity: expected.quantity,
      receivedQuantity,
      acceptedQuantity,
      condition: receiptCondition(expected.quantity, receivedQuantity, acceptedQuantity),
    };
  });
  if (receivedIds.size !== expectedItems.size) throw httpError(400, 'Provide received quantities for every booking item.');
  const hasDiscrepancy = receivedItems.some(item => item.condition !== 'Good');
  const discrepancyNote = body.discrepancyNote?.trim() || '';
  if (hasDiscrepancy && !discrepancyNote) throw httpError(400, 'Add a discrepancy note before confirming goods.');

  booking.goodsConfirmation = {
    confirmedBy: req.user.id,
    confirmedAt: new Date(),
    items: receivedItems,
    discrepancyNote,
  };
  booking.status = 'Completed';
  await booking.save();
  return serializedBooking(booking);
}
