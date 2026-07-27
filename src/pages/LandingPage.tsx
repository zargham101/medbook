import { Link } from 'react-router-dom';
import { Search, CalendarCheck, Star, ShieldCheck, Clock, HeartPulse, ArrowRight, Stethoscope, UserRound, Sparkles, Activity, Ambulance, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export function LandingPage() {
  const { profile } = useAuth();
  const ctaLink = profile?.role === 'DOCTOR' ? '/doctor' : profile?.role === 'PATIENT' ? '/patient' : '/signup';

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-cyan-50" />
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-100/40 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-100/30 blur-3xl" />
          <div className="absolute top-1/3 -left-20 h-[300px] w-[300px] rounded-full bg-teal-100/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28 w-full">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200/50">
                <Sparkles className="h-3.5 w-3.5" />
                Trusted care, simplified
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                Your health,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500">
                  one click away
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-500 leading-relaxed">
                Book verified specialists, manage appointments, and take control of your health journey — all from one beautiful dashboard.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/doctors">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-brand-600/25 group">
                    <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Find a doctor
                  </Button>
                </Link>
                <Link to={ctaLink}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                    {profile ? 'Go to dashboard' : 'Create free account'}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <div className="flex -space-x-2">
                  {['SC', 'MR', 'AP', 'JO', 'EW'].map((i, idx) => (
                    <div key={i} className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-xs font-bold text-white ring-2 ring-white shadow-sm ${idx === 0 ? 'animate-float' : ''}`}>
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
                  <p className="mt-0.5 text-sm text-slate-500">Rated 4.8★ by 1,200+ happy patients</p>
                </div>
              </div>
            </div>

            <div className="relative lg:pl-8 animate-slide-up">
              <div className="relative">
                <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 p-6 shadow-2xl shadow-brand-900/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Upcoming appointment</p>
                    <span className="rounded-full bg-emerald-50/80 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200/50">Confirmed</span>
                  </div>
                  <div className="mt-4 flex items-center gap-4 rounded-2xl bg-brand-50/50 backdrop-blur-sm p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Dr. Sarah Chen</p>
                      <p className="text-sm text-slate-500">Cardiology</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200/60 bg-white/50 p-3">
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="mt-0.5 font-semibold text-slate-900">Thu, Jul 31</p>
                    </div>
                    <div className="rounded-xl border border-slate-200/60 bg-white/50 p-3">
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="mt-0.5 font-semibold text-slate-900">10:00 AM</p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" variant="secondary">
                    <CalendarCheck className="h-4 w-4" />
                    View appointment details
                  </Button>
                </div>
                <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 p-4 shadow-xl sm:block animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md">
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
        </div>
      </section>

      {/* Trust Band */}
      <section className="relative -mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 p-8 shadow-lg shadow-slate-900/5">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { value: '6+', label: 'Specialties' },
                { value: '1.2k+', label: 'Appointments booked' },
                { value: '4.8★', label: 'Average rating' },
                { value: '24/7', label: 'Online booking' },
              ].map((stat) => (
                <div key={stat.label} className="relative">
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500 sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Bento Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Three simple steps to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500">better care</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              { icon: <Search className="h-7 w-7" />, title: 'Find your doctor', desc: 'Search by specialty, location, or availability. Read verified reviews from real patients.', color: 'from-brand-500 to-cyan-500', bg: 'from-brand-50 to-cyan-50' },
              { icon: <CalendarCheck className="h-7 w-7" />, title: 'Request a time', desc: 'Pick an open slot that fits your schedule. Get confirmed within hours, not days.', color: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50' },
              { icon: <Star className="h-7 w-7" />, title: 'Visit & review', desc: 'Attend your appointment, then share your experience to help other patients choose.', color: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50' },
            ].map((step, i) => (
              <div key={step.title} className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.bg} rounded-bl-full -z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-xs font-bold text-white shadow-md`}>
                  {i + 1}
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}>
                  {step.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights - Bento Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-brand-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Why MedBook</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need for{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500">seamless care</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <BadgeCheck className="h-6 w-6" />, title: 'Verified Specialists', desc: 'Every doctor is credential-checked. Browse detailed profiles, read reviews, and book with confidence.', color: 'from-brand-500 to-cyan-500' },
              { icon: <Clock className="h-6 w-6" />, title: 'Instant Booking', desc: 'See real-time availability and book in under 60 seconds. No phone calls, no waitlists.', color: 'from-emerald-500 to-teal-500' },
              { icon: <Activity className="h-6 w-6" />, title: 'Smart Dashboard', desc: 'Track upcoming visits, manage reschedules, and access your complete appointment history.', color: 'from-violet-500 to-indigo-500' },
              { icon: <Ambulance className="h-6 w-6" />, title: 'Urgent Care Access', desc: 'Need same-day care? Filter by earliest availability and book with nearby providers.', color: 'from-rose-500 to-pink-500' },
              { icon: <ShieldCheck className="h-6 w-6" />, title: 'HIPAA Compliant', desc: 'Your data is encrypted end-to-end. We take privacy and security as seriously as you do.', color: 'from-blue-500 to-cyan-500' },
              { icon: <Star className="h-6 w-6" />, title: 'Patient Reviews', desc: 'Real feedback from real patients. Make informed decisions with transparent star ratings.', color: 'from-amber-500 to-orange-500' },
            ].map((feature) => (
              <div key={feature.title} className="group bento-card p-6 hover:-translate-y-1">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Patients & Doctors */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white lg:p-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <UserRound className="h-8 w-8 text-brand-200" />
              <h3 className="mt-5 text-2xl font-bold">For patients</h3>
              <p className="mt-3 text-brand-100 leading-relaxed">
                Take control of your health journey. Track upcoming visits, reschedule with a tap, and keep a history of every appointment.
              </p>
              <ul className="mt-6 space-y-3">
                {['Browse verified specialists', 'Real-time appointment requests', 'Leave reviews after visits', 'Cancel or reschedule anytime'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-brand-50">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-400/30 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="mt-8 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm">
                  Join as a patient
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white lg:p-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <Stethoscope className="h-8 w-8 text-slate-300" />
              <h3 className="mt-5 text-2xl font-bold">For doctors</h3>
              <p className="mt-3 text-slate-300 leading-relaxed">
                Grow your practice and streamline scheduling. Set your availability, manage requests, and track feedback — all in one place.
              </p>
              <ul className="mt-6 space-y-3">
                {['Set custom weekly availability', 'Confirm or decline requests instantly', 'View analytics & ratings', 'Build your public profile'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className="mt-8 bg-white text-slate-900 hover:bg-slate-100">
                  Join as a doctor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-white to-brand-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Testimonials</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Loved by patients &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500">doctors alike</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Maria R.', role: 'Patient', text: 'MedBook made finding a specialist so easy. I booked an appointment with a cardiologist in under 2 minutes!' },
              { name: 'Dr. James W.', role: 'Cardiologist', text: 'The scheduling dashboard has saved me hours of phone tag with patients. Absolutely game-changing for my practice.' },
              { name: 'Liam K.', role: 'Patient', text: 'Being able to see real availability and book instantly is incredible. No more waiting on hold for receptionists.' },
            ].map((t) => (
              <div key={t.name} className="bento-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold`}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-cyan-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <HeartPulse className="mx-auto h-12 w-12 text-brand-200 animate-pulse-soft" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to take charge of your health?
          </h2>
          <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
            Join MedBook today and book your first appointment in under five minutes. No phone calls, no waitlists — just quality care.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/doctors">
              <Button size="lg" className="w-full sm:w-auto bg-white text-brand-700 hover:bg-brand-50 shadow-xl">
                <Search className="h-5 w-5" />
                Browse doctors now
              </Button>
            </Link>
            <Link to={ctaLink}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                {profile ? 'Go to dashboard' : 'Create free account'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
