import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, PlayCircle, Quote } from 'lucide-react';
import Logo from './Logo.jsx';
import { ArchOutline, InstagramIcon, StarOrnament } from './Icons.jsx';
import { HERO_AYAT } from '../lib/data.js';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/config.js';

const ease = [0.22, 1, 0.36, 1];
const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
});

function RotatingAyah() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % HERO_AYAT.length), 7000);
    return () => clearInterval(timer);
  }, []);
  const ayah = HERO_AYAT[index];

  return (
    <div className="card relative overflow-hidden p-6 md:p-7">
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
      <div className="mb-3 flex items-center justify-between text-xs font-bold text-accent">
        <span className="inline-flex items-center gap-2">
          <Quote className="h-4 w-4" />
          آيةٌ تُسكِن القلب
        </span>
        <span className="flex gap-1.5" aria-hidden="true">
          {HERO_AYAT.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-5 bg-gold-400' : 'w-1.5 bg-gold-400/30'}`} />
          ))}
        </span>
      </div>
      <div className="min-h-[7.5rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
            transition={{ duration: 0.7, ease }}
          >
            <blockquote className="font-quran text-2xl font-bold text-ink md:text-[1.7rem]">
              ﴿ {ayah.text} ﴾
            </blockquote>
            <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-accent">{ayah.source}</span>
              <span className="font-latin text-sm italic text-muted" dir="ltr">{ayah.en}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LanternVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      {/* rotating light rays */}
      <div
        className="absolute inset-[-12%] animate-spin-slow rounded-full opacity-60 dark:opacity-70"
        style={{
          background:
            'repeating-conic-gradient(from 0deg, rgba(229,193,88,0.16) 0deg 4deg, transparent 4deg 18deg)',
          maskImage: 'radial-gradient(circle, black 15%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(circle, black 15%, transparent 68%)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-[12%] rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
      <ArchOutline className="absolute inset-x-[14%] -top-[8%] h-[116%] w-[72%] text-gold-500/40" />
      {/* orbit ring */}
      <motion.div
        className="absolute inset-[2%] rounded-full border border-dashed border-gold-500/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        {['left-1/2 top-0', 'left-1/2 top-full', 'left-0 top-1/2', 'left-full top-1/2'].map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400 shadow-[0_0_12px_rgba(229,193,88,0.9)]`}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-[13%]"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
        transition={{ opacity: { duration: 1.2 }, scale: { duration: 1.2, ease }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <Logo size={480} glow className="h-full w-full shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-gold-500/40" />
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-32 md:pt-36">
      <div className="container grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="relative z-10 text-center lg:text-right">
          <motion.span
            {...fadeUp(0.1)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line/30 bg-gold-500/10 px-4 py-2 text-xs font-bold text-accent md:text-sm"
          >
            <StarOrnament className="h-3.5 w-3.5" />
            منصة دعوية · <span dir="ltr" className="font-latin text-base">@{INSTAGRAM_HANDLE}</span>
          </motion.span>

          <motion.h1 {...fadeUp(0.2)} className="font-ruqaa text-6xl leading-[1.35] md:text-7xl xl:text-8xl">
            <span className="text-gold-shimmer drop-shadow-[0_4px_30px_rgba(212,175,55,0.25)]">نور وسكينة</span>
          </motion.h1>

          <motion.p {...fadeUp(0.35)} className="mt-4 font-amiri text-2xl font-bold leading-relaxed text-ink md:text-3xl">
            مساحة للطمأنينة، وتدبّر الآيات، وتزكية النفس
          </motion.p>

          <motion.p {...fadeUp(0.45)} className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted md:text-lg lg:mx-0">
            ريلز دعوية تلامس القلب، وأذكار ترافق يومك، وكلمة طيبة تعيدك إلى الله بهدوء.
            <span className="mt-1 block font-latin text-lg italic" dir="ltr">
              Light for the heart, tranquillity for the soul.
            </span>
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a href="#reels" className="btn-gold w-full sm:w-auto">
              <PlayCircle className="h-5 w-5" />
              تصفّح المقاطع الدعوية
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost group w-full sm:w-auto"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white transition-transform duration-500 group-hover:rotate-[360deg]">
                <InstagramIcon className="h-4 w-4" />
              </span>
              تابعنا على إنستغرام
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.75)} className="mt-10 lg:max-w-xl">
            <RotatingAyah />
          </motion.div>
        </div>

        <div className="relative order-first lg:order-none">
          <div className="mx-auto w-64 sm:w-80 lg:w-full">
            <LanternVisual />
          </div>
        </div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-muted md:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        aria-label="انتقل إلى الأسفل"
      >
        مرّر للأسفل
        <ChevronDown className="h-5 w-5 text-accent" />
      </motion.a>
    </section>
  );
}
