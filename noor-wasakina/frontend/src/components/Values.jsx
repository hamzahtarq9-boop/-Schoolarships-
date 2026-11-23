import { motion } from 'framer-motion';
import { BookOpenText, HeartHandshake, MoonStar } from 'lucide-react';
import Reveal from './Reveal.jsx';

const VALUES = [
  {
    icon: BookOpenText,
    title: 'تدبّر',
    en: 'Reflect',
    text: 'نقف عند الآية ونقرّب معناها للقلب بصورة ومشهد، لا بكلام طويل.',
  },
  {
    icon: MoonStar,
    title: 'سكينة',
    en: 'Tranquillity',
    text: 'محتوى هادئ يعيد ترتيب يومك حول ذكر الله، بعيدًا عن الضجيج.',
  },
  {
    icon: HeartHandshake,
    title: 'أثر',
    en: 'Impact',
    text: 'كل مقطع تشاركه قد يكون سببًا في هداية أحد، والدالّ على الخير كفاعله.',
  },
];

export default function Values() {
  return (
    <section id="about" className="relative py-16 md:py-20" aria-label="رسالتنا">
      <div className="container grid gap-5 md:grid-cols-3">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.12}>
            <motion.article whileHover={{ y: -6 }} className="card card-hover group h-full p-7 text-center md:text-right">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-line/40 bg-gold-500/10 text-accent transition duration-500 group-hover:rotate-6 group-hover:bg-gold-gradient group-hover:text-emerald-950 md:mx-0">
                <v.icon className="h-7 w-7" />
              </div>
              <h3 className="font-amiri text-2xl font-bold text-ink">
                {v.title}
                <span className="ms-2 font-latin text-base font-medium italic text-muted">{v.en}</span>
              </h3>
              <p className="mt-3 leading-8 text-muted">{v.text}</p>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
