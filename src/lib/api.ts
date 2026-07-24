const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('medbook_token');
}

function setToken(token: string | null) {
  if (token) localStorage.setItem('medbook_token', token);
  else localStorage.removeItem('medbook_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  specialty: string;
  biography: string;
  clinic_address: string;
  consultation_fee: number;
  availability_grid: string;
  years_experience: number;
  created_at: string;
  profiles?: Profile;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: string;
  status: AppointmentStatus;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  patient?: Profile;
  doctor?: Profile;
  doctor_profile?: DoctorProfile;
}

export interface Review {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  patient?: Profile;
}

export interface DoctorWithStats extends DoctorProfile {
  avg_rating: number;
  review_count: number;
  appointment_count: number;
}

export const api = {
  auth: {
    signup(data: { email: string; password: string; full_name: string; role: UserRole }) {
      return request<{ token: string; profile: Profile }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    signin(data: { email: string; password: string }) {
      return request<{ token: string; profile: Profile }>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    me() {
      return request<{ profile: Profile }>('/auth/me');
    },
  },

  doctors: {
    list() {
      return request<DoctorWithStats[]>('/doctors');
    },
    get(userId: string) {
      return request<DoctorProfile & { reviews: (Review & { patient?: Profile })[] }>(`/doctors/${userId}`);
    },
  },

  appointments: {
    list(role?: 'patient' | 'doctor') {
      const qs = role ? `?role=${role}` : '';
      return request<Appointment[]>(`/appointments${qs}`);
    },
    create(data: { doctor_id: string; scheduled_at: string }) {
      return request<Appointment>('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id: string, data: Partial<Appointment>) {
      return request<Appointment>(`/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
  },

  reviews: {
    create(data: { appointment_id: string; doctor_id: string; rating: number; comment?: string }) {
      return request<Review>('/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id: string, data: { rating?: number; comment?: string }) {
      return request<Review>(`/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    delete(id: string) {
      return request<void>(`/reviews/${id}`, { method: 'DELETE' });
    },
  },

  doctorProfile: {
    get() {
      return request<DoctorProfile | null>('/doctor-profile');
    },
    create(data: Record<string, unknown>) {
      return request<DoctorProfile>('/doctor-profile', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(data: Record<string, unknown>) {
      return request<DoctorProfile>('/doctor-profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
  },

  utils: {
    setToken,
    getToken,
  },
};
