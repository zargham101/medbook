import { useEffect, useState, useMemo, type ReactNode } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Clock, DollarSign, Award, Calendar, CheckCircle2,
  ChevronLeft, ChevronRight, Loader2, MessageSquare,
} from 'lucide-react';
import { api, type DoctorProfile, type Profile, type Review, type Appointment } from '@/lib/api';
import {
  parseAvailability, dayNameFromDate, formatCurrency, formatDate, formatTime, formatDateTime,
} from '@/lib/types';
import { Avatar } from '@/components/shared';
import { Card, Badge, Button, StarRating, StatusBadge, EmptyState, Spinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

interface DoctorRow extends DoctorProfile {
  profiles?: Profile;
}

const SLOT_DURATION_MINUTES = 30;

export function DoctorProfilePage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { session, profile } = useAuth();

  const [doctor, setDoctor] = useState<DoctorRow | null>(null);
  const [reviews, setReviews] = useState<(Review & { patient?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;
    async function load() {
      try {
        const data = await api.doctors.get(doctorId as string);
        const { reviews: revs, ...docData } = data;
        setDoctor(docData as DoctorRow);
        setReviews(revs as (Review & { patient?: Profile })[]);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [doctorId]);

  const availability = useMemo(
    () => (doctor ? parseAvailability(doctor.availability_grid) : null),
    [doctor],
  );

  const weekDays = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const monday = new Date(base);
    const day = base.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(base.getDate() + diff + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  const slotsForDate = useMemo(() => {
    if (!selectedDate || !availability) return [];
    const dayName = dayNameFromDate(selectedDate);
    const dayConfig = availability.weekly.find((w) => w.day === dayName);
    return dayConfig?.slots ?? [];
  }, [selectedDate, availability]);

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  async function handleBook() {
    if (!selectedDate || !selectedSlot || !doctorId) return;
    if (!session || profile?.role !== 'PATIENT') {
      navigate('/login', { state: { from: `/doctors/${doctorId}` } });
      return;
    }
    setBooking(true);
    setError(null);
    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const scheduled = new Date(selectedDate);
    scheduled.setHours(hours, minutes, 0, 0);
    try {
      const data = await api.appointments.create({
        doctor_id: doctorId,
        scheduled_at: scheduled.toISOString(),
      });
      setBookedAppointment(data);
    } catch (err: any) {
      setError(err.message);
    }
    setBooking(false);
    setSelectedSlot(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="Doctor not found"
          description="This provider profile may have been removed."
          action={<Link to="/doctors"><Button>Browse all doctors</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/doctors" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back to all doctors
        </Link>

        <Card className="mt-4 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-teal-500 to-teal-700" />
          <div className="px-6 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar name={doctor.profiles?.full_name ?? 'Doctor'} size={96} className="ring-4 ring-white" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{doctor.profiles?.full_name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="teal">{doctor.specialty}</Badge>
                  <span className="flex items-center gap-1 text-sm text-slate-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {reviews.length > 0 ? `${avgRating.toFixed(1)} (${reviews.length} review${reviews.length !== 1 ? 's' : ''})` : 'No reviews yet'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoTile icon={<Award className="h-4 w-4" />} label="Experience" value={`${doctor.years_experience} years`} />
              <InfoTile icon={<DollarSign className="h-4 w-4" />} label="Consultation" value={formatCurrency(doctor.consultation_fee)} />
              <InfoTile icon={<MapPin className="h-4 w-4" />} label="Location" value={doctor.clinic_address} />
              <InfoTile icon={<Clock className="h-4 w-4" />} label="Visits" value={`${reviews.length} review${reviews.length !== 1 ? 's' : ''}`} />
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-slate-900">About</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{doctor.biography}</p>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card className="p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900">Book an appointment</h2>
              <p className="mt-1 text-sm text-slate-500">Select a date and available time slot below.</p>

              {bookedAppointment ? (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">Request sent!</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Your appointment for <span className="font-medium">{formatDateTime(bookedAppointment.scheduled_at)}</span> is pending confirmation.
                  </p>
                  <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
                    <Link to="/patient"><Button size="sm">View my appointments</Button></Link>
                    <Button variant="outline" size="sm" onClick={() => setBookedAppointment(null)}>Book another</Button>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-200">
                      {error}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => setWeekOffset((w) => w - 1)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Previous week"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-semibold text-slate-900">
                      {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {weekOffset === 0 ? ' (this week)' : weekOffset > 0 ? ` (${weekOffset} week${weekOffset > 1 ? 's' : ''} ahead)` : ''}
                    </span>
                    <button
                      onClick={() => setWeekOffset((w) => w + 1)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Next week"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-7 gap-2">
                    {weekDays.map((d) => {
                      const dayName = dayNameFromDate(d);
                      const hasSlots = availability?.weekly.find((w) => w.day === dayName)?.slots.length ?? 0;
                      const isPast = d < new Date(new Date().setHours(0, 0, 0, 0));
                      const isSelected = selectedDate?.toDateString() === d.toDateString();
                      const disabled = hasSlots === 0 || isPast;
                      return (
                        <button
                          key={d.toISOString()}
                          disabled={disabled}
                          onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                          className={`flex flex-col items-center rounded-xl border py-2.5 text-xs transition-all ${
                            isSelected
                              ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                              : disabled
                                ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50'
                          }`}
                        >
                          <span className="font-medium uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="mt-0.5 text-base font-bold">{d.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedDate ? (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-slate-700">
                        Available times for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                      {slotsForDate.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-400">No openings this day. Try another date.</p>
                      ) : (
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {slotsForDate.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`rounded-lg border py-2.5 text-sm font-medium transition-all ${
                                selectedSlot === slot
                                  ? 'border-teal-600 bg-teal-600 text-white'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50'
                              }`}
                            >
                              {formatTime(`${selectedDate.toDateString()} ${slot}`)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                      Select a date to see available times.
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div className="text-sm">
                      {selectedSlot && selectedDate ? (
                        <span className="text-slate-600">Selected: <span className="font-semibold text-slate-900">{formatDateTime(`${selectedDate.toDateString()} ${selectedSlot}`)}</span></span>
                      ) : (
                        <span className="text-slate-400">Choose a date and time</span>
                      )}
                    </div>
                    <Button onClick={handleBook} disabled={!selectedSlot || booking} loading={booking}>
                      {session && profile?.role === 'PATIENT' ? 'Request appointment' : session ? 'Sign in as patient' : 'Sign in to book'}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Patient reviews</h2>
                {reviews.length > 0 && (
                  <span className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {avgRating.toFixed(1)}
                  </span>
                )}
              </div>
              {reviews.length === 0 ? (
                <div className="mt-6 flex flex-col items-center py-8 text-center">
                  <MessageSquare className="h-8 w-8 text-slate-300" />
                  <p className="mt-3 text-sm text-slate-500">No reviews yet. Be the first to leave one after your visit!</p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.slice(0, 8).map((r) => (
                    <div key={r.id} className="border-b border-slate-100 pb-4 last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.patient?.full_name ?? 'Patient'} size={36} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{r.patient?.full_name ?? 'Anonymous'}</p>
                          <StarRating rating={r.rating} size={12} />
                        </div>
                        <span className="text-xs text-slate-400">{formatDate(r.created_at)}</span>
                      </div>
                      {r.comment && <p className="mt-2 text-sm text-slate-600">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
