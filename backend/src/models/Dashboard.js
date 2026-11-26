import { pool } from '../config/database.js';

function dateClauses({ from, to } = {}, column = 'created_at') {
  const clauses = [];
  const values = [];
  if (from) { clauses.push(`${column} >= ?`); values.push(`${from} 00:00:00`); }
  if (to) { clauses.push(`${column} < DATE_ADD(?, INTERVAL 1 DAY)`); values.push(`${to} 00:00:00`); }
  return { clauses, values };
}

export async function getDashboardKpis(range = {}) {
  const { clauses, values } = dateClauses(range, 'created_at');
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const [tripRows] = await pool.execute(
    `SELECT COUNT(*) AS total_trips,
      SUM(status = 'Draft') AS draft_trips,
      SUM(status = 'Ready to Stage') AS ready_trips,
      SUM(status = 'Scheduled') AS scheduled_trips,
      SUM(status = 'In Transit') AS in_transit_trips,
      SUM(status = 'Completed') AS completed_trips,
      SUM(status = 'Cancelled') AS cancelled_trips,
      COUNT(DISTINCT vehicle_id) AS assigned_vehicles,
      COALESCE(SUM(total_load), 0) AS total_load_kg,
      COALESCE(SUM(total_distance), 0) AS total_distance_km,
      COALESCE(SUM(JSON_LENGTH(booking_ids)), 0) AS allocated_booking_count
     FROM trips ${where}`,
    values,
  );
  const stopDateRange = dateClauses(range, 't.created_at');
  const [stopRows] = await pool.execute(
    `SELECT COUNT(*) AS total_stops FROM trip_stops s
     INNER JOIN trips t ON t.trip_code = s.trip_code
     ${stopDateRange.clauses.length ? `WHERE ${stopDateRange.clauses.join(' AND ')}` : ''}`,
    stopDateRange.values,
  );
  const [gpsRows] = await pool.query(
    `SELECT COUNT(*) AS vehicles_with_gps,
      SUM(recorded_at >= UTC_TIMESTAMP(3) - INTERVAL 5 MINUTE) AS fresh_gps_vehicles,
      MAX(recorded_at) AS latest_gps_at
     FROM vehicle_latest_locations`,
  );
  const trips = tripRows[0];
  const gps = gpsRows[0];
  return {
    generatedAt: new Date().toISOString(),
    range: { from: range.from || null, to: range.to || null },
    trips: {
      total: Number(trips.total_trips || 0),
      draft: Number(trips.draft_trips || 0),
      readyToStage: Number(trips.ready_trips || 0),
      scheduled: Number(trips.scheduled_trips || 0),
      inTransit: Number(trips.in_transit_trips || 0),
      completed: Number(trips.completed_trips || 0),
      cancelled: Number(trips.cancelled_trips || 0),
    },
    operations: {
      totalStops: Number(stopRows[0].total_stops || 0),
      totalLoadKg: Number(trips.total_load_kg || 0),
      totalDistanceKm: Number(trips.total_distance_km || 0),
      allocatedBookings: Number(trips.allocated_booking_count || 0),
    },
    fleet: {
      vehiclesAssignedToTrips: Number(trips.assigned_vehicles || 0),
      vehiclesWithGps: Number(gps.vehicles_with_gps || 0),
      freshGpsVehicles: Number(gps.fresh_gps_vehicles || 0),
      latestGpsAt: gps.latest_gps_at,
    },
  };
}

export async function queryTripReport(filters) {
  const conditions = [];
  const values = [];
  const dateRange = dateClauses(filters, 't.created_at');
  conditions.push(...dateRange.clauses);
  values.push(...dateRange.values);
  if (filters.status) { conditions.push('t.status = ?'); values.push(filters.status); }
  if (filters.vehicleId) { conditions.push('t.vehicle_id = ?'); values.push(filters.vehicleId); }
  if (filters.tripCode) { conditions.push('t.trip_code LIKE ?'); values.push(`%${filters.tripCode}%`); }
  if (filters.driver) { conditions.push('t.driver LIKE ?'); values.push(`%${filters.driver}%`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [countRows] = await pool.execute(`SELECT COUNT(*) AS total FROM trips t ${where}`, values);
  const pageValues = [...values, filters.limit, (filters.page - 1) * filters.limit];
  const [rows] = await pool.execute(
    `SELECT t.trip_code, t.vehicle_id, t.vehicle_registration, t.vehicle_name, t.vehicle_type,
      t.vehicle_capacity, t.driver, t.departure, t.return_time, t.origin, t.total_load,
      t.total_distance, t.status, t.booking_ids, t.created_at, t.updated_at,
      COUNT(s.sequence_no) AS stop_count,
      GROUP_CONCAT(s.name ORDER BY s.sequence_no SEPARATOR ' → ') AS route
     FROM trips t LEFT JOIN trip_stops s ON s.trip_code = t.trip_code ${where}
     GROUP BY t.trip_code ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
    pageValues,
  );
  return {
    items: rows.map(row => ({
      tripCode: row.trip_code,
      vehicle: { id: row.vehicle_id, registration: row.vehicle_registration, name: row.vehicle_name, type: row.vehicle_type, capacity: Number(row.vehicle_capacity) },
      driver: row.driver,
      departure: row.departure,
      returnTime: row.return_time,
      origin: row.origin,
      totalLoad: Number(row.total_load),
      totalDistance: Number(row.total_distance),
      status: row.status,
      bookingIds: typeof row.booking_ids === 'string' ? JSON.parse(row.booking_ids) : row.booking_ids,
      stopCount: Number(row.stop_count),
      route: row.route || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: Number(countRows[0].total),
      pages: Math.ceil(Number(countRows[0].total) / filters.limit),
    },
  };
}

export async function queryTrackingReport(filters) {
  const conditions = [];
  const values = [];
  if (filters.vehicleId) { conditions.push('vehicle_id = ?'); values.push(filters.vehicleId); }
  if (filters.tripCode) { conditions.push('trip_code = ?'); values.push(filters.tripCode); }
  const dateRange = dateClauses(filters, 'recorded_at');
  conditions.push(...dateRange.clauses);
  values.push(...dateRange.values);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [countRows] = await pool.execute(`SELECT COUNT(*) AS total FROM vehicle_location_events ${where}`, values);
  const [rows] = await pool.execute(
    `SELECT id, vehicle_id, trip_code, registration, latitude, longitude, speed_kph, heading_deg,
      recorded_at, received_at FROM vehicle_location_events ${where}
     ORDER BY recorded_at DESC, id DESC LIMIT ? OFFSET ?`,
    [...values, filters.limit, (filters.page - 1) * filters.limit],
  );
  return {
    items: rows.map(row => ({
      id: Number(row.id),
      vehicleId: row.vehicle_id,
      tripCode: row.trip_code,
      registration: row.registration,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      speedKph: row.speed_kph === null ? null : Number(row.speed_kph),
      heading: row.heading_deg === null ? null : Number(row.heading_deg),
      recordedAt: row.recorded_at,
      receivedAt: row.received_at,
    })),
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: Number(countRows[0].total),
      pages: Math.ceil(Number(countRows[0].total) / filters.limit),
    },
  };
}
