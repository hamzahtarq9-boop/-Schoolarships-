import 'dotenv/config';

const toList = (value) =>
  (value || '')
    .split(',')
    .map((item) => item.trim().replace(/\/$/, ''))
    .filter(Boolean);

export const config = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: (process.env.DATABASE_SSL || 'true').toLowerCase() !== 'false',
  adminSecret: process.env.ADMIN_SECRET,
  corsOrigins: toList(process.env.CORS_ORIGINS),
  autoMigrate: (process.env.AUTO_MIGRATE || 'true').toLowerCase() !== 'false',
  isProduction: process.env.NODE_ENV === 'production',
};

export function assertConfig() {
  const problems = [];
  if (!config.databaseUrl) problems.push('DATABASE_URL is not set');
  if (!config.adminSecret || config.adminSecret.length < 12) {
    problems.push('ADMIN_SECRET must be set and at least 12 characters long');
  }
  if (problems.length) {
    console.error('\n[config] Cannot start the server:\n  - ' + problems.join('\n  - ') + '\n');
    console.error('Copy .env.example to .env and fill in the values.\n');
    process.exit(1);
  }
}
