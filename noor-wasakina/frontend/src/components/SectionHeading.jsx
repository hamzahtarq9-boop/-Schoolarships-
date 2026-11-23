import Reveal from './Reveal.jsx';
import { StarOrnament } from './Icons.jsx';

export default function SectionHeading({ eyebrow, title, subtitle, en }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-line/30 bg-gold-500/10 px-4 py-1.5 text-xs font-bold tracking-wide text-accent">
          <StarOrnament className="h-3 w-3" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-amiri text-4xl font-bold leading-tight md:text-5xl">
        <span className="text-gold">{title}</span>
      </h2>
      {en && <p className="mt-2 font-latin text-lg italic text-muted">{en}</p>}
      <div className="divider-star my-5" aria-hidden="true">
        <StarOrnament className="h-4 w-4" />
      </div>
      {subtitle && <p className="text-base leading-8 text-muted md:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
