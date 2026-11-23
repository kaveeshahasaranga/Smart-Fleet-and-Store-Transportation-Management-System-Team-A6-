import mysql from 'mysql2/promise';
import { env } from './env.js';

export const pool = mysql.createPool({
  ...env.mysql,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  timezone: 'Z',
});

export async function connectDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trips (
      trip_code VARCHAR(64) PRIMARY KEY,
      vehicle_id VARCHAR(100) NOT NULL,
      vehicle_registration VARCHAR(40) NOT NULL,
      vehicle_name VARCHAR(100) NOT NULL DEFAULT '',
      vehicle_type VARCHAR(60) NOT NULL DEFAULT '',
      vehicle_capacity DECIMAL(12, 2) NOT NULL,
      driver VARCHAR(100) NOT NULL,
      driver_phone VARCHAR(25) NOT NULL DEFAULT '',
      departure VARCHAR(40) NOT NULL,
      return_time VARCHAR(40) NOT NULL DEFAULT '',
      origin VARCHAR(160) NOT NULL DEFAULT 'Western Depot #04 (Colombo Central Hub Bay 04)',
      notes VARCHAR(500) NOT NULL DEFAULT '',
      booking_ids JSON NOT NULL,
      total_load DECIMAL(12, 2) NOT NULL DEFAULT 0,
      total_distance DECIMAL(12, 2) NOT NULL DEFAULT 0,
      status VARCHAR(32) NOT NULL DEFAULT 'Ready to Stage',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_trips_status_created (status, created_at)
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trip_stops (
      trip_code VARCHAR(64) NOT NULL,
      sequence_no INT UNSIGNED NOT NULL,
      stop_id VARCHAR(100) NOT NULL,
      booking_id VARCHAR(100) NOT NULL DEFAULT '',
      name VARCHAR(160) NOT NULL,
      city VARCHAR(100) NOT NULL DEFAULT '',
      contact VARCHAR(100) NOT NULL DEFAULT '',
      load_kg DECIMAL(12, 2) NOT NULL DEFAULT 0,
      cartons INT UNSIGNED NOT NULL DEFAULT 0,
      notes VARCHAR(500) NOT NULL DEFAULT '',
      eta VARCHAR(40) NOT NULL DEFAULT '',
      distance_km DECIMAL(12, 2) NOT NULL DEFAULT 0,
      tag VARCHAR(60) NOT NULL DEFAULT 'Store drop-off',
      PRIMARY KEY (trip_code, sequence_no),
      CONSTRAINT fk_trip_stops_trip FOREIGN KEY (trip_code) REFERENCES trips (trip_code) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicle_latest_locations (
      vehicle_id VARCHAR(100) PRIMARY KEY,
      trip_code VARCHAR(64) NULL,
      registration VARCHAR(40) NOT NULL DEFAULT '',
      latitude DECIMAL(10, 7) NOT NULL,
      longitude DECIMAL(10, 7) NOT NULL,
      speed_kph DECIMAL(7, 2) NULL,
      heading_deg DECIMAL(6, 2) NULL,
      recorded_at DATETIME(3) NOT NULL,
      received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_vehicle_location_trip (trip_code),
      INDEX idx_vehicle_location_recorded (recorded_at)
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicle_location_events (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      vehicle_id VARCHAR(100) NOT NULL,
      trip_code VARCHAR(64) NULL,
      registration VARCHAR(40) NOT NULL DEFAULT '',
      latitude DECIMAL(10, 7) NOT NULL,
      longitude DECIMAL(10, 7) NOT NULL,
      speed_kph DECIMAL(7, 2) NULL,
      heading_deg DECIMAL(6, 2) NULL,
      recorded_at DATETIME(3) NOT NULL,
      received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_location_events_vehicle_time (vehicle_id, recorded_at),
      INDEX idx_location_events_trip_time (trip_code, recorded_at)
    ) ENGINE=InnoDB
  `);
  await pool.query('SELECT 1');
  console.log('MySQL connected');
}

export async function closeDatabase() {
  await pool.end();
}
