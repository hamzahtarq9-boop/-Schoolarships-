import pg from 'pg';
import { config } from '../config.js';

// Return BIGINT/COUNT values as JS numbers instead of strings.
pg.types.setTypeParser(20, (value) => Number(value));

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected idle client error:', err.message);
});

export const query = (text, params) => pool.query(text, params);
