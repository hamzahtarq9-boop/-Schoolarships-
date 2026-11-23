import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, KeyRound, Loader2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo.jsx';
import { AdminApi, hasApi } from '../../lib/api.js';

export default function AdminLogin({ onLogin }) {
  const [secret, setSecret] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!secret.trim()) return setError('أدخل مفتاح الإدارة');
    setLoading(true);
    setError('');
    try {
      await AdminApi.verify(secret.trim());
      onLogin(secret.trim());
    } catch (err) {
      setError(err.status === 401 ? 'مفتاح الإدارة غير صحيح' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="card relative w-full max-w-md overflow-hidden p-8 text-center md:p-10"
      >
        <div className="bg-pattern" />
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity }} className="relative">
          <Logo size={110} glow className="mx-auto" />
        </motion.div>
        <h1 className="relative mt-6 font-ruqaa text-4xl text-gold">لوحة الإدارة</h1>
        <p className="relative mt-2 text-sm text-muted">أدخل مفتاح الإدارة (ADMIN_SECRET) للمتابعة</p>

        {!hasApi && (
          <p className="relative mt-6 rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-500 dark:text-rose-300">
            لم يُضبط متغير <code dir="ltr">VITE_API_URL</code> بعد، لذلك لا يمكن الاتصال بالخادم.
          </p>
        )}

        <form onSubmit={submit} className="relative mt-8 space-y-4 text-right">
          <label htmlFor="admin-secret" className="label">مفتاح الإدارة</label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
            <input
              id="admin-secret"
              type={show ? 'text' : 'password'}
              dir="ltr"
              autoComplete="current-password"
              className="input !px-12 text-left"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-accent"
              aria-label={show ? 'إخفاء' : 'إظهار'}
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error && <p className="text-sm text-rose-500 dark:text-rose-300" role="alert">{error}</p>}
          <button type="submit" disabled={loading || !hasApi} className="btn-gold w-full !py-3.5">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5 -scale-x-100" />}
            دخول
          </button>
        </form>
        <Link to="/" className="relative mt-6 inline-block text-sm text-muted hover:text-accent">← العودة إلى الموقع</Link>
      </motion.div>
    </main>
  );
}
