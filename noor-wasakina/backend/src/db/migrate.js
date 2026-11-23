import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './pool.js';

const schemaPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../schema.sql');

export async function migrate() {
  const sql = await readFile(schemaPath, 'utf8');
  await pool.query(sql);
}
