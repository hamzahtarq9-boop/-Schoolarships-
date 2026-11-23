import { motion } from 'framer-motion';
import { Eye, Heart, Play } from 'lucide-react';
import ReelCover from './ReelCover.jsx';
import { categoryLabel } from '../../lib/data.js';
import { compactArabic } from '../../lib/format.js';

export default function ReelCard({ post, liked, onOpen, onLike, index = 0 }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.55, delay: Math.min(index, 8) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-[1.75rem] border border-gold-500/25 shadow-soft transition-all duration-500 group-hover:-translate-y-2 group-hover:border-gold-400/80 group-hover:shadow-glow-lg">
        <button
          type="button"
          onClick={() => onOpen(post)}
          className="absolute inset-0 z-10 text-right focus-visible:outline-none"
          aria-label={`مشاهدة: ${post.title}`}
        >
          <ReelCover post={post} />

          {/* top meta */}
          <div className="absolute inset-x-3 top-3 flex items-center justify-between">
            <span className="rounded-full border border-gold-400/40 bg-black/40 px-3 py-1 text-[11px] font-bold text-gold-200 backdrop-blur">
              {categoryLabel(post.category)}
            </span>
            {post.is_featured && (
              <span className="rounded-full bg-gold-gradient px-2.5 py-1 text-[11px] font-extrabold text-emerald-950">مميّز</span>
            )}
          </div>

          {/* play */}
          <span className="absolute left-1/2 top-[38%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full border border-gold-300/70 bg-black/40 text-gold-200 opacity-0 backdrop-blur transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
            <Play className="h-7 w-7 translate-x-[-2px] fill-current" />
          </span>

          {/* title */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 pb-14 pt-16">
            <h3 className="font-amiri text-xl font-bold leading-snug text-cream-50 drop-shadow">{post.title}</h3>
            {post.title_en && (
              <p className="mt-1 font-latin text-sm italic text-cream-200/80" dir="ltr">{post.title_en}</p>
            )}
          </div>
        </button>

        {/* counters (outside the main button so they are separately clickable) */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between text-xs text-cream-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 backdrop-blur" title="المشاهدات">
            <Eye className="h-4 w-4 text-gold-300" />
            {compactArabic(post.views)}
          </span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={() => onLike(post)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur transition ${
              liked ? 'bg-rose-500/25 text-rose-200' : 'bg-black/45 hover:bg-black/60'
            }`}
            aria-pressed={liked}
            aria-label={liked ? 'إلغاء الإعجاب' : 'إعجاب'}
          >
            <motion.span key={liked ? 'on' : 'off'} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
              <Heart className={`h-4 w-4 ${liked ? 'fill-rose-400 text-rose-400' : 'text-gold-300'}`} />
            </motion.span>
            {compactArabic(post.likes)}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
