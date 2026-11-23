import { assertConfig, config } from './config.js';
import { createApp } from './app.js';
import { migrate } from './db/migrate.js';
import { pool } from './db/pool.js';

assertConfig();

if (config.autoMigrate) {
  try {
    await migrate();
    console.log('[db] Schema checked (tables + seed data).');
  } catch (err) {
    console.error('[db] Auto-migration failed:', err.message);
    console.error('     Check DATABASE_URL / DATABASE_SSL, or run schema.sql manually.');
  }
}

const app = createApp();
const server = app.listen(config.port, () => {
  console.log(`[api] Noor wa Sakina API listening on port ${config.port}`);
});

const shutdown = (signal) => {
  console.log(`[api] ${signal} received, shutting down…`);
  server.close(() => pool.end().finally(() => process.exit(0)));
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
