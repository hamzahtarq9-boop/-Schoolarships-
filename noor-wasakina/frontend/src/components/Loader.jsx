import { motion } from 'framer-motion';
import Logo from './Logo.jsx';

export default function Loader({ full = false, label = 'جارٍ التحميل…' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${full ? 'min-h-screen' : 'py-16'}`} role="status">
      <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }}>
        <Logo size={full ? 96 : 56} glow />
      </motion.div>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
