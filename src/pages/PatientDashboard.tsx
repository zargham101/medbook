import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Stethoscope, MapPin, CheckCircle2, XCircle, CalendarClock,
  Star, Search, Loader2, MessageSquare,
} from 'lucide-react';
import { api, type Appointment, type DoctorProfile, type Profile } from '@/lib/api';
import { formatCurrency, formatDate, formatTime, formatDateTime, parseAvailability, dayNameFromDate } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Avatar, StatTile, SectionHeader } from '@/components/shared';
import { Card, Button, StatusBadge, EmptyState, StarRating, Badge, Spinner } from '@/components/ui';

interface AppointmentRow extends Omit<Appointment, 'doctor'> {
  doctor?: Profile;
  doctor_profile?: DoctorProfile;
}

export function PatientDashboard() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<AppointmentRow | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentRow | null>(null);

  async function loadAppointments() {
    if (!profile) return;
    try {
      const data = await api.appointments.list('patient');
      setAppointments(data as AppointmentRow[]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAppointments();
  }, [profile]);

  const upcoming = appointments.filter((a) => a.status !== 'CANCELLED' && new Date(a.scheduled_at) > new Date(Date.now() - 60 * 60 * 1000));
  const past = appointments.filter((a) => a.status === 'CANCELLED' || new Date(a.scheduled_at) <= new Date(Date.now() - 60 * 60 * 1000));
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED');
  const pending = appointments.filter((a) => a.status === 'PENDING');

  async function handleCancel(id: string) {
    const reason = window.prompt('Reason for cancellation? (optional)');
    try {
      await api.appointments.update(id, { status: 'CANCELLED', cancellation_reason: reason ?? null } as any);
      loadAppointments();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Spinner className="h-7 w-7" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Patient"
          title={`Welcome back, ${profile?.full_name?.replace(/^Dr\.?\s+/i, '') ?? ''}`}
          description="Manage your appointments, reschedule visits, and share your experience."
        />

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Upcoming" value={upcoming.length} icon={<Calendar className="h-5 w-5" />} accent="teal" />
          <StatTile label="Confirmed" value={confirmed.length} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
          <StatTile label="Pending" value={pending.length} icon={<Clock className="h-5 w-5" />} accent="amber" />
          <StatTile label="Total visits" value={appointments.length} icon={<Stethoscope className="h-5 w-5" />} accent="blue" />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Upcoming appointments</h2>
          <Link to="/doctors"><Button size="sm" variant="outline"><Search className="h-4 w-4" /> Book new</Button></Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={<Calendar className="h-6 w-6" />}
              title="No upcoming appointments"
              description="Browse our directory to find a specialist and book your next visit."
              action={<Link to="/doctors"><Button>Find a doctor</Button></Link>}
            />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {upcoming.map((apt) => (
              <AppointmentCard
                key={apt.id}
                apt={apt}
                onCancel={() => handleCancel(apt.id)}
                onReschedule={() => setRescheduleTarget(apt)}
                onReview={() => setReviewTarget(apt)}
              />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mt-10 text-xl font-bold text-slate-900">History</h2>
            <div className="mt-4 space-y-4">
              {past.map((apt) => (
                <AppointmentCard key={apt.id} apt={apt} past onReview={() => setReviewTarget(apt)} />
              ))}
            </div>
          </>
        )}
      </div>

      {reviewTarget && (
        <ReviewModal
          appointment={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmitted={() => { setReviewTarget(null); loadAppointments(); }}
        />
      )}
      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onDone={() => { setRescheduleTarget(null); loadAppointments(); }}
        />
      )}
    </div>
  );
}

function AppointmentCard({
  apt, onCancel, onReschedule, onReview, past = false,
}: {
  apt: AppointmentRow;
  onCancel?: () => void;
  onReschedule?: () => void;
  onReview?: () => void;
  past?: boolean;
}) {
  const doctor = apt.doctor;
  const docProfile = apt.doctor_profile;
  const docName = doctor?.full_name ?? 'Doctor';
  const isCompleted = past && apt.status === 'CONFIRMED' && new Date(apt.scheduled_at) < new Date();

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar name={docName} size={52} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{docName}</h3>
              <StatusBadge status={apt.status} />
            </div>
            <p className="text-sm text-slate-500">{docProfile?.specialty}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4 text-slate-400" />{formatDateTime(apt.scheduled_at)}</span>
              {docProfile?.clinic_address && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" />{docProfile.clinic_address.split(',')[0]}</span>}
            </div>
            {apt.cancellation_reason && <p className="mt-1 text-xs text-red-600">Cancelled: {apt.cancellation_reason}</p>}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {!past && apt.status !== 'CANCELLED' && (
            <>
              <Button size="sm" variant="outline" onClick={onReschedule}><CalendarClock className="h-4 w-4" /> Reschedule</Button>
              <Button size="sm" variant="danger" onClick={onCancel}><XCircle className="h-4 w-4" /> Cancel</Button>
            </>
          )}
          {isCompleted && (
            <Button size="sm" onClick={onReview}><Star className="h-4 w-4" /> Leave a review</Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function ReviewModal({ appointment, onClose, onSubmitted }: { appointment: AppointmentRow; onClose: () => void; onSubmitted: () => void }) {
  const { profile } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!profile) return;
    setLoading(true);
    setError(null);
    try {
      await api.reviews.create({
        appointment_id: appointment.id,
        doctor_id: appointment.doctor_id,
        rating,
        comment: comment || undefined,
      });
      onSubmitted();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <Modal title="Leave a review" onClose={onClose}>
      {error && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <p className="text-sm text-slate-600">How was your visit with {appointment.doctor?.full_name}?</p>
      <div className="mt-4 flex justify-center"><StarRating rating={rating} size={36} interactive onChange={setRating} /></div>
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Your feedback (optional)</label>
        <textarea
          value={comment} onChange={(e) => setComment(e.target.value)} rows={4}
          placeholder="Share details about your experience..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={submit} loading={loading}>Submit review</Button>
      </div>
    </Modal>
  );
}

function RescheduleModal({ appointment, onClose, onDone }: { appointment: AppointmentRow; onClose: () => void; onDone: () => void }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  const availability = appointment.doctor_profile ? parseAvailability(appointment.doctor_profile.availability_grid) : null;

  const weekDays = (() => {
    const base = new Date(); base.setHours(0, 0, 0, 0);
    const monday = new Date(base);
    const day = base.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(base.getDate() + diff + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  })();

  const slots = selectedDate && availability ? (availability.weekly.find((w) => w.day === dayNameFromDate(selectedDate))?.slots ?? []) : [];

  async function submit() {
    if (!selectedDate || !selectedSlot || !profile) return;
    setLoading(true); setError(null);
    const [h, m] = selectedSlot.split(':').map(Number);
    const scheduled = new Date(selectedDate); scheduled.setHours(h, m, 0, 0);
    try {
      await api.appointments.update(appointment.id, { scheduled_at: scheduled.toISOString(), status: 'RESCHEDULED' } as any);
      onDone();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <Modal title="Reschedule appointment" onClose={onClose}>
      {error && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <div className="flex items-center justify-between">
        <button onClick={() => setWeekOffset((w) => w - 1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">‹</button>
        <span className="text-sm font-semibold text-slate-900">{weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <button onClick={() => setWeekOffset((w) => w + 1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">›</button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {weekDays.map((d) => {
          const hasSlots = availability?.weekly.find((w) => w.day === dayNameFromDate(d))?.slots.length ?? 0;
          const isPast = d < new Date(new Date().setHours(0, 0, 0, 0));
          const disabled = hasSlots === 0 || isPast;
          const isSelected = selectedDate?.toDateString() === d.toDateString();
          return (
            <button key={d.toISOString()} disabled={disabled} onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
              className={`flex flex-col items-center rounded-lg border py-2 text-xs transition-all ${isSelected ? 'border-teal-600 bg-teal-600 text-white' : disabled ? 'border-slate-200 bg-slate-50 text-slate-300' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50'}`}>
              <span className="font-medium uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="text-sm font-bold">{d.getDate()}</span>
            </button>
          );
        })}
      </div>
      {selectedDate && slots.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700">{slots.length} times available</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {slots.map((s) => (
              <button key={s} onClick={() => setSelectedSlot(s)} className={`rounded-lg border py-2 text-sm font-medium transition-all ${selectedSlot === s ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50'}`}>{s}</button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={submit} disabled={!selectedSlot || loading} loading={loading}>Confirm reschedule</Button>
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <div className="mt-4">{children}</div>
      </Card>
    </div>
  );
}
