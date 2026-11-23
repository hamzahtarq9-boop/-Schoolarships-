import { motion } from 'framer-motion';
import { useMemo } from 'react';

/** Page-wide backdrop: geometric pattern, soft light pools and drifting gold dust. */
export default function AmbientBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 2 + ((i * 7) % 4),
        duration: 9 + ((i * 3) % 8),
        delay: (i % 7) * 0.9,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="bg-pattern" />
      <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px] dark:bg-gold-500/[0.07]" />
      <div className="absolute -bottom-40 -right-40 h-[34rem] w-[34rem] rounded-full bg-emerald-400/10 blur-[120px] dark:bg-emerald-500/20" />
      <div className="absolute top-1/2 -left-40 h-[28rem] w-[28rem] rounded-full bg-emerald-300/10 blur-[120px] dark:bg-emerald-700/20" />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-gold-400/60 dark:bg-gold-300/50"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, boxShadow: '0 0 8px rgba(229,193,88,0.8)' }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.35)_100%)] opacity-0 dark:opacity-100" />
    </div>
  );
}
