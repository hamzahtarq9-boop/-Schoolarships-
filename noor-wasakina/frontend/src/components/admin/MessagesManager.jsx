import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Mail, MailOpen, Reply, Trash2 } from 'lucide-react';
import { IconButton } from './PostsManager.jsx';
import { MessagesApi } from '../../lib/api.js';
import { formatDate } from '../../lib/format.js';

const TYPE_LABEL = { question: 'سؤال', suggestion: 'اقتراح موضوع', feedback: 'ملاحظة' };

export default function MessagesManager({ secret, notify, onChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    MessagesApi.list(secret)
      .then((res) => setMessages(res.data))
      .catch((err) => notify(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [secret, notify]);

  const shown = useMemo(
    () => (filter === 'unread' ? messages.filter((m) => !m.is_read) : filter === 'all' ? messages : messages.filter((m) => m.type === filter)),
    [messages, filter],
  );

  const toggleRead = async (msg) => {
    try {
      await MessagesApi.markRead(msg.id, !msg.is_read, secret);
      setMessages((list) => list.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m)));
      onChange();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const remove = async (msg) => {
    if (!window.confirm(`حذف رسالة «${msg.name}»؟`)) return;
    try {
      await MessagesApi.remove(msg.id, secret);
      setMessages((list) => list.filter((m) => m.id !== msg.id));
      notify('تم حذف الرسالة');
      onChange();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const filters = [
    { id: 'all', label: 'الكل' },
    { id: 'unread', label: 'غير مقروءة' },
    { id: 'question', label: 'أسئلة' },
    { id: 'suggestion', label: 'اقتراحات' },
    { id: 'feedback', label: 'ملاحظات' },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`chip ${filter === f.id ? 'border-gold-400 bg-gold-500/15 text-accent' : 'border-line/25 text-muted hover:border-gold-400/60'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : shown.length === 0 ? (
        <p className="card p-10 text-center text-muted">لا توجد رسائل هنا بعد.</p>
      ) : (
        <ul className="grid gap-4">
          <AnimatePresence initial={false}>
            {shown.map((msg) => (
              <motion.li
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className={`card relative p-5 md:p-6 ${msg.is_read ? 'opacity-80' : '!border-gold-400/60'}`}
              >
                {!msg.is_read && <span className="absolute right-0 top-6 h-8 w-1 rounded-l-full bg-gold-gradient" />}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-ink">
                      {msg.name}
                      <span className="ms-2 rounded-full bg-gold-500/10 px-2 py-0.5 text-xs font-semibold text-accent">{TYPE_LABEL[msg.type]}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(msg.created_at)}
                      {msg.email && (
                        <>
                          {' · '}
                          <span dir="ltr">{msg.email}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(`رد من نور وسكينة: ${msg.subject || TYPE_LABEL[msg.type]}`)}`}
                        className="grid h-10 w-10 place-items-center rounded-xl text-muted transition hover:bg-gold-500/10 hover:text-accent"
                        title="الرد بالبريد"
                        aria-label="الرد بالبريد"
                      >
                        <Reply className="h-5 w-5" />
                      </a>
                    )}
                    <IconButton label={msg.is_read ? 'تعليم كغير مقروءة' : 'تعليم كمقروءة'} onClick={() => toggleRead(msg)}>
                      {msg.is_read ? <Mail className="h-5 w-5" /> : <MailOpen className="h-5 w-5" />}
                    </IconButton>
                    <IconButton label="حذف" danger onClick={() => remove(msg)}>
                      <Trash2 className="h-5 w-5" />
                    </IconButton>
                  </div>
                </div>
                {msg.subject && <p className="mt-4 font-amiri text-lg font-bold text-accent">{msg.subject}</p>}
                <p className="mt-2 whitespace-pre-wrap leading-8 text-ink/90">{msg.message}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
