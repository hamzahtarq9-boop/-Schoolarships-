import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Heart, Loader2, Pencil, Plus, Save, Star, Trash2, X } from 'lucide-react';
import ReelCover from '../reels/ReelCover.jsx';
import { CATEGORIES, categoryLabel } from '../../lib/data.js';
import { PostsApi } from '../../lib/api.js';
import { compactArabic, instagramShortcode, toArabicNumber } from '../../lib/format.js';

const EMPTY = { title: '', title_en: '', description: '', instagram_url: '', thumbnail_url: '', category: 'tadabbur', is_featured: false };
const POST_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'all');

export default function PostsManager({ secret, notify, onChange }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await PostsApi.list('all');
      setPosts(res.data);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const startEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title || '',
      title_en: post.title_en || '',
      description: post.description || '',
      instagram_url: post.instagram_url || '',
      thumbnail_url: post.thumbnail_url || '',
      category: post.category,
      is_featured: post.is_featured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.instagram_url.trim()) return notify('العنوان ورابط إنستغرام مطلوبان', 'error');
    setSaving(true);
    try {
      if (editingId) {
        const res = await PostsApi.update(editingId, form, secret);
        setPosts((list) => list.map((p) => (p.id === editingId ? res.data : p)));
        notify('تم تحديث الريل ✨');
      } else {
        const res = await PostsApi.create(form, secret);
        setPosts((list) => [res.data, ...list]);
        notify('تمت إضافة الريل بنجاح ✨');
      }
      cancelEdit();
      onChange();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (post) => {
    try {
      const res = await PostsApi.update(post.id, { is_featured: !post.is_featured }, secret);
      setPosts((list) => list.map((p) => (p.id === post.id ? res.data : p)));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const remove = async (post) => {
    if (!window.confirm(`حذف «${post.title}» نهائيًا؟`)) return;
    try {
      await PostsApi.remove(post.id, secret);
      setPosts((list) => list.filter((p) => p.id !== post.id));
      if (editingId === post.id) cancelEdit();
      notify('تم حذف الريل');
      onChange();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const validLink = form.instagram_url && instagramShortcode(form.instagram_url);
  const preview = { ...form, id: 0, views: 0, likes: 0, thumbnail_url: form.thumbnail_url || null };

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="card grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_220px]">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-amiri text-2xl font-bold text-ink">{editingId ? 'تعديل الريل' : 'إضافة ريل جديد'}</h2>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
                <X className="h-4 w-4" /> إلغاء التعديل
              </button>
            )}
          </div>

          <div>
            <label htmlFor="p-url" className="label">رابط الريل على إنستغرام *</label>
            <input id="p-url" dir="ltr" className="input text-left" value={form.instagram_url} onChange={update('instagram_url')} placeholder="https://www.instagram.com/reel/XXXXXXXX/" />
            <p className={`mt-1.5 text-xs ${form.instagram_url && !validLink ? 'text-amber-600 dark:text-amber-300' : 'text-muted'}`}>
              {form.instagram_url && !validLink
                ? 'تنبيه: الرابط ليس رابط ريل مباشر، سيفتح الحساب بدل المشغّل داخل الموقع.'
                : 'انسخ الرابط من زر «مشاركة ← نسخ الرابط» في إنستغرام.'}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="p-title" className="label">العنوان بالعربية *</label>
              <input id="p-title" className="input" value={form.title} onChange={update('title')} maxLength={200} placeholder="قلبك… من أيّ نوع؟" />
            </div>
            <div>
              <label htmlFor="p-title-en" className="label">العنوان بالإنجليزية</label>
              <input id="p-title-en" dir="ltr" className="input text-left" value={form.title_en} onChange={update('title_en')} maxLength={200} placeholder="Which heart is yours?" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="p-cat" className="label">التصنيف *</label>
              <select id="p-cat" className="input" value={form.category} onChange={update('category')}>
                {POST_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="p-thumb" className="label">رابط صورة الغلاف <span className="font-normal text-muted">(اختياري)</span></label>
              <input id="p-thumb" dir="ltr" className="input text-left" value={form.thumbnail_url} onChange={update('thumbnail_url')} placeholder="https://…/cover.jpg" />
            </div>
          </div>

          <div>
            <label htmlFor="p-desc" className="label">وصف قصير</label>
            <textarea id="p-desc" rows={3} className="input resize-none leading-7" value={form.description} onChange={update('description')} maxLength={2000} placeholder="جملة أو جملتان عن الريل" />
          </div>

          <label className="flex w-fit cursor-pointer items-center gap-3 rounded-2xl border border-line/25 px-4 py-3 transition hover:border-gold-400">
            <input type="checkbox" checked={form.is_featured} onChange={update('is_featured')} className="h-5 w-5 accent-[#D4AF37]" />
            <Star className={`h-5 w-5 ${form.is_featured ? 'fill-gold-400 text-gold-400' : 'text-muted'}`} />
            ريل مميّز (يظهر أولًا)
          </label>

          <button type="submit" disabled={saving} className="btn-gold w-full sm:w-auto">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : editingId ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingId ? 'حفظ التعديلات' : 'نشر الريل'}
          </button>
        </div>

        <div>
          <p className="label text-center">معاينة</p>
          <div className="group relative mx-auto aspect-[9/16] w-48 overflow-hidden rounded-3xl border border-gold-500/40 shadow-glow">
            <ReelCover post={preview} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10">
              <p className="font-amiri text-base font-bold leading-snug text-cream-50">{form.title || 'عنوان الريل'}</p>
              <p className="mt-0.5 text-[11px] text-gold-200">{categoryLabel(form.category)}</p>
            </div>
          </div>
        </div>
      </form>

      <section>
        <h2 className="mb-4 font-amiri text-2xl font-bold text-ink">الريلز المنشورة ({toArabicNumber(posts.length)})</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
        ) : posts.length === 0 ? (
          <p className="card p-8 text-center text-muted">لا توجد ريلز بعد. أضف أول ريل من النموذج أعلاه.</p>
        ) : (
          <ul className="grid gap-3">
            <AnimatePresence initial={false}>
              {posts.map((post) => (
                <motion.li
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className={`card flex flex-wrap items-center gap-4 p-4 ${editingId === post.id ? '!border-gold-400 shadow-glow' : ''}`}
                >
                  <div className="relative aspect-[9/16] w-14 shrink-0 overflow-hidden rounded-xl border border-gold-500/30">
                    <ReelCover post={post} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-amiri text-lg font-bold text-ink">{post.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="rounded-full bg-gold-500/10 px-2 py-0.5 text-accent">{categoryLabel(post.category)}</span>
                      <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{compactArabic(post.views)}</span>
                      <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{compactArabic(post.likes)}</span>
                      <a href={post.instagram_url} target="_blank" rel="noopener noreferrer" dir="ltr" className="max-w-[16rem] truncate hover:text-accent">
                        {post.instagram_url}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton label={post.is_featured ? 'إلغاء التمييز' : 'تمييز'} onClick={() => toggleFeatured(post)}>
                      <Star className={`h-5 w-5 ${post.is_featured ? 'fill-gold-400 text-gold-400' : ''}`} />
                    </IconButton>
                    <IconButton label="تعديل" onClick={() => startEdit(post)}>
                      <Pencil className="h-5 w-5" />
                    </IconButton>
                    <IconButton label="حذف" danger onClick={() => remove(post)}>
                      <Trash2 className="h-5 w-5" />
                    </IconButton>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </div>
  );
}

export function IconButton({ label, onClick, danger = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-10 w-10 place-items-center rounded-xl border border-transparent text-muted transition ${
        danger ? 'hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-500' : 'hover:border-gold-400/50 hover:bg-gold-500/10 hover:text-accent'
      }`}
    >
      {children}
    </button>
  );
}
