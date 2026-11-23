const arabicDigits = new Intl.NumberFormat('ar-EG');

/** 1234 -> "١٬٢٣٤" */
export const toArabicNumber = (n) => arabicDigits.format(Number(n) || 0);

/** 2390 -> "٢٫٤ ألف" , 1500000 -> "١٫٥ مليون" */
export function compactArabic(n) {
  const value = Number(n) || 0;
  const fmt = (x) => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 1 }).format(x);
  if (value >= 1_000_000) return `${fmt(value / 1_000_000)} مليون`;
  if (value >= 1_000) return `${fmt(value / 1_000)} ألف`;
  return fmt(value);
}

export function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

/** Extracts the shortcode from an Instagram reel / post link, or null. */
export function instagramShortcode(url) {
  const match = String(url || '').match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/i);
  if (!match) return null;
  return { type: match[1].toLowerCase() === 'reels' ? 'reel' : match[1].toLowerCase(), code: match[2] };
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
