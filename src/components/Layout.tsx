import { type ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Stethoscope, Calendar, UserCog, HeartPulse, Phone, Mail, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo, Avatar } from '@/components/shared';
import { Button } from '@/components/ui';

export function Navbar() {
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const dashboardLink =
    profile?.role === 'DOCTOR' ? '/doctor' : profile?.role === 'ADMIN' ? '/admin' : '/patient';

  const navLinks = [
    { to: '/doctors', label: 'Find Doctors' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm'
        : 'bg-transparent'
    }`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
          <Logo size="sm" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} active={location.pathname === link.to}>
              {link.label}
            </NavLink>
          ))}
          {profile?.role === 'DOCTOR' && (
            <NavLink to="/doctor" active={location.pathname === '/doctor'}>My Practice</NavLink>
          )}
          {profile?.role === 'PATIENT' && (
            <NavLink to="/patient" active={location.pathname === '/patient'}>My Appointments</NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {session && profile ? (
            <>
              <Link to={dashboardLink}>
                <Button variant={scrolled ? 'primary' : 'outline'} size="sm">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm py-1 pl-1 pr-3 ring-1 ring-slate-200/60 shadow-sm">
                <Avatar name={profile.full_name} size={32} />
                <div className="leading-tight">
                  <p className="text-sm font-medium text-slate-900">{profile.full_name}</p>
                  <p className="text-xs text-slate-500">{profile.role.toLowerCase()}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100/80 transition-colors md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200/60 bg-white/95 backdrop-blur-xl px-4 py-4 md:hidden shadow-lg">
          <div className="flex flex-col gap-1">
            <MobileLink to="/doctors" icon={<Stethoscope className="h-4 w-4" />} onClick={() => setOpen(false)}>Find Doctors</MobileLink>
            <MobileLink to="/about" icon={<HeartPulse className="h-4 w-4" />} onClick={() => setOpen(false)}>About Us</MobileLink>
            <MobileLink to="/blog" icon={<MessageSquare className="h-4 w-4" />} onClick={() => setOpen(false)}>Blog</MobileLink>
            <MobileLink to="/contact" icon={<Phone className="h-4 w-4" />} onClick={() => setOpen(false)}>Contact</MobileLink>
            {profile?.role === 'DOCTOR' && (
              <MobileLink to="/doctor" icon={<UserCog className="h-4 w-4" />} onClick={() => setOpen(false)}>My Practice</MobileLink>
            )}
            {profile?.role === 'PATIENT' && (
              <MobileLink to="/patient" icon={<Calendar className="h-4 w-4" />} onClick={() => setOpen(false)}>My Appointments</MobileLink>
            )}
            {session && (
              <MobileLink to={dashboardLink} icon={<LayoutDashboard className="h-4 w-4" />} onClick={() => setOpen(false)}>Dashboard</MobileLink>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200/60 pt-4">
            {session && profile ? (
              <>
                <div className="flex items-center gap-3 px-2 py-1">
                  <Avatar name={profile.full_name} size={36} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{profile.full_name}</p>
                    <p className="text-xs text-slate-500">{profile.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <Button className="w-full">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children, active }: { to: string; children: ReactNode; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-brand-50 text-brand-700'
          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, children, icon, onClick }: { to: string; children: ReactNode; icon: ReactNode; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Connecting patients with quality care, one appointment at a time. Your health journey starts here.
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
              <Mail className="h-4 w-4" />
              <span>hello@medbook.dev</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Platform</h4>
            <div className="mt-4 flex flex-col gap-3">
              <FooterLink to="/doctors">Find Doctors</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/blog">Health Blog</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">For Patients</h4>
            <div className="mt-4 flex flex-col gap-3">
              <FooterLink to="/search">Search Specialists</FooterLink>
              <FooterLink to="/how-it-works">How It Works</FooterLink>
              <FooterLink to="/faq">FAQs</FooterLink>
              <FooterLink to="/login">Sign In</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">For Doctors</h4>
            <div className="mt-4 flex flex-col gap-3">
              <FooterLink to="/signup">Join as Doctor</FooterLink>
              <FooterLink to="/doctor">Practice Dashboard</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/support">Support</FooterLink>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} MedBook. For demonstration purposes — not a real medical service.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-sm text-slate-500 hover:text-brand-600 transition-colors">
      {children}
    </Link>
  );
}
