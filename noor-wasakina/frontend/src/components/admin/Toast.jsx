import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Toast({ toast }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className={`flex items-center gap-3 rounded-2xl border px-5 py-3 font-semibold shadow-soft backdrop-blur-xl ${
              toast.type === 'error'
                ? 'border-rose-400/50 bg-rose-950/85 text-rose-100'
                : 'border-gold-400/50 bg-emerald-950/90 text-cream-100'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="h-5 w-5 text-rose-300" /> : <CheckCircle2 className="h-5 w-5 text-gold-300" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
