import { ArrowUp, Heart } from 'lucide-react';
import Logo from './Logo.jsx';
import { InstagramIcon, StarOrnament } from './Icons.jsx';
import { NAV_LINKS } from '../lib/data.js';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/config.js';

export default function Footer() {
  const year = new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(new Date().getFullYear());
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-line/25 bg-emerald-950 text-cream-100">
      <div className="bg-pattern !opacity-[0.07]" />
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-l from-transparent via-gold-400 to-transparent" />
      <div className="absolute left-1/2 top-0 h-40 w-2/3 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="container relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <Logo size={72} glow />
            <div>
              <p className="font-ruqaa text-3xl text-gold">نور وسكينة</p>
              <p className="font-latin text-xs uppercase tracking-[0.35em] text-cream-200/60">Noor wa Sakina</p>
            </div>
          </div>
          <p className="mt-6 max-w-sm leading-8 text-cream-200/75">
            منصة دعوية تقدّم تذكيرًا هادئًا بالله عبر ريلز وقصص وأذكار، بلغةٍ قريبة من القلب وصورةٍ تليق بالرسالة.
          </p>
          <p className="mt-4 font-quran text-lg text-gold-200">﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾</p>
        </div>

        <nav aria-label="روابط سريعة">
          <h4 className="mb-5 flex items-center gap-2 font-amiri text-xl font-bold text-gold-200">
            <StarOrnament className="h-3.5 w-3.5 text-gold-400" /> روابط سريعة
          </h4>
          <ul className="space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="group inline-flex items-center gap-2 text-cream-200/75 transition hover:text-gold-300">
                  <span className="h-px w-3 bg-gold-500/60 transition-all group-hover:w-6" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h4 className="mb-5 flex items-center gap-2 font-amiri text-xl font-bold text-gold-200">
            <StarOrnament className="h-3.5 w-3.5 text-gold-400" /> تابعنا
          </h4>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-gold-500/25 bg-white/[0.03] p-4 transition hover:border-gold-400 hover:shadow-glow"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <InstagramIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-bold">Instagram</span>
              <span className="block font-latin text-base text-cream-200/70" dir="ltr">@{INSTAGRAM_HANDLE}</span>
            </span>
          </a>
          <p className="mt-5 text-sm leading-7 text-cream-200/60">📌 شارك تُؤجَر · 💾 احفظ المقطع · 🔔 فعّل التنبيهات</p>
        </div>
      </div>

      <div className="container relative flex flex-col items-center justify-between gap-4 border-t border-gold-500/15 py-6 text-sm text-cream-200/60 sm:flex-row">
        <p>
          © {year} نور وسكينة. صُنع بـ <Heart className="inline h-4 w-4 fill-rose-400 text-rose-400" /> لوجه الله.
        </p>
        <a href="#home" className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-4 py-2 transition hover:border-gold-400 hover:text-gold-300">
          <ArrowUp className="h-4 w-4" />
          للأعلى
        </a>
      </div>
    </footer>
  );
}
