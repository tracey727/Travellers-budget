type IconProps = { className?: string };

const base = "h-6 w-6";

export function IconGlobe({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 4 5.7 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.7-4-9s1.5-6.4 4-9Z" />
    </svg>
  );
}

export function IconChart({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" />
      <path d="M3 20h18" strokeLinecap="round" />
    </svg>
  );
}

export function IconCompass({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-2 5-5 2 2-5 5-2Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconDevices({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="3" y="4" width="13" height="9" rx="1.2" />
      <path d="M6 20h7M9.5 13v7" strokeLinecap="round" />
      <rect x="17.5" y="9" width="4.5" height="8" rx="1" />
    </svg>
  );
}

export function IconShield({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M12 3.5 5 6v5.5c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6l-7-2.5Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSuitcase({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="3.5" y="7.5" width="17" height="12" rx="1.6" />
      <path d="M9 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5v2" />
      <path d="M3.5 12.5h17" />
    </svg>
  );
}
