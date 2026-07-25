import { Link } from 'react-router-dom';
import { Search, CalendarCheck, Star, ShieldCheck, Clock, HeartPulse, ArrowRight, Stethoscope, UserRound } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export function LandingPage() {
  const { profile } = useAuth();
  const ctaLink = profile?.role === 'DOCTOR' ? '/doctor' : profile?.role === 'PATIENT' ? '/patient' : '/signup';

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/80 via-white to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-teal-100/40 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                <HeartPulse className="h-3.5 w-3.5" />
                Trusted care, simplified
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Book your next doctor&apos;s visit in <span className="text-teal-600">minutes</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-slate-600">
                MedBook connects you with verified specialists across cardiology, dermatology, pediatrics, and more. Browse availability, request an appointment, and manage your care — all in one place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/doctors">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Search className="h-5 w-5" />
                    Find a doctor
                  </Button>
                </Link>
                <Link to={ctaLink}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {profile ? 'Go to dashboard' : 'Create an account'}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['SC', 'MR', 'AP', 'JO', 'EW'].map((i) => (
                    <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white ring-2 ring-white">
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">Rated by 1,200+ happy patients</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Upcoming appointment</p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">Confirmed</span>
                </div>
                <div className="mt-4 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Dr. Sarah Chen</p>
                    <p className="text-sm text-slate-500">Cardiology</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="mt-0.5 font-semibold text-slate-900">Thu, Jul 31</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500">Time</p>
                    <p className="mt-0.5 font-semibold text-slate-900">10:00 AM</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" variant="secondary">
                  <CalendarCheck className="h-4 w-4" />
                  View appointment details
                </Button>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">HIPAA-aligned</p>
                    <p className="text-xs text-slate-500">Secure & private</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Three simple steps to better care</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: <Search className="h-6 w-6" />, title: 'Find your doctor', desc: 'Search by specialty, location, or availability. Read verified reviews from real patients.' },
              { icon: <CalendarCheck className="h-6 w-6" />, title: 'Request a time', desc: 'Pick an open slot that fits your schedule. Your doctor confirms within hours.' },
              { icon: <Star className="h-6 w-6" />, title: 'Visit & review', desc: 'Attend your appointment, then share your experience to help other patients choose.' },
            ].map((step, i) => (
              <div key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  {step.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 p-8 text-white lg:p-10">
              <UserRound className="h-8 w-8 text-teal-100" />
              <h3 className="mt-5 text-2xl font-bold">For patients</h3>
              <p className="mt-3 text-teal-50">
                Take control of your health journey. Track upcoming visits, reschedule with a tap, and keep a history of every appointment in one secure dashboard.
              </p>
              <ul className="mt-6 space-y-3">
                {['Browse verified specialists', 'Real-time appointment requests', 'Leave reviews after visits', 'Cancel or reschedule anytime'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-teal-50">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400/30 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="mt-8 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50">
                  Join as a patient
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white lg:p-10">
              <Stethoscope className="h-8 w-8 text-slate-300" />
              <h3 className="mt-5 text-2xl font-bold">For doctors</h3>
              <p className="mt-3 text-slate-300">
                Grow your practice and streamline scheduling. Set your weekly availability, manage incoming requests, and track your patient feedback — all from one dashboard.
              </p>
              <ul className="mt-6 space-y-3">
                {['Set custom weekly availability', 'Confirm or decline requests instantly', 'View analytics & ratings', 'Build your public profile'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-300">
                    <span className="flex h-5 w-5 items-center justify-center justify-center rounded-full bg-slate-700 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className="mt-8 bg-slate-100 text-slate-900 hover:bg-slate-100">
                  Join as a doctor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { value: '6+', label: 'Specialties' },
              { value: '1.2k+', label: 'Appointments booked' },
              { value: '4.8★', label: 'Average rating' },
              { value: '24/7', label: 'Online booking' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-teal-600 sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Clock className="mx-auto h-10 w-10 text-teal-600" />
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ready to take charge of your health?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Join MedBook today and book your first appointment in under five minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/doctors">
              <Button size="lg" className="w-full sm:w-auto">
                <Search className="h-5 w-5" />
                Browse doctors now
              </Button>
            </Link>
            <Link to={ctaLink}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
