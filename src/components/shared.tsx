import { type ReactNode } from 'react';

const PALETTE = [
  'bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700',
  'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700',
  'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700',
  'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700',
  'bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700',
  'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700',
  'bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700',
  'bg-gradient-to-br from-violet-100 to-violet-200 text-violet-700',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function Avatar({ name, size = 40, className = '' }: { name: string; size?: number; className?: string }) {
  const initials = name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const color = PALETTE[hashString(name) % PALETTE.length];
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold shadow-sm ${color} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials || '?'}
    </div>
  );
}

export function Logo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const logoSize = size === 'sm' ? 8 : size === 'lg' ? 11 : 9;
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  const textClass = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex h-${logoSize} w-${logoSize} items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-md shadow-brand-600/30`}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
        </svg>
      </div>
      <span className={`${textClass} font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700`}>MedBook</span>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className = '',
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-base text-slate-500">{description}</p>}
    </div>
  );
}

export function StatTile({ label, value, icon, accent = 'teal' }: { label: string; value: ReactNode; icon?: ReactNode; accent?: 'teal' | 'blue' | 'emerald' | 'amber' }) {
  const accents: Record<string, string> = {
    teal: 'bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600',
    emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600',
    amber: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600',
  };
  const dotColors: Record<string, string> = {
    teal: 'bg-brand-500',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
  };
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColors[accent]}`} />
          <span className="text-sm font-medium text-slate-500">{label}</span>
        </div>
        {icon && <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accents[accent]}`}>{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
