import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { HttpError } from '../middleware/errors.js';
import { CATEGORIES, cleanEnum, cleanText, cleanUrl, parseId } from '../validation.js';

const router = Router();

const POST_COLUMNS = `id, title, title_en, description, instagram_url, thumbnail_url,
  category, views, likes, is_featured, created_at`;

function readPostBody(body, { partial = false } = {}) {
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
  const data = {};
  if (!partial || has('title')) data.title = cleanText(body.title, { field: 'العنوان', required: true, max: 200 });
  if (!partial || has('title_en')) data.title_en = cleanText(body.title_en, { field: 'العنوان بالإنجليزية', max: 200 });
  if (!partial || has('description')) data.description = cleanText(body.description, { field: 'الوصف', max: 2000 });
  if (!partial || has('instagram_url')) {
    data.instagram_url = cleanUrl(body.instagram_url, { field: 'رابط إنستغرام', required: true, instagramOnly: true });
  }
  if (!partial || has('thumbnail_url')) data.thumbnail_url = cleanUrl(body.thumbnail_url, { field: 'رابط الصورة' });
  if (!partial || has('category')) data.category = cleanEnum(body.category, CATEGORIES, { field: 'التصنيف' });
  if (!partial || has('is_featured')) data.is_featured = Boolean(body.is_featured);
  return data;
}

// GET /api/posts?category=tadabbur&limit=24&featured=true
router.get('/', async (req, res) => {
  const { category, featured } = req.query;
  const limit = Math.min(Math.max(Number(req.query.limit) || 60, 1), 100);
  const where = [];
  const params = [];

  if (category && category !== 'all') {
    params.push(cleanEnum(category, CATEGORIES, { field: 'التصنيف' }));
    where.push(`category = $${params.length}`);
  }
  if (featured === 'true') where.push('is_featured = TRUE');

  params.push(limit);
  const sql = `SELECT ${POST_COLUMNS} FROM posts
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY is_featured DESC, created_at DESC, id DESC
    LIMIT $${params.length}`;

  const { rows } = await query(sql, params);
  res.json({ data: rows, categories: CATEGORIES });
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  const { rows } = await query(`SELECT ${POST_COLUMNS} FROM posts WHERE id = $1`, [parseId(req.params.id)]);
  if (!rows.length) throw new HttpError(404, 'المنشور غير موجود');
  res.json({ data: rows[0] });
});

// POST /api/posts  (admin)
router.post('/', requireAdmin, async (req, res) => {
  const p = readPostBody(req.body || {});
  const { rows } = await query(
    `INSERT INTO posts (title, title_en, description, instagram_url, thumbnail_url, category, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${POST_COLUMNS}`,
    [p.title, p.title_en, p.description, p.instagram_url, p.thumbnail_url, p.category, p.is_featured],
  );
  res.status(201).json({ data: rows[0] });
});

// PATCH /api/posts/:id  (admin)
router.patch('/:id', requireAdmin, async (req, res) => {
  const id = parseId(req.params.id);
  const data = readPostBody(req.body || {}, { partial: true });
  const keys = Object.keys(data);
  if (!keys.length) throw new HttpError(400, 'لا توجد حقول للتعديل');

  const sets = keys.map((key, i) => `${key} = $${i + 1}`);
  const { rows } = await query(
    `UPDATE posts SET ${sets.join(', ')} WHERE id = $${keys.length + 1} RETURNING ${POST_COLUMNS}`,
    [...keys.map((key) => data[key]), id],
  );
  if (!rows.length) throw new HttpError(404, 'المنشور غير موجود');
  res.json({ data: rows[0] });
});

// DELETE /api/posts/:id  (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { rowCount } = await query('DELETE FROM posts WHERE id = $1', [parseId(req.params.id)]);
  if (!rowCount) throw new HttpError(404, 'المنشور غير موجود');
  res.status(204).end();
});

// POST /api/posts/:id/view   — increments the view counter
router.post('/:id/view', async (req, res) => {
  const { rows } = await query(
    'UPDATE posts SET views = views + 1 WHERE id = $1 RETURNING id, views, likes',
    [parseId(req.params.id)],
  );
  if (!rows.length) throw new HttpError(404, 'المنشور غير موجود');
  res.json({ data: rows[0] });
});

// POST /api/posts/:id/like   body: { "action": "like" | "unlike" }
router.post('/:id/like', async (req, res) => {
  const delta = req.body?.action === 'unlike' ? -1 : 1;
  const { rows } = await query(
    'UPDATE posts SET likes = GREATEST(likes + $1, 0) WHERE id = $2 RETURNING id, views, likes',
    [delta, parseId(req.params.id)],
  );
  if (!rows.length) throw new HttpError(404, 'المنشور غير موجود');
  res.json({ data: rows[0] });
});

export default router;
