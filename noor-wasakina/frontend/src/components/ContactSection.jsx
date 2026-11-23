import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, HelpCircle, Lightbulb, Loader2, MessageSquareHeart, Send } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import Reveal from './Reveal.jsx';
import { InstagramIcon } from './Icons.jsx';
import { MessagesApi } from '../lib/api.js';
import { toArabicNumber } from '../lib/format.js';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/config.js';

const TYPES = [
  { id: 'question', label: 'سؤال', icon: HelpCircle },
  { id: 'suggestion', label: 'اقتراح موضوع', icon: Lightbulb },
  { id: 'feedback', label: 'ملاحظة', icon: MessageSquareHeart },
];

const EMPTY = { name: '', email: '', type: 'suggestion', subject: '', message: '', website: '' };

export default function ContactSection() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return fail('اكتب اسمك من فضلك');
    if (form.message.trim().length < 5) return fail('اكتب رسالتك (٥ أحرف على الأقل)');
    setStatus('sending');
    setError('');
    try {
      await MessagesApi.send(form);
      setStatus('sent');
      setForm(EMPTY);
    } catch (err) {
      fail(err.message);
    }
  };

  function fail(message) {
    setError(message);
    setStatus('error');
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="تواصل معنا"
          title="أرسل سؤالك أو اقتراحك"
          en="Ask a question or suggest a topic"
          subtitle="عندك موضوع تحب نتكلم عنه؟ أو سؤال يشغل بالك؟ اكتب لنا، فكل رسالة تُقرأ باهتمام."
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr]">
          <Reveal className="h-full min-w-0">
            <aside className="card relative flex h-full flex-col justify-between overflow-hidden p-7 md:p-8">
              <div className="bg-pattern" />
              <div className="relative">
                <h3 className="font-amiri text-2xl font-bold text-ink">لماذا نسمع منك؟</h3>
                <ul className="mt-5 space-y-4 leading-7 text-muted">
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-gold-400" />اقتراحاتكم تتحوّل إلى ريلز جديدة بإذن الله.</li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-gold-400" />الأسئلة الشرعية نحيلها إلى مصادر موثوقة وأهل العلم.</li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-gold-400" />بياناتك تبقى خاصة ولا تُشارَك مع أحد.</li>
                </ul>
              </div>
              <div className="relative mt-8 rounded-2xl border border-line/25 bg-gold-500/10 p-5">
                <p className="font-quran text-lg font-bold text-ink">«الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ»</p>
                <p className="mt-1 text-xs text-muted">متفق عليه</p>
              </div>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost relative mt-6">
                <InstagramIcon className="h-5 w-5" />
                أو راسلنا على <span dir="ltr" className="font-latin text-base">@{INSTAGRAM_HANDLE}</span>
              </a>
            </aside>
          </Reveal>

          <Reveal className="min-w-0" delay={0.12}>
            <div className="card relative overflow-hidden p-7 md:p-9">
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[28rem] flex-col items-center justify-center text-center"
                  >
                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
                      <CheckCircle2 className="h-20 w-20 text-gold-400 drop-shadow-[0_0_20px_rgba(229,193,88,0.6)]" strokeWidth={1.4} />
                    </motion.div>
                    <h3 className="mt-6 font-amiri text-3xl font-bold text-gold">جزاك الله خيرًا</h3>
                    <p className="mt-3 max-w-sm leading-8 text-muted">وصلتنا رسالتك بحمد الله، وسنقرؤها باهتمام. لا تنسَنا من صالح دعائك 🤍</p>
                    <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-8">
                      إرسال رسالة أخرى
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                    <fieldset>
                      <legend className="label">نوع الرسالة</legend>
                      <div className="grid grid-cols-3 gap-2">
                        {TYPES.map((t) => {
                          const selected = form.type === t.id;
                          return (
                            <label
                              key={t.id}
                              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center text-sm font-semibold transition ${
                                selected ? 'border-gold-400 bg-gold-500/15 text-accent shadow-glow' : 'border-line/25 text-muted hover:border-gold-400/60'
                              }`}
                            >
                              <input type="radio" name="type" value={t.id} checked={selected} onChange={update('type')} className="sr-only" />
                              <t.icon className="h-5 w-5" />
                              {t.label}
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="c-name" className="label">الاسم *</label>
                        <input id="c-name" className="input" value={form.name} onChange={update('name')} maxLength={120} autoComplete="name" placeholder="اسمك الكريم" required />
                      </div>
                      <div>
                        <label htmlFor="c-email" className="label">البريد الإلكتروني <span className="font-normal text-muted">(اختياري)</span></label>
                        <input id="c-email" type="email" dir="ltr" className="input text-right" value={form.email} onChange={update('email')} maxLength={200} autoComplete="email" placeholder="name@example.com" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="c-subject" className="label">الموضوع</label>
                      <input id="c-subject" className="input" value={form.subject} onChange={update('subject')} maxLength={200} placeholder="مثال: فيديو عن الصبر عند البلاء" />
                    </div>

                    <div>
                      <label htmlFor="c-message" className="label">رسالتك *</label>
                      <textarea id="c-message" rows={5} className="input resize-none leading-8" value={form.message} onChange={update('message')} maxLength={5000} placeholder="اكتب سؤالك أو اقتراحك هنا…" required />
                      <div className="mt-1 text-left text-xs text-muted">{toArabicNumber(form.message.length)} / {toArabicNumber(5000)}</div>
                    </div>

                    {/* honeypot (hidden from humans) */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="c-website">Website</label>
                      <input id="c-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                    </div>

                    <AnimatePresence>
                      {status === 'error' && (
                        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 dark:text-rose-300" role="alert">
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={status === 'sending'} className="btn-gold w-full !py-4">
                      {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 -scale-x-100" />}
                      {status === 'sending' ? 'جارٍ الإرسال…' : 'إرسال الرسالة'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
