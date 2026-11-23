import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { DHIKR_LIST } from '../../lib/data.js';
import { useLocalStorage } from '../../lib/useLocalStorage.js';
import { toArabicNumber, todayKey } from '../../lib/format.js';

const INITIAL = { selected: DHIKR_LIST[0].id, counts: {}, rounds: {}, today: 0, day: todayKey(), total: 0, sound: true };

let audioCtx;
function softClick(done) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = done ? 880 : 620;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(done ? 0.12 : 0.05, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (done ? 0.6 : 0.12));
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + (done ? 0.65 : 0.15));
  } catch {
    /* Web Audio not supported */
  }
}

export default function Tasbeeh() {
  const [state, setState] = useLocalStorage('nws:tasbeeh:v1', INITIAL);
  const [burst, setBurst] = useState(0);

  // Reset the "today" counter when the date changes.
  useEffect(() => {
    if (state.day !== todayKey()) setState((s) => ({ ...s, day: todayKey(), today: 0 }));
  }, [state.day, setState]);

  const dhikr = useMemo(() => DHIKR_LIST.find((d) => d.id === state.selected) || DHIKR_LIST[0], [state.selected]);
  const count = state.counts[dhikr.id] || 0;
  const rounds = state.rounds[dhikr.id] || 0;
  const progress = Math.min(count / dhikr.target, 1);

  const R = 118;
  const C = 2 * Math.PI * R;

  const increment = () => {
    const next = count + 1;
    const completed = next >= dhikr.target;
    setState((s) => ({
      ...s,
      day: todayKey(),
      counts: { ...s.counts, [dhikr.id]: completed ? 0 : next },
      rounds: { ...s.rounds, [dhikr.id]: (s.rounds[dhikr.id] || 0) + (completed ? 1 : 0) },
      today: (s.day === todayKey() ? s.today : 0) + 1,
      total: s.total + 1,
    }));
    if (completed) setBurst((b) => b + 1);
    if (navigator.vibrate) navigator.vibrate(completed ? [40, 60, 40] : 12);
    if (state.sound) softClick(completed);
  };

  const resetCurrent = () => {
    if (!count && !rounds) return;
    if (!window.confirm(`تصفير عدّاد «${dhikr.text}»؟`)) return;
    setState((s) => ({ ...s, counts: { ...s.counts, [dhikr.id]: 0 }, rounds: { ...s.rounds, [dhikr.id]: 0 } }));
  };

  return (
    <div className="card relative flex h-full flex-col overflow-hidden p-6 md:p-8">
      <div className="bg-pattern" />
      <div className="relative mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-amiri text-2xl font-bold text-ink">المسبحة الإلكترونية</h3>
          <p className="font-latin text-sm italic text-muted">Digital tasbeeh, saved on your device</p>
        </div>
        <button
          type="button"
          onClick={() => setState((s) => ({ ...s, sound: !s.sound }))}
          className="grid h-10 w-10 place-items-center rounded-full border border-line/30 text-accent transition hover:border-gold-400"
          aria-label={state.sound ? 'كتم الصوت' : 'تشغيل الصوت'}
          aria-pressed={state.sound}
        >
          {state.sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>

      {/* dhikr selector */}
      <div className="scrollbar-none relative -mx-6 mb-6 flex gap-2 overflow-x-auto px-6 md:-mx-8 md:px-8" role="radiogroup" aria-label="اختر الذكر">
        {DHIKR_LIST.map((d) => {
          const selected = d.id === dhikr.id;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setState((s) => ({ ...s, selected: d.id }))}
              className={`chip shrink-0 font-amiri text-base ${
                selected ? 'border-gold-400 bg-gold-500/15 text-accent shadow-glow' : 'border-line/25 text-ink/75 hover:border-gold-400/70'
              }`}
            >
              {d.text}
            </button>
          );
        })}
      </div>

      {/* counter */}
      <div className="relative mx-auto my-2 grid place-items-center">
        <svg viewBox="0 0 260 260" className="h-64 w-64 -rotate-90 md:h-72 md:w-72" aria-hidden="true">
          <defs>
            <linearGradient id="tasbeehGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F4E0A0" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8922A" />
            </linearGradient>
          </defs>
          <circle cx="130" cy="130" r={R} fill="none" stroke="rgb(var(--c-line) / 0.18)" strokeWidth="10" />
          <motion.circle
            cx="130"
            cy="130"
            r={R}
            fill="none"
            stroke="url(#tasbeehGold)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            animate={{ strokeDashoffset: C * (1 - progress) }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(229,193,88,0.6))' }}
          />
        </svg>

        <motion.button
          type="button"
          onClick={increment}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.02 }}
          className="absolute grid h-48 w-48 place-items-center rounded-full border border-gold-400/50 bg-gradient-to-b from-emerald-700 to-emerald-950 text-cream-50 shadow-[inset_0_2px_20px_rgba(229,193,88,0.25),0_20px_50px_-20px_rgba(0,0,0,0.7)] md:h-56 md:w-56"
          aria-label={`سبّح: ${dhikr.text}، العدد ${count} من ${dhikr.target}`}
        >
          <span className="flex flex-col items-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="font-amiri text-6xl font-bold text-gold-200 md:text-7xl"
              >
                {toArabicNumber(count)}
              </motion.span>
            </AnimatePresence>
            <span className="mt-1 text-xs text-cream-200/70">من {toArabicNumber(dhikr.target)} · اضغط للتسبيح</span>
          </span>
        </motion.button>

        {/* completion burst */}
        <AnimatePresence>
          {burst > 0 && (
            <motion.span
              key={burst}
              className="pointer-events-none absolute h-56 w-56 rounded-full border-2 border-gold-300"
              initial={{ scale: 0.9, opacity: 0.9 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      <p className="relative mt-4 text-center font-quran text-2xl font-bold text-accent">{dhikr.text}</p>

      <div className="relative mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'الدورات', value: rounds },
          { label: 'اليوم', value: state.day === todayKey() ? state.today : 0 },
          { label: 'الإجمالي', value: state.total },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line/20 bg-page/40 px-2 py-3">
            <div className="font-amiri text-2xl font-bold text-ink">{toArabicNumber(s.value)}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <button type="button" onClick={resetCurrent} className="relative mx-auto mt-5 inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent">
        <RotateCcw className="h-4 w-4" />
        تصفير هذا الذكر
      </button>
    </div>
  );
}
