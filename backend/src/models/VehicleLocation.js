import { pool } from '../config/database.js';

const locationColumns = `vehicle_id, trip_code, registration, latitude, longitude, speed_kph,
  heading_deg, recorded_at, received_at`;

function mapLocation(row) {
  return {
    vehicleId: row.vehicle_id,
    tripCode: row.trip_code,
    registration: row.registration,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    speedKph: row.speed_kph === null ? null : Number(row.speed_kph),
    heading: row.heading_deg === null ? null : Number(row.heading_deg),
    recordedAt: row.recorded_at,
    receivedAt: row.received_at,
  };
}

export async function ingestVehicleLocation(location) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [currentRows] = await connection.execute(
      'SELECT recorded_at FROM vehicle_latest_locations WHERE vehicle_id = ? FOR UPDATE',
      [location.vehicleId],
    );
    const stale = currentRows.length > 0 && new Date(currentRows[0].recorded_at) > location.recordedAt;

    await connection.execute(
      `INSERT INTO vehicle_location_events
        (vehicle_id, trip_code, registration, latitude, longitude, speed_kph, heading_deg, recorded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [location.vehicleId, location.tripCode || null, location.registration || '', location.latitude,
        location.longitude, location.speedKph ?? null, location.heading ?? null, location.recordedAt],
    );

    await connection.execute(
      `INSERT INTO vehicle_latest_locations
        (vehicle_id, trip_code, registration, latitude, longitude, speed_kph, heading_deg, recorded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         trip_code = IF(VALUES(recorded_at) >= vehicle_latest_locations.recorded_at, VALUES(trip_code), vehicle_latest_locations.trip_code),
         registration = IF(VALUES(recorded_at) >= vehicle_latest_locations.recorded_at, VALUES(registration), vehicle_latest_locations.registration),
         latitude = IF(VALUES(recorded_at) >= vehicle_latest_locations.recorded_at, VALUES(latitude), vehicle_latest_locations.latitude),
         longitude = IF(VALUES(recorded_at) >= vehicle_latest_locations.recorded_at, VALUES(longitude), vehicle_latest_locations.longitude),
         speed_kph = IF(VALUES(recorded_at) >= vehicle_latest_locations.recorded_at, VALUES(speed_kph), vehicle_latest_locations.speed_kph),
         heading_deg = IF(VALUES(recorded_at) >= vehicle_latest_locations.recorded_at, VALUES(heading_deg), vehicle_latest_locations.heading_deg),
         recorded_at = GREATEST(vehicle_latest_locations.recorded_at, VALUES(recorded_at))`,
      [location.vehicleId, location.tripCode || null, location.registration || '', location.latitude,
        location.longitude, location.speedKph ?? null, location.heading ?? null, location.recordedAt],
    );

    const [rows] = await connection.execute(
      `SELECT ${locationColumns} FROM vehicle_latest_locations WHERE vehicle_id = ?`,
      [location.vehicleId],
    );
    await connection.commit();
    return { location: mapLocation(rows[0]), stale };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listLatestVehicleLocations({ tripCode } = {}) {
  const [rows] = tripCode
    ? await pool.execute(`SELECT ${locationColumns} FROM vehicle_latest_locations WHERE trip_code = ? ORDER BY recorded_at DESC`, [tripCode])
    : await pool.query(`SELECT ${locationColumns} FROM vehicle_latest_locations ORDER BY recorded_at DESC`);
  return rows.map(mapLocation);
}

export async function getLatestVehicleLocation(vehicleId) {
  const [rows] = await pool.execute(
    `SELECT ${locationColumns} FROM vehicle_latest_locations WHERE vehicle_id = ?`,
    [vehicleId],
  );
  return rows.length ? mapLocation(rows[0]) : null;
}

export async function listVehicleLocationHistory(vehicleId, limit = 100) {
  const safeLimit = Math.min(500, Math.max(1, Math.floor(Number(limit) || 100)));
  const [rows] = await pool.execute(
    `SELECT id, ${locationColumns} FROM vehicle_location_events
     WHERE vehicle_id = ? ORDER BY recorded_at DESC, id DESC LIMIT ${safeLimit}`,
    [vehicleId],
  );
  return rows.map(row => ({ id: Number(row.id), ...mapLocation(row) }));
}
