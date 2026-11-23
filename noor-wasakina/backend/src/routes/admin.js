import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { query } from '../db/pool.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

// Slows down brute-force attempts against the admin secret.
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'محاولات كثيرة، حاول بعد ١٥ دقيقة' },
});

// POST /api/admin/verify  — checks the admin secret (used by the /admin login)
router.post('/verify', verifyLimiter, requireAdmin, (req, res) => {
  res.json({ data: { ok: true } });
});

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (req, res) => {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*) FROM posts)                          AS posts,
      (SELECT COALESCE(SUM(views), 0) FROM posts)           AS views,
      (SELECT COALESCE(SUM(likes), 0) FROM posts)           AS likes,
      (SELECT COUNT(*) FROM messages)                       AS messages,
      (SELECT COUNT(*) FROM messages WHERE is_read = FALSE) AS unread,
      (SELECT COUNT(*) FROM daily_quotes)                   AS quotes
  `);
  res.json({ data: rows[0] });
});

export default router;
