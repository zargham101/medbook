import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type Profile, type UserRole } from '@/lib/api';

interface AuthContextValue {
  session: { user: { id: string } } | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.utils.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth.me()
      .then(({ profile: p }) => {
        setProfile(p);
        setSession({ user: { id: p.id } });
      })
      .catch(() => {
        api.utils.setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function refreshProfile() {
    try {
      const { profile: p } = await api.auth.me();
      setProfile(p);
    } catch {
      // ignore
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { token, profile: p } = await api.auth.signin({ email, password });
      api.utils.setToken(token);
      setProfile(p);
      setSession({ user: { id: p.id } });
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function signUp(email: string, password: string, fullName: string, role: UserRole) {
    try {
      const { token, profile: p } = await api.auth.signup({ email, password, full_name: fullName, role });
      api.utils.setToken(token);
      setProfile(p);
      setSession({ user: { id: p.id } });
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function signOut() {
    api.utils.setToken(null);
    setProfile(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
