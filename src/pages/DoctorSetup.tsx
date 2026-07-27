import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Stethoscope, Clock, MapPin, DollarSign, FileText, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { DAYS_OF_WEEK, type AvailabilityGrid } from '@/lib/types';
import { Button, Card } from '@/components/ui';
import { SectionHeader } from '@/components/shared';

const SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics',
  'Neurology', 'Psychiatry', 'Ophthalmology', 'ENT',
  'Gastroenterology', 'Gynecology', 'Urology', 'General Medicine',
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

interface DaySlots {
  [day: string]: string[];
}

function emptyDaySlots(): DaySlots {
  const obj: DaySlots = {};
  DAYS_OF_WEEK.forEach((d) => { obj[d] = []; });
  return obj;
}

export function DoctorSetup() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [specialty, setSpecialty] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [fee, setFee] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [daySlots, setDaySlots] = useState<DaySlots>(emptyDaySlots);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function toggleDay(day: string) {
    setDaySlots((prev) => ({
      ...prev,
      [day]: prev[day]?.length ? [] : [...TIME_SLOTS],
    }));
  }

  function toggleSlot(day: string, slot: string) {
    setDaySlots((prev) => {
      const current = prev[day] || [];
      const next = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot].sort();
      return { ...prev, [day]: next };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!specialty) { setError('Please select a specialty'); return; }
    if (!address.trim()) { setError('Clinic address is required'); return; }

    const feeNum = parseInt(fee, 10);
    if (!fee || isNaN(feeNum) || feeNum <= 0) { setError('Enter a valid consultation fee'); return; }

    const hasAvailability = Object.values(daySlots).some((slots) => slots.length > 0);
    if (!hasAvailability) { setError('Select at least one time slot'); return; }

    const availabilityGrid: AvailabilityGrid = {
      timezone: 'local',
      weekly: DAYS_OF_WEEK.map((day) => ({ day, slots: daySlots[day] || [] })),
    };

    setSaving(true);
    try {
      await api.doctorProfile.create({
        specialty,
        years_experience: parseInt(yearsExperience, 10) || 0,
        consultation_fee: feeNum * 100,
        clinic_address: address.trim(),
        biography: bio.trim(),
        availability_grid: JSON.stringify(availabilityGrid),
      });
      await refreshProfile();
      navigate('/doctor', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <SectionHeader
          eyebrow="Welcome to MedBook"
          title="Complete Your Doctor Profile"
          description="Fill in your professional details so patients can find and book appointments with you."
          align="center"
          className="mb-10"
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="space-y-6 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-md shadow-brand-500/20">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Professional Information</h3>
                <p className="text-xs text-slate-500">Your credentials and practice details</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Specialty <span className="text-red-400">*</span>
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-800 shadow-sm backdrop-blur-sm transition-all focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">Select specialty…</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Years of Experience
                </label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min={0}
                    max={70}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm backdrop-blur-sm transition-all focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Consultation Fee (USD) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm backdrop-blur-sm transition-all focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Clinic Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Health St, Suite 100"
                    className="w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm backdrop-blur-sm transition-all focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Biography
              </label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell patients about your background, approach, and areas of focus…"
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm backdrop-blur-sm transition-all focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-6 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-md shadow-brand-500/20">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Weekly Availability</h3>
                <p className="text-xs text-slate-500">Select the days and time slots you're available</p>
              </div>
            </div>

            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:border-slate-200">
                  <button
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`mb-3 flex items-center gap-3 text-left text-sm font-medium transition-colors ${
                      (daySlots[day]?.length || 0) > 0 ? 'text-brand-700' : 'text-slate-500'
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
                        (daySlots[day]?.length || 0) > 0
                          ? 'border-brand-500 bg-brand-500'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {(daySlots[day]?.length || 0) > 0 && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {day}
                  </button>

                  {(daySlots[day]?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-2 pl-8">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleSlot(day, slot)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                            daySlots[day]?.includes(slot)
                              ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {new Date(`2000-01-01T${slot}:00`).toLocaleTimeString('en-US', {
                            hour: 'numeric', minute: '2-digit',
                          })}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              <Save className="h-4 w-4" />
              Save & Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
