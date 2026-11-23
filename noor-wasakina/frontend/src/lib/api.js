import { API_URL } from './config.js';

export const hasApi = Boolean(API_URL);
const REQUEST_TIMEOUT_MS = 60_000;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = 'GET', body, adminSecret, signal } = {}) {
  if (!hasApi) throw new ApiError('لم يتم ربط الموقع بالخادم بعد (VITE_API_URL)', 0);

  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (adminSecret) headers['x-admin-secret'] = adminSecret;

  // Free hosting (Render) sleeps when idle and can take ~50s to wake up.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException('timeout', 'TimeoutError')), REQUEST_TIMEOUT_MS);
  const onAbort = () => controller.abort(signal.reason);
  signal?.addEventListener('abort', onAbort);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    if (controller.signal.aborted) {
      throw new ApiError('الخادم يستغرق وقتًا أطول من المعتاد، حاول بعد لحظات', 0);
    }
    throw new ApiError('تعذّر الاتصال بالخادم. تحقّق من الإنترنت وحاول مجددًا', 0);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }

  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(payload.error || 'حدث خطأ غير متوقع', response.status);
  }
  return payload;
}

export const PostsApi = {
  list: (category, signal) =>
    api(`/api/posts${category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''}`, { signal }),
  view: (id) => api(`/api/posts/${id}/view`, { method: 'POST' }),
  like: (id, action) => api(`/api/posts/${id}/like`, { method: 'POST', body: { action } }),
  create: (data, adminSecret) => api('/api/posts', { method: 'POST', body: data, adminSecret }),
  update: (id, data, adminSecret) => api(`/api/posts/${id}`, { method: 'PATCH', body: data, adminSecret }),
  remove: (id, adminSecret) => api(`/api/posts/${id}`, { method: 'DELETE', adminSecret }),
};

export const QuotesApi = {
  daily: () => api('/api/daily-quote'),
  list: () => api('/api/quotes'),
  create: (data, adminSecret) => api('/api/quotes', { method: 'POST', body: data, adminSecret }),
  remove: (id, adminSecret) => api(`/api/quotes/${id}`, { method: 'DELETE', adminSecret }),
};

export const MessagesApi = {
  send: (data) => api('/api/messages', { method: 'POST', body: data }),
  list: (adminSecret) => api('/api/messages', { adminSecret }),
  markRead: (id, isRead, adminSecret) =>
    api(`/api/messages/${id}`, { method: 'PATCH', body: { is_read: isRead }, adminSecret }),
  remove: (id, adminSecret) => api(`/api/messages/${id}`, { method: 'DELETE', adminSecret }),
};

export const AdminApi = {
  verify: (adminSecret) => api('/api/admin/verify', { method: 'POST', adminSecret }),
  stats: (adminSecret) => api('/api/admin/stats', { adminSecret }),
};
