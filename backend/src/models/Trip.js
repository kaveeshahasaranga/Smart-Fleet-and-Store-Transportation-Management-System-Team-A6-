import { pool } from '../config/database.js';

const tripColumns = `trip_code, vehicle_id, vehicle_registration, vehicle_name, vehicle_type,
  vehicle_capacity, driver, driver_phone, departure, return_time, origin, notes,
  booking_ids, total_load, total_distance, status, created_at, updated_at`;

function parseJson(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

function mapStop(row) {
  return {
    stopId: row.stop_id,
    bookingId: row.booking_id,
    name: row.name,
    city: row.city,
    contact: row.contact,
    load: Number(row.load),
    cartons: Number(row.cartons),
    notes: row.notes,
    eta: row.eta,
    distance: Number(row.distance),
    tag: row.tag,
    sequence: Number(row.sequence),
  };
}

function mapTrip(row, stopRows = []) {
  return {
    tripCode: row.trip_code,
    vehicle: {
      id: row.vehicle_id,
      registration: row.vehicle_registration,
      name: row.vehicle_name,
      type: row.vehicle_type,
      capacity: Number(row.vehicle_capacity),
    },
    driver: row.driver,
    driverPhone: row.driver_phone,
    departure: row.departure,
    returnTime: row.return_time,
    origin: row.origin,
    notes: row.notes,
    bookingIds: parseJson(row.booking_ids),
    stops: stopRows.map(mapStop),
    totalLoad: Number(row.total_load),
    totalDistance: Number(row.total_distance),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function loadStops(connection, tripCode) {
  const [rows] = await connection.execute(
    `SELECT stop_id, booking_id, name, city, contact, load_kg AS load, cartons, notes, eta,
      distance_km AS distance, tag, sequence_no AS sequence
     FROM trip_stops WHERE trip_code = ? ORDER BY sequence_no`,
    [tripCode],
  );
  return rows;
}

async function insertStops(connection, tripCode, stops = []) {
  for (const [index, stop] of stops.entries()) {
    await connection.execute(
      `INSERT INTO trip_stops
        (trip_code, sequence_no, stop_id, booking_id, name, city, contact, load_kg, cartons, notes, eta, distance_km, tag)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tripCode, index + 1, stop.stopId, stop.bookingId || '', stop.name, stop.city || '', stop.contact || '',
        Number(stop.load || 0), Number(stop.cartons || 0), stop.notes || '', stop.eta || '', Number(stop.distance || 0), stop.tag || 'Store drop-off'],
    );
  }
}

async function insertTrip(connection, trip) {
  await connection.execute(
    `INSERT INTO trips
      (trip_code, vehicle_id, vehicle_registration, vehicle_name, vehicle_type, vehicle_capacity,
       driver, driver_phone, departure, return_time, origin, notes, booking_ids, total_load,
       total_distance, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [trip.tripCode, trip.vehicle.id, trip.vehicle.registration, trip.vehicle.name || '', trip.vehicle.type || '',
      Number(trip.vehicle.capacity), trip.driver, trip.driverPhone || '', trip.departure, trip.returnTime || '',
      trip.origin || 'Western Depot #04 (Colombo Central Hub Bay 04)', trip.notes || '',
      JSON.stringify(trip.bookingIds || []), Number(trip.totalLoad || 0), Number(trip.totalDistance || 0), trip.status || 'Ready to Stage'],
  );
}

export async function listTrips() {
  const [rows] = await pool.query(`SELECT ${tripColumns} FROM trips ORDER BY created_at DESC`);
  if (!rows.length) return [];
  const codes = rows.map(row => row.trip_code);
  const placeholders = codes.map(() => '?').join(', ');
  const [stopRows] = await pool.execute(
    `SELECT trip_code, stop_id, booking_id, name, city, contact, load_kg AS load, cartons, notes, eta,
      distance_km AS distance, tag, sequence_no AS sequence
     FROM trip_stops WHERE trip_code IN (${placeholders}) ORDER BY trip_code, sequence_no`,
    codes,
  );
  const groupedStops = new Map(codes.map(code => [code, []]));
  for (const stop of stopRows) groupedStops.get(stop.trip_code)?.push(stop);
  return rows.map(row => mapTrip(row, groupedStops.get(row.trip_code)));
}

export async function getTrip(tripCode, connection = pool) {
  const [rows] = await connection.execute(`SELECT ${tripColumns} FROM trips WHERE trip_code = ?`, [tripCode]);
  if (!rows.length) return null;
  return mapTrip(rows[0], await loadStops(connection, tripCode));
}

export async function createTrip(trip) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await insertTrip(connection, trip);
    await insertStops(connection, trip.tripCode, trip.stops);
    const savedTrip = await getTrip(trip.tripCode, connection);
    await connection.commit();
    return savedTrip;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateTrip(tripCode, updates) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const current = await getTrip(tripCode, connection);
    if (!current) {
      await connection.rollback();
      return null;
    }
    const trip = {
      ...current,
      ...updates,
      vehicle: { ...current.vehicle, ...(updates.vehicle || {}) },
      stops: updates.stops || current.stops,
    };
    await connection.execute(
      `UPDATE trips SET vehicle_id = ?, vehicle_registration = ?, vehicle_name = ?, vehicle_type = ?,
        vehicle_capacity = ?, driver = ?, driver_phone = ?, departure = ?, return_time = ?, origin = ?,
        notes = ?, booking_ids = ?, total_load = ?, total_distance = ?, status = ? WHERE trip_code = ?`,
      [trip.vehicle.id, trip.vehicle.registration, trip.vehicle.name || '', trip.vehicle.type || '',
        Number(trip.vehicle.capacity), trip.driver, trip.driverPhone || '', trip.departure, trip.returnTime || '',
        trip.origin || 'Western Depot #04 (Colombo Central Hub Bay 04)', trip.notes || '',
        JSON.stringify(trip.bookingIds || []), Number(trip.totalLoad || 0), Number(trip.totalDistance || 0), trip.status, tripCode],
    );
    if (updates.stops) {
      await connection.execute('DELETE FROM trip_stops WHERE trip_code = ?', [tripCode]);
      await insertStops(connection, tripCode, trip.stops);
    }
    const savedTrip = await getTrip(tripCode, connection);
    await connection.commit();
    return savedTrip;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
