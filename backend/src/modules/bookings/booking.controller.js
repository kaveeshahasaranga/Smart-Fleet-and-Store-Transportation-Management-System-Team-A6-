import { asyncHandler } from '../../utils/http.js';
import {
  confirmGoods,
  createBooking,
  deleteBooking,
  getBooking,
  getHandoverBooking,
  listBookings,
  reviewBooking,
  updateBooking,
} from './booking.service.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ data: await listBookings(req) });
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ data: await createBooking(req, req.body) });
});

export const read = asyncHandler(async (req, res) => {
  res.json({ data: await getBooking(req, req.params.id) });
});

export const replace = asyncHandler(async (req, res) => {
  res.json({ data: await updateBooking(req, req.params.id, req.body, true) });
});

export const patch = asyncHandler(async (req, res) => {
  res.json({ data: await updateBooking(req, req.params.id, req.body) });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteBooking(req, req.params.id);
  res.status(204).end();
});

export const review = asyncHandler(async (req, res) => {
  res.json({ data: await reviewBooking(req, req.params.id, req.body) });
});

export const handover = asyncHandler(async (req, res) => {
  res.json({ data: await getHandoverBooking(req, req.params.id) });
});

export const confirm = asyncHandler(async (req, res) => {
  res.json({ data: await confirmGoods(req, req.params.id, req.body) });
});
