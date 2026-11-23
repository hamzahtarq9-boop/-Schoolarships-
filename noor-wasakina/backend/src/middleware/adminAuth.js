import crypto from 'node:crypto';
import { config } from '../config.js';

function safeEqual(a, b) {
  const left = crypto.createHash('sha256').update(String(a)).digest();
  const right = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(left, right);
}

// Protects admin routes with the ADMIN_SECRET sent in the `x-admin-secret` header.
export function requireAdmin(req, res, next) {
  const provided = req.get('x-admin-secret');
  if (!provided || !safeEqual(provided, config.adminSecret)) {
    return res.status(401).json({ error: 'غير مصرّح: مفتاح الإدارة غير صحيح' });
  }
  return next();
}
