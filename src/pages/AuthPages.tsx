import { useState, useEffect, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Stethoscope, UserRound, HeartPulse, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/lib/api';
import { Logo } from '@/components/shared';
import { Button } from '@/components/ui';

function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-28">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="inline-block"><Logo /></Link>
          <div className="mt-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        </div>
      </div>
      <div className="relative hidden lg:block lg:flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-cyan-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex h-full flex-col justify-center p-20 text-white">
          <HeartPulse className="h-12 w-12 text-brand-200 animate-pulse-soft" />
          <h2 className="mt-6 text-3xl font-bold leading-tight">Your health, on your schedule.</h2>
          <p className="mt-4 max-w-md text-brand-100 leading-relaxed">
            Join thousands of patients and doctors using MedBook to make quality care more accessible.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { icon: <UserRound className="h-5 w-5" />, text: 'Book appointments in under 5 minutes' },
              { icon: <Stethoscope className="h-5 w-5" />, text: 'Verified specialists across 6+ fields' },
              { icon: <ArrowRight className="h-5 w-5" />, text: 'Manage everything from one dashboard' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-brand-50">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { signIn, session, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from;

  useEffect(() => {
    if (session && profile) {
      const home = profile.role === 'DOCTOR' ? '/doctor' : profile.role === 'ADMIN' ? '/admin' : '/patient';
      navigate(from ?? home, { replace: true });
    }
  }, [session, profile, navigate, from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setLoading(false);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your appointments."
      footer={<>Don&apos;t have an account? <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">Create one</Link></>}
    >
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50/80 backdrop-blur-sm px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-200/50">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" icon={<Mail className="h-4 w-4" />}>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="auth-input"
          />
        </Field>
        <Field label="Password" icon={<Lock className="h-4 w-4" />}>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="auth-input"
          />
        </Field>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign in
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
      <div className="mt-6 rounded-xl bg-brand-50/50 backdrop-blur-sm px-4 py-3 text-xs text-slate-500 ring-1 ring-inset ring-brand-200/50">
        <p className="font-medium text-brand-700">Try a demo doctor account:</p>
        <p className="mt-1">demo+chen@medbook.dev · demoPassword123</p>
      </div>
    </AuthShell>
  );
}

export function SignupPage() {
  const { signUp, session, profile } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session && profile) {
      const home = profile.role === 'DOCTOR' ? '/doctor' : '/patient';
      navigate(home, { replace: true });
    }
  }, [session, profile, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await signUp(email, password, fullName, role);
    if (err) setError(err);
    else setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle="We sent a confirmation link."
        footer={<Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Back to sign in</Link>}
      >
        <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-cyan-50 p-6 text-center ring-1 ring-inset ring-brand-200/50">
          <HeartPulse className="mx-auto h-10 w-10 text-brand-600" />
          <p className="mt-3 text-sm text-brand-800">
            We sent a confirmation link to <span className="font-semibold">{email}</span>. Click it to activate your account, then sign in.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join MedBook as a patient or a doctor."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link></>}
    >
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50/80 backdrop-blur-sm px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-200/50">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">I am a...</label>
          <div className="grid grid-cols-2 gap-3">
            <RoleCard active={role === 'PATIENT'} onClick={() => setRole('PATIENT')} icon={<UserRound className="h-5 w-5" />} label="Patient" desc="Book visits" />
            <RoleCard active={role === 'DOCTOR'} onClick={() => setRole('DOCTOR')} icon={<Stethoscope className="h-5 w-5" />} label="Doctor" desc="Offer care" />
          </div>
        </div>
        <Field label="Full name" icon={<User className="h-4 w-4" />}>
          <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" className="auth-input" />
        </Field>
        <Field label="Email" icon={<Mail className="h-4 w-4" />}>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="auth-input" />
        </Field>
        <Field label="Password" icon={<Lock className="h-4 w-4" />}>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="auth-input" />
        </Field>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create account
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </AuthShell>
  );
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon, label, desc }: { active: boolean; onClick: () => void; icon: ReactNode; label: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
        active
          ? 'border-brand-500 bg-brand-50/80 ring-1 ring-brand-500/30 shadow-sm'
          : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
        active ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'
      }`}>{icon}</span>
      <div>
        <p className={`text-sm font-semibold ${active ? 'text-brand-700' : 'text-slate-900'}`}>{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </button>
  );
}
