import { type ReactNode } from 'react';

const PALETTE = [
  'bg-teal-100 text-teal-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
  'bg-cyan-100 text-cyan-700',
  'bg-violet-100 text-violet-700',
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
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${color} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials || '?'}
    </div>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/30">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
        </svg>
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900">MedBook</span>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">{eyebrow}</p>}
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-base text-slate-600">{description}</p>}
    </div>
  );
}

export function StatTile({ label, value, icon, accent = 'teal' }: { label: string; value: ReactNode; icon?: ReactNode; accent?: 'teal' | 'blue' | 'emerald' | 'amber' }) {
  const accents: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {icon && <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accents[accent]}`}>{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
