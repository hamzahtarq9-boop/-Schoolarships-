import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { IconButton } from './PostsManager.jsx';
import { QuotesApi } from '../../lib/api.js';

const KINDS = [
  { id: 'ayah', label: 'آية' },
  { id: 'hadith', label: 'حديث' },
  { id: 'wisdom', label: 'حكمة' },
];
const EMPTY = { kind: 'ayah', text: '', translation: '', source: '' };

export default function QuotesManager({ secret, notify, onChange }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    QuotesApi.list()
      .then((res) => setQuotes(res.data))
      .catch((err) => notify(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [notify]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.text.trim() || !form.source.trim()) return notify('النص والمصدر مطلوبان', 'error');
    setSaving(true);
    try {
      const res = await QuotesApi.create(form, secret);
      setQuotes((list) => [...list, res.data]);
      setForm(EMPTY);
      notify('تمت إضافة الرسالة');
      onChange();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (quote) => {
    if (!window.confirm('حذف هذا النص؟')) return;
    try {
      await QuotesApi.remove(quote.id, secret);
      setQuotes((list) => list.filter((q) => q.id !== quote.id));
      notify('تم الحذف');
      onChange();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="card space-y-5 p-6 md:p-8">
        <h2 className="font-amiri text-2xl font-bold text-ink">إضافة آية أو حديث أو حكمة</h2>
        <p className="text-sm text-muted">تتبدّل «رسالة اليوم» تلقائيًا كل يوم بين هذه النصوص. تأكّد من صحة النص وتشكيله ومصدره قبل النشر.</p>
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <label key={k.id} className={`chip cursor-pointer ${form.kind === k.id ? 'border-gold-400 bg-gold-500/15 text-accent' : 'border-line/25 text-muted'}`}>
              <input type="radio" name="kind" value={k.id} checked={form.kind === k.id} onChange={update('kind')} className="sr-only" />
              {k.label}
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="q-text" className="label">النص *</label>
          <textarea id="q-text" rows={3} className="input resize-none font-amiri text-xl leading-9" value={form.text} onChange={update('text')} placeholder="اكتب النص بالتشكيل، بدون أقواس" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="q-source" className="label">المصدر *</label>
            <input id="q-source" className="input" value={form.source} onChange={update('source')} placeholder="سورة الرعد ٢٨ / صحيح مسلم ٢٢٣" />
          </div>
          <div>
            <label htmlFor="q-tr" className="label">الترجمة الإنجليزية</label>
            <input id="q-tr" dir="ltr" className="input text-left" value={form.translation} onChange={update('translation')} placeholder="English translation" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-gold">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          إضافة
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {quotes.map((q) => (
              <motion.li key={q.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card flex items-start gap-3 p-5">
                <div className="flex-1">
                  <span className="rounded-full bg-gold-500/10 px-2 py-0.5 text-xs font-semibold text-accent">{KINDS.find((k) => k.id === q.kind)?.label}</span>
                  <p className="mt-2 font-quran text-lg font-bold text-ink">{q.text}</p>
                  <p className="text-xs text-muted">{q.source}</p>
                </div>
                <IconButton label="حذف" danger onClick={() => remove(q)}>
                  <Trash2 className="h-5 w-5" />
                </IconButton>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
