import { HttpError } from './middleware/errors.js';

export const CATEGORIES = ['tadabbur', 'raqaiq', 'adhkar', 'qisas'];
export const MESSAGE_TYPES = ['question', 'suggestion', 'feedback'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function cleanText(value, { field, required = false, max = 500 }) {
  if (value === undefined || value === null || String(value).trim() === '') {
    if (required) throw new HttpError(400, `الحقل "${field}" مطلوب`);
    return null;
  }
  const text = String(value).trim();
  if (text.length > max) {
    throw new HttpError(400, `الحقل "${field}" أطول من المسموح (${max} حرف)`);
  }
  return text;
}

export function cleanUrl(value, { field, required = false, instagramOnly = false }) {
  const text = cleanText(value, { field, required, max: 500 });
  if (text === null) return null;
  let url;
  try {
    url = new URL(text);
  } catch {
    throw new HttpError(400, `الرابط في "${field}" غير صالح`);
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new HttpError(400, `الرابط في "${field}" يجب أن يبدأ بـ https`);
  }
  if (instagramOnly && !/(^|\.)instagram\.com$/i.test(url.hostname)) {
    throw new HttpError(400, 'يجب أن يكون الرابط من instagram.com');
  }
  return url.toString();
}

export function cleanEmail(value) {
  const text = cleanText(value, { field: 'البريد الإلكتروني', max: 200 });
  if (text === null) return null;
  if (!EMAIL_RE.test(text)) throw new HttpError(400, 'البريد الإلكتروني غير صالح');
  return text.toLowerCase();
}

export function cleanEnum(value, allowed, { field, fallback }) {
  if (value === undefined || value === null || value === '') {
    if (fallback !== undefined) return fallback;
    throw new HttpError(400, `الحقل "${field}" مطلوب`);
  }
  if (!allowed.includes(value)) {
    throw new HttpError(400, `قيمة "${field}" غير صحيحة`, { allowed });
  }
  return value;
}

export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'المعرّف غير صالح');
  return id;
}
