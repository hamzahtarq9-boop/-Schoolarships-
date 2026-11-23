import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { query } from '../db/pool.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { HttpError } from '../middleware/errors.js';
import { MESSAGE_TYPES, cleanEmail, cleanEnum, cleanText, parseId } from '../validation.js';

const router = Router();

const sendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'أرسلت رسائل كثيرة، حاول بعد قليل' },
});

// POST /api/messages  — public contact / suggestion form
router.post('/', sendLimiter, async (req, res) => {
  const body = req.body || {};

  // Honeypot field: real visitors never fill it, bots usually do.
  if (body.website) return res.status(201).json({ data: { ok: true } });

  const name = cleanText(body.name, { field: 'الاسم', required: true, max: 120 });
  const email = cleanEmail(body.email);
  const type = cleanEnum(body.type, MESSAGE_TYPES, { field: 'نوع الرسالة', fallback: 'question' });
  const subject = cleanText(body.subject, { field: 'الموضوع', max: 200 });
  const message = cleanText(body.message, { field: 'الرسالة', required: true, max: 5000 });
  if (message.length < 5) throw new HttpError(400, 'الرسالة قصيرة جدًا');

  const { rows } = await query(
    `INSERT INTO messages (name, email, type, subject, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, created_at`,
    [name, email, type, subject, message],
  );
  res.status(201).json({ data: rows[0] });
});

// GET /api/messages  (admin)
router.get('/', requireAdmin, async (req, res) => {
  const { rows } = await query(
    `SELECT id, name, email, type, subject, message, is_read, created_at
     FROM messages ORDER BY created_at DESC LIMIT 500`,
  );
  res.json({ data: rows });
});

// PATCH /api/messages/:id  (admin)  body: { "is_read": true }
router.patch('/:id', requireAdmin, async (req, res) => {
  const { rows } = await query(
    'UPDATE messages SET is_read = $1 WHERE id = $2 RETURNING id, is_read',
    [Boolean(req.body?.is_read), parseId(req.params.id)],
  );
  if (!rows.length) throw new HttpError(404, 'الرسالة غير موجودة');
  res.json({ data: rows[0] });
});

// DELETE /api/messages/:id  (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { rowCount } = await query('DELETE FROM messages WHERE id = $1', [parseId(req.params.id)]);
  if (!rowCount) throw new HttpError(404, 'الرسالة غير موجودة');
  res.status(204).end();
});

export default router;
