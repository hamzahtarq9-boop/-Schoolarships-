export function InstagramIcon({ className = 'h-5 w-5', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Small 8-point star used as an ornament. */
export function StarOrnament({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 1.5 14.6 5.7 19.4 4.6 18.3 9.4 22.5 12 18.3 14.6 19.4 19.4 14.6 18.3 12 22.5 9.4 18.3 4.6 19.4 5.7 14.6 1.5 12 5.7 9.4 4.6 4.6 9.4 5.7Z" />
    </svg>
  );
}

/** Pointed (Islamic) arch outline. */
export function ArchOutline({ className = '' }) {
  return (
    <svg viewBox="0 0 200 300" className={className} fill="none" aria-hidden="true">
      <path
        d="M10 298V120C10 60 60 25 100 4c40 21 90 56 90 116v178"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M24 298V124c0-50 42-82 76-100 34 18 76 50 76 100v174"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.6"
      />
    </svg>
  );
}
