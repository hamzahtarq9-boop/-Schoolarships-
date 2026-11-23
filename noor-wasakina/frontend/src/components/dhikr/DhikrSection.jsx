import SectionHeading from '../SectionHeading.jsx';
import Reveal from '../Reveal.jsx';
import Tasbeeh from './Tasbeeh.jsx';
import DailyMessage from './DailyMessage.jsx';

export default function DhikrSection() {
  return (
    <section id="dhikr" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="ركن الأذكار"
          title="ذِكرٌ وتأمّلٌ يومي"
          en="Daily dhikr & reflection"
          subtitle="دقيقة مع الله تكفي لتغيّر يومك. سبّح بمسبحتك الإلكترونية، وخذ رسالة اليوم معك."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal className="h-full min-w-0">
            <Tasbeeh />
          </Reveal>
          <Reveal className="h-full min-w-0" delay={0.12}>
            <DailyMessage />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
