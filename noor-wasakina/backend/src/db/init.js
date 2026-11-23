// Standalone script: `npm run db:init` creates the tables and seed data.
import { assertConfig } from '../config.js';
import { migrate } from './migrate.js';
import { pool } from './pool.js';

assertConfig();

try {
  await migrate();
  console.log('[db] Schema and seed data are ready.');
} catch (err) {
  console.error('[db] Initialisation failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
