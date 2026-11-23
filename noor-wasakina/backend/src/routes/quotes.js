import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { HttpError } from '../middleware/errors.js';
import { cleanEnum, cleanText, parseId } from '../validation.js';

const router = Router();
const QUOTE_COLUMNS = 'id, kind, text, translation, source';

// Day number in the Amman/Jerusalem time zone, so the quote changes at local midnight.
function localDayNumber(date = new Date()) {
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: process.env.QUOTE_TIMEZONE || 'Asia/Amman',
  }).format(date);
  return Math.floor(Date.parse(`${ymd}T00:00:00Z`) / 86_400_000);
}

// GET /api/daily-quote   — same quote for everyone all day, rotates daily
router.get('/daily-quote', async (req, res) => {
  const { rows: countRows } = await query('SELECT COUNT(*) AS total FROM daily_quotes');
  const total = countRows[0].total;
  if (!total) throw new HttpError(404, 'لا توجد رسائل يومية بعد');

  const day = localDayNumber();
  const { rows } = await query(
    `SELECT ${QUOTE_COLUMNS} FROM daily_quotes ORDER BY id OFFSET $1 LIMIT 1`,
    [day % total],
  );
  res.set('Cache-Control', 'public, max-age=600');
  res.json({ data: rows[0], day });
});

// GET /api/quotes   — all quotes (used by the "another message" button)
router.get('/quotes', async (req, res) => {
  const { rows } = await query(`SELECT ${QUOTE_COLUMNS} FROM daily_quotes ORDER BY id`);
  res.json({ data: rows });
});

// POST /api/quotes  (admin)
router.post('/quotes', requireAdmin, async (req, res) => {
  const body = req.body || {};
  const kind = cleanEnum(body.kind, ['ayah', 'hadith', 'wisdom'], { field: 'النوع' });
  const text = cleanText(body.text, { field: 'النص', required: true, max: 2000 });
  const translation = cleanText(body.translation, { field: 'الترجمة', max: 2000 });
  const source = cleanText(body.source, { field: 'المصدر', required: true, max: 200 });

  const { rows } = await query(
    `INSERT INTO daily_quotes (kind, text, translation, source) VALUES ($1, $2, $3, $4)
     ON CONFLICT (text) DO NOTHING RETURNING ${QUOTE_COLUMNS}`,
    [kind, text, translation, source],
  );
  if (!rows.length) throw new HttpError(409, 'هذا النص موجود مسبقًا');
  res.status(201).json({ data: rows[0] });
});

// DELETE /api/quotes/:id  (admin)
router.delete('/quotes/:id', requireAdmin, async (req, res) => {
  const { rowCount } = await query('DELETE FROM daily_quotes WHERE id = $1', [parseId(req.params.id)]);
  if (!rowCount) throw new HttpError(404, 'النص غير موجود');
  res.status(204).end();
});

export default router;
