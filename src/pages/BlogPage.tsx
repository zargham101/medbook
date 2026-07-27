import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, HeartPulse, UserRound, Stethoscope, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui';

const articles = [
  {
    category: 'Preventive Care',
    date: 'Jul 24, 2026',
    readTime: '5 min read',
    title: '10 Essential Health Screenings You Shouldn\'t Skip After 40',
    excerpt: 'Regular health screenings can detect potential issues early when they\'re most treatable. Here\'s what every adult over 40 should prioritize.',
    author: 'Dr. Sarah Chen',
    authorRole: 'Cardiologist',
    gradient: 'from-brand-500 to-cyan-500',
  },
  {
    category: 'Mental Health',
    date: 'Jul 21, 2026',
    readTime: '6 min read',
    title: 'Understanding Burnout: Signs, Symptoms, and When to Seek Help',
    excerpt: 'Burnout is more than just stress. Learn to recognize the warning signs and discover effective strategies for recovery and prevention.',
    author: 'Dr. Marcus Rivera',
    authorRole: 'Internist',
    gradient: 'from-violet-500 to-indigo-500',
  },
  {
    category: 'Nutrition',
    date: 'Jul 18, 2026',
    readTime: '4 min read',
    title: 'The Heart-Healthy Diet: What Cardiologists Eat in a Day',
    excerpt: 'Small dietary changes can have a big impact on cardiovascular health. Get an inside look at what heart doctors actually put on their plates.',
    author: 'Dr. Lisa Park',
    authorRole: 'Nutrition Specialist',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    category: 'Telemedicine',
    date: 'Jul 15, 2026',
    readTime: '7 min read',
    title: 'Telehealth vs. In-Person Visits: When to Choose Each',
    excerpt: 'Not all medical concerns require an office visit. Learn which conditions can be treated virtually and when you should see a doctor in person.',
    author: 'Dr. James Okafor',
    authorRole: 'Family Medicine',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    category: 'Women\'s Health',
    date: 'Jul 12, 2026',
    readTime: '5 min read',
    title: 'A Complete Guide to Annual Wellness Exams',
    excerpt: 'Annual checkups are your first line of defense. Here\'s what to expect, what to prepare, and the questions you should be asking your doctor.',
    author: 'Dr. Maria Torres',
    authorRole: 'OB/GYN',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    category: 'Pediatrics',
    date: 'Jul 9, 2026',
    readTime: '4 min read',
    title: 'Vaccination Schedule 2026: What Parents Need to Know',
    excerpt: 'Stay up-to-date with the latest recommended vaccination schedule for children from infancy through adolescence.',
    author: 'Dr. Amanda Lee',
    authorRole: 'Pediatrician',
    gradient: 'from-blue-500 to-cyan-500',
  },
];

export function BlogPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-cyan-50" />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200/50 mb-6">
            <BookOpen className="h-3.5 w-3.5" />
            Health Blog
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
            Insights for a{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-500">healthier you</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Expert-written articles on preventive care, wellness tips, medical advancements, and everything you need to make informed healthcare decisions.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="relative -mt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Featured */}
          <div className="mb-12">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-cyan-700 p-8 lg:p-12 text-white cursor-pointer">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative max-w-2xl">
                <span className="inline-flex rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-semibold mb-4">
                  Featured Article
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
                  The Future of Telemedicine: How Virtual Care is Transforming Healthcare in 2026
                </h2>
                <p className="mt-3 text-brand-100 leading-relaxed">
                  From AI-assisted diagnostics to remote patient monitoring, telemedicine is evolving faster than ever. Discover the trends shaping the future of digital healthcare.
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-brand-200">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Jul 26, 2026</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 8 min read</span>
                </div>
                <Button className="mt-6 bg-white text-brand-700 hover:bg-brand-50">
                  Read article <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Article Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, idx) => (
              <div key={article.title} className="group bento-card overflow-hidden" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className={`h-48 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-3 text-white/70 text-xs">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">{article.excerpt}</p>
                  <div className="mt-5 flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${article.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                      {article.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{article.author}</p>
                      <p className="text-xs text-slate-500">{article.authorRole}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More CTA */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load more articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-cyan-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <HeartPulse className="mx-auto h-12 w-12 text-brand-200 animate-pulse-soft" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stay informed, stay healthy
          </h2>
          <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
            Get weekly health tips, medical insights, and expert advice delivered to your inbox.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 text-sm text-white placeholder:text-brand-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button className="bg-white text-brand-700 hover:bg-brand-50 shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
