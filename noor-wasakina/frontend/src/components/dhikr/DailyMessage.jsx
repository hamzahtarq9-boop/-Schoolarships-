import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, RefreshCw, Share2 } from 'lucide-react';
import { FALLBACK_QUOTES } from '../../lib/data.js';
import { QuotesApi, hasApi } from '../../lib/api.js';
import { INSTAGRAM_HANDLE } from '../../lib/config.js';

const KIND_LABEL = { ayah: 'آية اليوم', hadith: 'حديث اليوم', wisdom: 'حكمة اليوم' };

function localDaily(list) {
  const day = Math.floor(Date.now() / 86_400_000);
  return list[day % list.length];
}

export default function DailyMessage() {
  const [quotes, setQuotes] = useState(FALLBACK_QUOTES);
  const [current, setCurrent] = useState(() => localDaily(FALLBACK_QUOTES));
  const [isDaily, setIsDaily] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hasApi) return;
    let cancelled = false;
    Promise.allSettled([QuotesApi.daily(), QuotesApi.list()]).then(([daily, list]) => {
      if (cancelled) return;
      if (list.status === 'fulfilled' && list.value.data.length) setQuotes(list.value.data);
      if (daily.status === 'fulfilled') setCurrent(daily.value.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const shareText = useMemo(() => {
    const body = current.kind === 'ayah' ? `﴿${current.text}﴾` : current.kind === 'hadith' ? `«${current.text}»` : current.text;
    return `${body}\n— ${current.source}\n\nنور وسكينة 🤍 @${INSTAGRAM_HANDLE}`;
  }, [current]);

  const next = useCallback(() => {
    if (quotes.length < 2) return;
    let candidate = current;
    while (candidate.id === current.id) candidate = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrent(candidate);
    setIsDaily(false);
  }, [quotes, current]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('انسخ النص:', shareText);
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'رسالة اليوم من نور وسكينة', text: shareText, url: window.location.origin });
      } catch {
        /* cancelled */
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${window.location.origin}`)}`, '_blank', 'noopener');
    }
  };

  return (
    <div className="card relative flex h-full flex-col overflow-hidden p-6 md:p-8">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" aria-hidden="true" />

      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-amiri text-2xl font-bold text-ink">رسالة اليوم</h3>
          <p className="font-latin text-sm italic text-muted">Today&apos;s reminder</p>
        </div>
        <span className="rounded-full border border-line/30 bg-gold-500/10 px-3 py-1 text-xs font-bold text-accent">
          {isDaily ? KIND_LABEL[current.kind] : 'تذكرة'}
        </span>
      </div>

      <div className="relative flex flex-1 items-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.figure
            key={current.id}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full text-center"
          >
            <span className="mx-auto mb-4 block h-px w-24 bg-gradient-to-l from-transparent via-gold-500 to-transparent" />
            <blockquote className="font-quran text-2xl font-bold text-ink md:text-3xl">
              {current.kind === 'ayah' ? `﴿ ${current.text} ﴾` : current.kind === 'hadith' ? `« ${current.text} »` : current.text}
            </blockquote>
            <figcaption className="mt-4 text-sm font-bold text-accent">{current.source}</figcaption>
            {current.translation && (
              <p className="mx-auto mt-4 max-w-md font-latin text-lg italic leading-relaxed text-muted" dir="ltr">
                {current.translation}
              </p>
            )}
            <span className="mx-auto mt-5 block h-px w-24 bg-gradient-to-l from-transparent via-gold-500 to-transparent" />
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="relative mt-8 grid grid-cols-3 gap-2">
        <button type="button" onClick={copy} className="btn-ghost !px-3 !text-sm">
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          {copied ? 'تم النسخ' : 'نسخ'}
        </button>
        <button type="button" onClick={share} className="btn-ghost !px-3 !text-sm">
          <Share2 className="h-4 w-4" />
          مشاركة
        </button>
        <button type="button" onClick={next} className="btn-gold !px-3 !text-sm">
          <RefreshCw className="h-4 w-4" />
          رسالة أخرى
        </button>
      </div>
    </div>
  );
}
