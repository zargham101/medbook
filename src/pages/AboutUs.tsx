import { Link } from 'react-router-dom';
import { HeartPulse, Shield, Users, Award, ArrowRight, Stethoscope, CalendarCheck, Star, Activity } from 'lucide-react';
import { Button } from '@/components/ui';
import { SectionHeader } from '@/components/shared';

const team = [
  { name: 'Dr. Sarah Chen', role: 'CEO & Founder', desc: 'Cardiologist with 15+ years of clinical experience. Founded MedBook to bridge the gap between patients and quality care.', initials: 'SC' },
  { name: 'Dr. Marcus Rivera', role: 'Chief Medical Officer', desc: 'Board-certified internist overseeing clinical quality and provider credentialing.', initials: 'MR' },
  { name: 'Alice Park', role: 'CTO', desc: 'Former engineering lead at major health-tech companies. Building the future of digital healthcare.', initials: 'AP' },
  { name: 'James Okafor', role: 'Head of Product', desc: 'Product leader passionate about creating intuitive experiences that put patients first.', initials: 'JO' },
];

const stats = [
  { value: '6+', label: 'Medical Specialties', icon: <Stethoscope className="h-6 w-6" /> },
  { value: '1,200+', label: 'Appointments Booked', icon: <CalendarCheck className="h-6 w-6" /> },
  { value: '4.8★', label: 'Average Rating', icon: <Star className="h-6 w-6" /> },
  { value: '50+', label: 'Verified Doctors', icon: <Users className="h-6 w-6" /> },
];

const values = [
  { icon: <HeartPulse className="h-6 w-6" />, title: 'Patient First', desc: 'Every decision we make starts with the patient experience. Your health journey is our priority.' },
  { icon: <Shield className="h-6 w-6" />, title: 'Trust & Safety', desc: 'All providers are credential-verified. Your data is encrypted end-to-end and HIPAA-compliant.' },
  { icon: <Award className="h-6 w-6" />, title: 'Quality Care', desc: 'We partner with experienced specialists who meet rigorous standards for patient care.' },
  { icon: <Activity className="h-6 w-6" />, title: 'Innovation', desc: 'Leveraging technology to eliminate wait times, reduce friction, and make healthcare accessible.' },
];

export function AboutUs() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-cyan-50" />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200/50 mb-6">
            <HeartPulse className="h-3.5 w-3.5" />
            About MedBook
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
            Making healthcare{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500">accessible for everyone</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            MedBook was founded with a simple mission: eliminate the hassle of finding and booking quality healthcare. We connect patients with verified specialists — quickly, securely, and seamlessly.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 p-8 shadow-lg shadow-slate-900/5">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <SectionHeader
                eyebrow="Our Mission"
                title="Transforming the way people connect with healthcare"
                description="We believe that booking a doctor's appointment should be as easy as ordering a ride. MedBook eliminates phone calls, wait times, and administrative friction so you can focus on what matters — your health."
              />
              <div className="mt-8 space-y-4">
                {[
                  'Real-time availability across 6+ medical specialties',
                  'Verified provider credentials and patient reviews',
                  'Secure, HIPAA-compliant platform',
                  'Free for patients — no subscription needed',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-xs">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-cyan-50 p-1">
              <div className="rounded-2xl bg-white p-8 border border-slate-200/60">
                <HeartPulse className="h-10 w-10 text-brand-600" />
                <blockquote className="mt-6 text-lg text-slate-600 italic leading-relaxed">
                  "Healthcare is a fundamental right, not a privilege. We built MedBook to remove the barriers between patients and the care they deserve."
                </blockquote>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold">SC</div>
                  <div>
                    <p className="font-semibold text-slate-900">Dr. Sarah Chen</p>
                    <p className="text-sm text-slate-500">CEO & Founder, MedBook</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-white to-brand-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Our Values</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What drives us every day
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="bento-card p-6 flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-md">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{v.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Our Team</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Meet the people behind MedBook
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="bento-card p-6 text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {member.initials}
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{member.name}</h3>
                <p className="text-sm font-medium text-brand-600">{member.role}</p>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-cyan-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to experience better healthcare?
          </h2>
          <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
            Join thousands of patients who've found quality care through MedBook. It's free to get started.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/doctors">
              <Button size="lg" className="w-full sm:w-auto bg-white text-brand-700 hover:bg-brand-50 shadow-xl">
                <Stethoscope className="h-5 w-5" />
                Find a doctor
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                Get in touch
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
