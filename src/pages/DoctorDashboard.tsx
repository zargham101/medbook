import { useEffect, useState, useMemo, type ReactNode } from 'react';
import {
  Calendar, Clock, CheckCircle2, XCircle, Star, Users, TrendingUp, DollarSign,
  MapPin, Award, Save, Loader2, CalendarClock, Edit3,
} from 'lucide-react';
import { api, type Appointment, type DoctorProfile, type Profile, type Review } from '@/lib/api';
import {
  parseAvailability, formatCurrency, formatDate, formatTime, formatDateTime,
  DEFAULT_AVAILABILITY, DAYS_OF_WEEK, type AvailabilityGrid,
} from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Avatar, StatTile, SectionHeader } from '@/components/shared';
import { Card, Button, StatusBadge, EmptyState, StarRating, Badge, Spinner } from '@/components/ui';

interface AppointmentRow extends Appointment {
  patient?: Profile;
}

type Tab = 'requests' | 'schedule' | 'profile' | 'analytics';

export function DoctorDashboard() {
  const { profile, refreshProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('requests');
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [reviews, setReviews] = useState<(Review & { patient?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    if (!profile) return;
    try {
      const [dp, apts] = await Promise.all([
        api.doctorProfile.get(),
        api.appointments.list('doctor'),
      ]);
      setDoctorProfile(dp);
      setAppointments(apts as AppointmentRow[]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, [profile]);

  const pending = appointments.filter((a) => a.status === 'PENDING');
  const upcoming = appointments.filter((a) => (a.status === 'CONFIRMED' || a.status === 'RESCHEDULED') && new Date(a.scheduled_at) > new Date());
  const past = appointments.filter((a) => a.status === 'CANCELLED' || new Date(a.scheduled_at) <= new Date());
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const totalRevenue = appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'RESCHEDULED').length * (doctorProfile?.consultation_fee ?? 0);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Spinner className="h-7 w-7" /></div>;

  if (!doctorProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Doctor" title={profile?.full_name ?? ''} description="Set up your practice profile to start receiving appointment requests." />
          <div className="mt-8">
            <ProfileTab doctorProfile={null} onSaved={() => { loadAll(); refreshProfile(); }} />
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: ReactNode; count?: number }[] = [
    { id: 'requests', label: 'Requests', icon: <CalendarClock className="h-4 w-4" />, count: pending.length },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-4 w-4" />, count: upcoming.length },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'profile', label: 'Profile', icon: <Edit3 className="h-4 w-4" /> },
  ];

  async function updateStatus(id: string, status: 'CONFIRMED' | 'CANCELLED', reason?: string) {
    try {
      await api.appointments.update(id, { status, cancellation_reason: reason || null } as any);
      loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader eyebrow="Doctor" title={profile?.full_name ?? ''} description={doctorProfile.specialty} />
          <Badge variant="teal"><Award className="h-3 w-3" /> {doctorProfile.years_experience} yrs experience</Badge>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Pending" value={pending.length} icon={<Clock className="h-5 w-5" />} accent="amber" />
          <StatTile label="Upcoming" value={upcoming.length} icon={<Calendar className="h-5 w-5" />} accent="teal" />
          <StatTile label="Avg rating" value={reviews.length ? avgRating.toFixed(1) : '—'} icon={<Star className="h-5 w-5" />} accent="emerald" />
          <StatTile label="Bookings" value={appointments.length} icon={<Users className="h-5 w-5" />} accent="blue" />
        </div>

        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.icon}
              {t.label}
              {typeof t.count === 'number' && t.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${tab === t.id ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'requests' && (
            <div>
              {pending.length === 0 ? (
                <EmptyState icon={<CalendarClock className="h-6 w-6" />} title="No pending requests" description="New appointment requests from patients will appear here." />
              ) : (
                <div className="space-y-3">
                  {pending.map((apt) => (
                    <RequestCard key={apt.id} apt={apt} onConfirm={() => updateStatus(apt.id, 'CONFIRMED')} onDecline={() => { const r = window.prompt('Reason for declining? (optional)'); updateStatus(apt.id, 'CANCELLED', r ?? undefined); }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'schedule' && (
            <div>
              {upcoming.length === 0 ? (
                <EmptyState icon={<Calendar className="h-6 w-6" />} title="No upcoming appointments" description="Confirmed and rescheduled visits will appear here." />
              ) : (
                <div className="space-y-3">
                  {upcoming.map((apt) => (
                    <ScheduleCard key={apt.id} apt={apt} onCancel={() => { const r = window.prompt('Reason for cancellation? (optional)'); updateStatus(apt.id, 'CANCELLED', r ?? undefined); }} />
                  ))}
                </div>
              )}
              {past.length > 0 && (
                <>
                  <h3 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Past</h3>
                  <div className="space-y-3">
                    {past.slice(0, 10).map((apt) => <ScheduleCard key={apt.id} apt={apt} past />)}
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'analytics' && (
            <AnalyticsTab appointments={appointments} reviews={reviews} doctorProfile={doctorProfile} avgRating={avgRating} totalRevenue={totalRevenue} />
          )}

          {tab === 'profile' && (
            <ProfileTab doctorProfile={doctorProfile} onSaved={() => { loadAll(); refreshProfile(); }} />
          )}
        </div>
      </div>
    </div>
  );
}

function RequestCard({ apt, onConfirm, onDecline }: { apt: AppointmentRow; onConfirm: () => void; onDecline: () => void }) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar name={apt.patient?.full_name ?? 'Patient'} size={48} />
          <div>
            <h3 className="font-semibold text-slate-900">{apt.patient?.full_name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <CalendarClock className="h-4 w-4 text-slate-400" /> {formatDateTime(apt.scheduled_at)}
            </div>
            <p className="mt-1 text-xs text-slate-400">Requested {formatDate(apt.created_at)}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" onClick={onConfirm}><CheckCircle2 className="h-4 w-4" /> Confirm</Button>
          <Button size="sm" variant="danger" onClick={onDecline}><XCircle className="h-4 w-4" /> Decline</Button>
        </div>
      </div>
    </Card>
  );
}

function ScheduleCard({ apt, onCancel, past = false }: { apt: AppointmentRow; onCancel?: () => void; past?: boolean }) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar name={apt.patient?.full_name ?? 'Patient'} size={44} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{apt.patient?.full_name}</h3>
              <StatusBadge status={apt.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">{formatDateTime(apt.scheduled_at)}</p>
            {apt.cancellation_reason && <p className="mt-0.5 text-xs text-red-600">{apt.cancellation_reason}</p>}
          </div>
        </div>
        {onCancel && !past && (
          <Button size="sm" variant="outline" onClick={onCancel}><XCircle className="h-4 w-4" /> Cancel</Button>
        )}
      </div>
    </Card>
  );
}

function AnalyticsTab({ appointments, reviews, doctorProfile, avgRating, totalRevenue }: { appointments: AppointmentRow[]; reviews: (Review & { patient?: Profile })[]; doctorProfile: DoctorProfile; avgRating: number; totalRevenue: number }) {
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'RESCHEDULED').length;
  const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;
  const cancelRate = appointments.length ? Math.round((cancelled / appointments.length) * 100) : 0;
  const ratingDist = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { dist[r.rating - 1]++; });
    return dist.reverse();
  }, [reviews]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign className="h-5 w-5" />} accent="emerald" />
        <StatTile label="Confirmed" value={confirmed} icon={<CheckCircle2 className="h-5 w-5" />} accent="teal" />
        <StatTile label="Cancel rate" value={`${cancelRate}%`} icon={<XCircle className="h-5 w-5" />} accent="amber" />
        <StatTile label="Avg rating" value={reviews.length ? avgRating.toFixed(1) : '—'} icon={<Star className="h-5 w-5" />} accent="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-bold text-slate-900">Rating distribution</h3>
          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No reviews yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {ratingDist.map((count, i) => {
                const stars = 5 - i;
                const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="flex w-12 items-center gap-0.5 text-xs font-medium text-slate-600">{stars}<Star className="h-3 w-3 fill-amber-400 text-amber-400" /></span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-xs text-slate-500">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-900">Recent reviews</h3>
          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No reviews yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {reviews.slice(0, 4).map((r) => (
                <div key={r.id} className="border-b border-slate-100 pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <Avatar name={r.patient?.full_name ?? 'P'} size={28} />
                    <span className="text-sm font-medium text-slate-900">{r.patient?.full_name}</span>
                    <StarRating rating={r.rating} size={12} />
                  </div>
                  {r.comment && <p className="mt-1.5 text-sm text-slate-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ProfileTab({ doctorProfile, onSaved }: { doctorProfile: DoctorProfile | null; onSaved: () => void }) {
  const { profile } = useAuth();
  const isNew = !doctorProfile;
  const [specialty, setSpecialty] = useState(doctorProfile?.specialty ?? '');
  const [biography, setBiography] = useState(doctorProfile?.biography ?? '');
  const [clinicAddress, setClinicAddress] = useState(doctorProfile?.clinic_address ?? '');
  const [consultationFee, setConsultationFee] = useState(String((doctorProfile?.consultation_fee ?? 0) / 100));
  const [yearsExperience, setYearsExperience] = useState(String(doctorProfile?.years_experience ?? 0));
  const [availability, setAvailability] = useState<AvailabilityGrid>(() =>
    doctorProfile ? parseAvailability(doctorProfile.availability_grid) : DEFAULT_AVAILABILITY,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleSlot(day: string, slot: string) {
    setAvailability((prev) => ({
      ...prev,
      weekly: prev.weekly.map((w) => {
        if (w.day !== day) return w;
        const has = w.slots.includes(slot);
        return { ...w, slots: has ? w.slots.filter((s) => s !== slot) : [...w.slots, slot].sort() };
      }),
    }));
  }

  const allSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  async function save() {
    if (!profile) return;
    if (!specialty.trim()) { setError('Specialty is required'); return; }
    setSaving(true); setError(null); setSaved(false);
    const payload = {
      specialty: specialty.trim(),
      biography: biography.trim(),
      clinic_address: clinicAddress.trim(),
      consultation_fee: Math.round((parseFloat(consultationFee) || 0) * 100),
      years_experience: parseInt(yearsExperience, 10) || 0,
      availability_grid: JSON.stringify(availability),
    };
    try {
      if (isNew) {
        await api.doctorProfile.create(payload as any);
      } else {
        await api.doctorProfile.update(payload as any);
      }
      setSaved(true);
      onSaved();
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-slate-900">{isNew ? 'Create your practice profile' : 'Practice details'}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Specialty">
            <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="doc-input" />
          </FormField>
          <FormField label="Consultation fee (USD)">
            <input type="number" min="0" step="0.01" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} className="doc-input" />
          </FormField>
          <FormField label="Years of experience">
            <input type="number" min="0" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} className="doc-input" />
          </FormField>
          <FormField label="Clinic address">
            <input value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} className="doc-input" />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Biography">
            <textarea value={biography} onChange={(e) => setBiography(e.target.value)} rows={4} className="doc-input min-h-[100px] resize-y" />
          </FormField>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-900">Weekly availability</h3>
        <p className="mt-1 text-sm text-slate-500">Toggle the time slots you offer each day.</p>
        <div className="mt-4 space-y-3">
          {DAYS_OF_WEEK.map((day) => {
            const daySlots = availability.weekly.find((w) => w.day === day)?.slots ?? [];
            return (
              <div key={day} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center">
                <span className="w-28 shrink-0 text-sm font-medium text-slate-700">{day}</span>
                <div className="flex flex-wrap gap-1.5">
                  {allSlots.map((slot) => {
                    const active = daySlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleSlot(day, slot)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${active ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="flex items-center gap-3">
        <Button onClick={save} loading={saving}><Save className="h-4 w-4" /> {isNew ? 'Create profile' : 'Save changes'}</Button>
        {saved && <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Saved!</span>}
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}
