import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { InstagramIcon } from './Icons.jsx';
import { NAV_LINKS } from '../lib/data.js';
import { INSTAGRAM_URL } from '../lib/config.js';

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border px-3 py-2 transition-all duration-500 md:px-5 ${
          scrolled
            ? 'border-line/30 bg-page/70 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-page/20 backdrop-blur-md'
        }`}
        aria-label="التنقل الرئيسي"
      >
        <a href="#home" className="group flex items-center gap-3" aria-label="نور وسكينة، الصفحة الرئيسية">
          <Logo size={44} className="transition duration-500 group-hover:rotate-[8deg] group-hover:scale-105" />
          <span className="leading-tight">
            <span className="block font-ruqaa text-2xl text-gold">نور وسكينة</span>
            <span className="block font-latin text-[11px] uppercase tracking-[0.3em] text-muted">Noor wa Sakina</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active === link.id ? 'text-accent' : 'text-ink/80 hover:text-accent'
                }`}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-line/40 bg-gold-500/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-gold hidden !px-5 !py-2.5 sm:inline-flex">
            <InstagramIcon className="h-5 w-5" />
            تابعنا
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line/40 text-accent lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass mx-auto mt-3 max-w-6xl rounded-3xl p-4 shadow-soft lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.li key={link.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl px-4 py-3 font-semibold transition ${
                      active === link.id ? 'bg-gold-500/15 text-accent' : 'hover:bg-gold-500/10'
                    }`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-gold mt-3 w-full">
              <InstagramIcon className="h-5 w-5" />
              تابعنا على إنستغرام @noor.wasakina
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
