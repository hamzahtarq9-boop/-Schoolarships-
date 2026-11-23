export default function Logo({ size = 44, className = '', glow = false }) {
  return (
    <img
      src="/logo.webp"
      width={size}
      height={size}
      alt="شعار نور وسكينة"
      className={`select-none rounded-full ${glow ? 'drop-shadow-[0_0_25px_rgba(229,193,88,0.45)]' : ''} ${className}`}
      draggable="false"
    />
  );
}
