import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Eye, Heart, Share2, X } from 'lucide-react';
import ReelCover from './ReelCover.jsx';
import { InstagramIcon } from '../Icons.jsx';
import { categoryLabel } from '../../lib/data.js';
import { compactArabic, instagramShortcode } from '../../lib/format.js';

export default function ReelModal({ post, liked, onLike, onClose }) {
  const closeRef = useRef(null);
  const shortcode = instagramShortcode(post.instagram_url);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const share = async () => {
    const data = { title: post.title, text: `${post.title} — نور وسكينة`, url: post.instagram_url };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(post.instagram_url);
        alert('تم نسخ الرابط');
      }
    } catch {
      /* user cancelled */
    }
  };

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid max-h-[94vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-gold-500/40 bg-emerald-950 text-cream-100 shadow-glow-lg md:grid-cols-[minmax(0,380px)_1fr]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-gold-400/40 bg-black/50 text-gold-200 transition hover:rotate-90 hover:bg-black/70"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>

        {/* player / preview */}
        <div className="relative mx-auto aspect-[9/16] max-h-[60vh] w-full overflow-hidden bg-black md:max-h-[94vh]">
          {shortcode ? (
            <iframe
              title={post.title}
              src={`https://www.instagram.com/${shortcode.type}/${shortcode.code}/embed/`}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="group relative h-full w-full">
              <ReelCover post={post} large />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-20 text-center">
                <p className="font-amiri text-2xl font-bold">{post.title}</p>
                <a href={post.instagram_url} target="_blank" rel="noopener noreferrer" className="btn-gold mt-4">
                  <InstagramIcon className="h-5 w-5" />
                  شاهد على إنستغرام
                </a>
              </div>
            </div>
          )}
        </div>

        {/* details */}
        <div className="relative flex flex-col gap-5 overflow-y-auto p-6 md:p-8">
          <div className="bg-pattern" />
          <span className="relative w-fit rounded-full border border-gold-400/40 bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-300">
            {categoryLabel(post.category)}
          </span>
          <div className="relative">
            <h3 className="font-amiri text-3xl font-bold leading-snug text-gold-200">{post.title}</h3>
            {post.title_en && <p className="mt-1 font-latin text-lg italic text-cream-200/70" dir="ltr">{post.title_en}</p>}
          </div>
          {post.description && <p className="relative leading-8 text-cream-100/85">{post.description}</p>}

          <div className="relative flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 px-4 py-2">
              <Eye className="h-4 w-4 text-gold-300" /> {compactArabic(post.views)} مشاهدة
            </span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(post)}
              aria-pressed={liked}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition ${
                liked ? 'border-rose-400/60 bg-rose-500/15 text-rose-200' : 'border-gold-500/25 hover:border-gold-400'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-rose-400 text-rose-400' : 'text-gold-300'}`} />
              {compactArabic(post.likes)} إعجاب
            </motion.button>
            <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 px-4 py-2 transition hover:border-gold-400">
              <Share2 className="h-4 w-4 text-gold-300" /> شارك تُؤجَر
            </button>
          </div>

          <div className="relative mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
            <a href={post.instagram_url} target="_blank" rel="noopener noreferrer" className="btn-gold flex-1">
              <ExternalLink className="h-5 w-5" />
              افتح على إنستغرام
            </a>
          </div>
          <p className="relative text-center font-amiri text-sm text-cream-200/60">
            «مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ» · صحيح مسلم
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
