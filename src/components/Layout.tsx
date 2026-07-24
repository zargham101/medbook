import { type ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Calendar, Stethoscope, UserCog } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo, Avatar } from '@/components/shared';
import { Button } from '@/components/ui';

export function Navbar() {
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const dashboardLink =
    profile?.role === 'DOCTOR' ? '/doctor' : profile?.role === 'ADMIN' ? '/admin' : '/patient';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/doctors">Find Doctors</NavLink>
          {profile?.role === 'DOCTOR' && <NavLink to="/doctor">My Practice</NavLink>}
          {profile?.role === 'PATIENT' && <NavLink to="/patient">My Appointments</NavLink>}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {session && profile ? (
            <>
              <Link to={dashboardLink}>
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 rounded-full bg-slate-50 py-1 pl-1 pr-3 ring-1 ring-slate-200">
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
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <MobileLink to="/doctors" icon={<Stethoscope className="h-4 w-4" />} onClick={() => setOpen(false)}>Find Doctors</MobileLink>
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
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
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

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
      {children}
    </Link>
  );
}

function MobileLink({ to, children, icon, onClick }: { to: string; children: ReactNode; icon: ReactNode; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
      {icon}
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo />
          <p className="text-sm text-slate-500">
            Connecting patients with quality care, one appointment at a time.
          </p>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-6 text-center">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} MedBook. For demonstration purposes only — not a real medical service.</p>
        </div>
      </div>
    </footer>
  );
}
