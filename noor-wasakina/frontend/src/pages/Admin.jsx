import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clapperboard, ExternalLink, Inbox, LogOut, Quote } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import AmbientBackground from '../components/AmbientBackground.jsx';
import AdminLogin from '../components/admin/AdminLogin.jsx';
import PostsManager from '../components/admin/PostsManager.jsx';
import MessagesManager from '../components/admin/MessagesManager.jsx';
import QuotesManager from '../components/admin/QuotesManager.jsx';
import Toast from '../components/admin/Toast.jsx';
import { AdminApi } from '../lib/api.js';
import { compactArabic, toArabicNumber } from '../lib/format.js';

const SESSION_KEY = 'nws:admin-secret';

const TABS = [
  { id: 'posts', label: 'الريلز', icon: Clapperboard },
  { id: 'messages', label: 'الرسائل', icon: Inbox },
  { id: 'quotes', label: 'رسائل اليوم', icon: Quote },
];

export default function Admin() {
  const [secret, setSecret] = useState(() => sessionStorage.getItem(SESSION_KEY) || '');
  const [tab, setTab] = useState('posts');
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  useEffect(() => {
    document.title = 'لوحة الإدارة | نور وسكينة';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => {
      document.title = 'نور وسكينة | Noor wa Sakina';
      robots.remove();
    };
  }, []);

  const notify = useCallback((message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSecret('');
    setStats(null);
  }, []);

  const loadStats = useCallback(() => {
    if (!secret) return;
    AdminApi.stats(secret)
      .then((res) => setStats(res.data))
      .catch((err) => {
        if (err.status === 401) logout();
      });
  }, [secret, logout]);

  useEffect(loadStats, [loadStats]);

  const login = (value) => {
    sessionStorage.setItem(SESSION_KEY, value);
    setSecret(value);
  };

  if (!secret) {
    return (
      <>
        <AmbientBackground />
        <div className="fixed left-4 top-4 z-10"><ThemeToggle /></div>
        <AdminLogin onLogin={login} />
      </>
    );
  }

  const statCards = stats
    ? [
        { label: 'الريلز', value: toArabicNumber(stats.posts) },
        { label: 'المشاهدات', value: compactArabic(stats.views) },
        { label: 'الإعجابات', value: compactArabic(stats.likes) },
        { label: 'رسائل جديدة', value: toArabicNumber(stats.unread) },
      ]
    : [];

  return (
    <>
      <AmbientBackground />
      <header className="sticky top-0 z-40 border-b border-line/20 bg-page/75 backdrop-blur-xl">
        <div className="container flex items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <Logo size={44} />
            <span>
              <span className="block font-ruqaa text-xl text-gold">نور وسكينة</span>
              <span className="block text-xs text-muted">لوحة الإدارة</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost hidden !px-4 !py-2 !text-sm sm:inline-flex">
              <ExternalLink className="h-4 w-4" /> عرض الموقع
            </Link>
            <ThemeToggle />
            <button type="button" onClick={logout} className="btn-ghost !px-4 !py-2 !text-sm">
              <LogOut className="h-4 w-4 -scale-x-100" /> خروج
            </button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card p-5 text-center">
              <div className="font-amiri text-3xl font-bold text-gold">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <nav className="mb-8 flex gap-2 overflow-x-auto" role="tablist" aria-label="أقسام الإدارة">
          {TABS.map((t) => {
            const selected = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(t.id)}
                className={`chip relative shrink-0 !px-5 !py-2.5 ${selected ? 'border-transparent text-emerald-950' : 'border-line/30 text-ink/80 hover:border-gold-400'}`}
              >
                {selected && <motion.span layoutId="admin-tab" className="absolute inset-0 -z-10 rounded-full bg-gold-gradient shadow-glow" />}
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.id === 'messages' && stats?.unread > 0 && (
                  <span className="rounded-full bg-rose-500 px-2 text-xs text-white">{toArabicNumber(stats.unread)}</span>
                )}
              </button>
            );
          })}
        </nav>

        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {tab === 'posts' && <PostsManager secret={secret} notify={notify} onChange={loadStats} />}
          {tab === 'messages' && <MessagesManager secret={secret} notify={notify} onChange={loadStats} />}
          {tab === 'quotes' && <QuotesManager secret={secret} notify={notify} onChange={loadStats} />}
        </motion.div>
      </main>
      <Toast toast={toast} />
    </>
  );
}
