import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, HeartPulse, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { SectionHeader } from '@/components/shared';

const contactInfo = [
  { icon: <Mail className="h-5 w-5" />, title: 'Email', detail: 'hello@medbook.dev', desc: 'We typically respond within 24 hours.' },
  { icon: <Phone className="h-5 w-5" />, title: 'Phone', detail: '+1 (555) 123-4567', desc: 'Mon–Fri, 9am–6pm EST' },
  { icon: <MapPin className="h-5 w-5" />, title: 'Office', detail: '123 Health Street, Suite 200', desc: 'San Francisco, CA 94102' },
];

const faqs = [
  { q: 'How do I book an appointment?', a: 'Browse our directory of verified doctors, select a specialist, choose an available time slot, and confirm. It takes less than 2 minutes.' },
  { q: 'Is MedBook free for patients?', a: 'Yes! MedBook is completely free for patients. Doctors set their own consultation fees which are displayed clearly on their profiles.' },
  { q: 'How are doctors verified?', a: 'All providers undergo credential verification including license checks, education confirmation, and malpractice history review.' },
  { q: 'Can I cancel or reschedule?', a: 'Absolutely. You can cancel or reschedule any upcoming appointment directly from your patient dashboard.' },
];

export function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-cyan-50" />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200/50 mb-6">
            <MessageSquare className="h-3.5 w-3.5" />
            Get in Touch
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
            We'd love to hear from{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500">you</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or want to partner with us? Reach out — our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="relative -mt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.title} className="bento-card p-5 flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-900 mt-0.5">{item.detail}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="bento-card p-5">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-brand-600" />
                  <span>Response time: <strong className="text-slate-900">&lt; 24 hours</strong></span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bento-card p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-cyan-50 text-brand-600 mb-4">
                    <Send className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message sent!</h3>
                  <p className="mt-2 text-sm text-slate-500 max-w-sm">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-slate-900">Send us a message</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Fill out the form below and we'll respond as soon as possible.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                        <input
                          type="text" required value={name} onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className="doc-input"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                        <input
                          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@example.com"
                          className="doc-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                      <textarea
                        required value={message} onChange={(e) => setMessage(e.target.value)}
                        rows={5} placeholder="Tell us how we can help..."
                        className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 transition-all duration-200"
                      />
                    </div>
                    <Button type="submit" size="lg">
                      <Send className="h-4 w-4" />
                      Send message
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-b from-white to-brand-50/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bento-card overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold text-slate-900 hover:bg-slate-50/50 transition-colors">
                  {faq.q}
                  <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
