import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import ReelCard from './ReelCard.jsx';
import ReelModal from './ReelModal.jsx';
import Reveal from '../Reveal.jsx';
import { InstagramIcon } from '../Icons.jsx';
import { CATEGORIES, FALLBACK_POSTS } from '../../lib/data.js';
import { PostsApi, hasApi } from '../../lib/api.js';
import { INSTAGRAM_URL } from '../../lib/config.js';
import { useLocalStorage } from '../../lib/useLocalStorage.js';
import { toArabicNumber } from '../../lib/format.js';

const PAGE = 8;

function SkeletonCard() {
  return <div className="aspect-[9/16] animate-pulse rounded-[1.75rem] border border-line/20 bg-surface/40" />;
}

export default function ReelsSection() {
  const [category, setCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | offline
  const [visible, setVisible] = useState(PAGE);
  const [active, setActive] = useState(null);
  const [liked, setLiked] = useLocalStorage('nws:liked', []);

  const load = useCallback(
    async (signal) => {
      setStatus('loading');
      if (!hasApi) {
        setPosts(FALLBACK_POSTS);
        setStatus('offline');
        return;
      }
      try {
        const res = await PostsApi.list('all', signal);
        setPosts(res.data);
        setStatus('ready');
      } catch (err) {
        if (signal?.aborted) return;
        setPosts(FALLBACK_POSTS);
        setStatus('offline');
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => setVisible(PAGE), [category]);

  const filtered = useMemo(
    () => (category === 'all' ? posts : posts.filter((p) => p.category === category)),
    [posts, category],
  );

  const counts = useMemo(() => {
    const c = { all: posts.length };
    posts.forEach((p) => {
      c[p.category] = (c[p.category] || 0) + 1;
    });
    return c;
  }, [posts]);

  const patchPost = (id, patch) => {
    setPosts((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setActive((current) => (current && current.id === id ? { ...current, ...patch } : current));
  };

  const openPost = (post) => {
    setActive(post);
    const seenKey = `nws:viewed:${post.id}`;
    if (sessionStorage.getItem(seenKey)) return;
    sessionStorage.setItem(seenKey, '1');
    patchPost(post.id, { views: post.views + 1 });
    if (status === 'ready') {
      PostsApi.view(post.id)
        .then((res) => patchPost(post.id, { views: res.data.views }))
        .catch(() => {});
    }
  };

  const closeModal = useCallback(() => setActive(null), []);

  const toggleLike = (post) => {
    const isLiked = liked.includes(post.id);
    const action = isLiked ? 'unlike' : 'like';
    setLiked((ids) => (isLiked ? ids.filter((x) => x !== post.id) : [...ids, post.id]));
    patchPost(post.id, { likes: Math.max(0, post.likes + (isLiked ? -1 : 1)) });
    if (status === 'ready') {
      PostsApi.like(post.id, action)
        .then((res) => patchPost(post.id, { likes: res.data.likes }))
        .catch(() => {});
    }
  };

  return (
    <section id="reels" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="أحدث الريلز"
          title="مقاطع تلامس القلب"
          en="Reels that touch the heart"
          subtitle="اختر ما يناسب قلبك اليوم: تدبّر آية، أو موعظة تُرقّق القلب، أو ذكرًا يملأ الميزان، أو قصة فيها عبرة."
        />

        <Reveal className="mb-10">
          <LayoutGroup id="reel-filters">
            <div className="scrollbar-none -mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:px-0" role="tablist" aria-label="تصنيفات المقاطع">
              {CATEGORIES.map((c) => {
                const selected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setCategory(c.id)}
                    className={`chip relative shrink-0 snap-start ${
                      selected ? 'border-transparent text-emerald-950' : 'border-line/30 bg-surface/30 text-ink/80 hover:border-gold-400 hover:text-accent'
                    }`}
                  >
                    {selected && (
                      <motion.span layoutId="chip-bg" className="absolute inset-0 -z-10 rounded-full bg-gold-gradient shadow-glow" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                    )}
                    {c.label}
                    <span className={`rounded-full px-2 text-xs ${selected ? 'bg-emerald-950/15' : 'bg-gold-500/10 text-accent'}`}>
                      {toArabicNumber(counts[c.id] || 0)}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </Reveal>

        {status === 'offline' && hasApi && (
          <div className="mx-auto mb-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-line/30 bg-gold-500/10 px-4 py-3 text-sm text-muted">
            تعذّر تحميل أحدث المقاطع، نعرض لك مختارات مؤقتًا.
            <button type="button" onClick={() => load()} className="inline-flex items-center gap-1 font-bold text-accent hover:underline">
              <RefreshCw className="h-4 w-4" /> إعادة المحاولة
            </button>
          </div>
        )}

        {status === 'loading' ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted">لا توجد مقاطع في هذا التصنيف بعد، تابعنا ليصلك الجديد ✨</p>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.slice(0, visible).map((post, i) => (
                <ReelCard key={post.id} post={post} index={i} liked={liked.includes(post.id)} onOpen={openPost} onLike={toggleLike} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {filtered.length > visible && (
            <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="btn-ghost">
              عرض المزيد
            </button>
          )}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-gold">
            <InstagramIcon className="h-5 w-5" />
            شاهد كل المقاطع على إنستغرام
          </a>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <ReelModal post={active} liked={liked.includes(active.id)} onLike={toggleLike} onClose={closeModal} />
        )}
      </AnimatePresence>
    </section>
  );
}
