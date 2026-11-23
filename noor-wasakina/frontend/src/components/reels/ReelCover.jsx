import { BookOpenText, HeartPulse, ScrollText, Sparkles } from 'lucide-react';
import { ArchOutline } from '../Icons.jsx';

export const CATEGORY_THEME = {
  tadabbur: {
    icon: BookOpenText,
    gradient: 'from-[#0E5544] via-[#062C24] to-[#021512]',
    glow: 'rgba(229,193,88,0.55)',
  },
  raqaiq: {
    icon: HeartPulse,
    gradient: 'from-[#122030] via-[#0A1A1F] to-[#03090C]',
    glow: 'rgba(240,215,140,0.45)',
  },
  adhkar: {
    icon: Sparkles,
    gradient: 'from-[#5E4A17] via-[#0A3D32] to-[#041D18]',
    glow: 'rgba(244,224,160,0.6)',
  },
  qisas: {
    icon: ScrollText,
    gradient: 'from-[#7A4A2A] via-[#2A1E14] to-[#0A0E0C]',
    glow: 'rgba(255,200,120,0.5)',
  },
};

/** Generated artwork shown when a reel has no thumbnail image. */
export default function ReelCover({ post, large = false }) {
  const theme = CATEGORY_THEME[post.category] || CATEGORY_THEME.tadabbur;
  const Icon = theme.icon;

  if (post.thumbnail_url) {
    return (
      <img
        src={post.thumbnail_url}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    );
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient}`} aria-hidden="true">
      <div className="bg-pattern !opacity-[0.12]" />
      <div
        className="absolute left-1/2 top-[38%] h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 65%)`, opacity: 0.55 }}
      />
      <ArchOutline className="absolute left-1/2 top-[10%] h-[58%] w-[62%] -translate-x-1/2 text-gold-300/50" />
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-110">
        <Icon
          className={`${large ? 'h-24 w-24' : 'h-14 w-14'} text-gold-200 drop-shadow-[0_0_20px_rgba(229,193,88,0.9)]`}
          strokeWidth={1.2}
        />
      </div>
      <span className="absolute left-1/2 top-[6%] h-[3px] w-10 -translate-x-1/2 rounded-full bg-gold-400/70" />
    </div>
  );
}
