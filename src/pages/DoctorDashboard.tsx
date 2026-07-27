import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, CheckCircle2, XCircle, CalendarClock, Stethoscope, Star, BarChart3,
  Loader2, Users, TrendingUp, UserCheck, Settings, Activity,
} from 'lucide-react';
import { api, type Appointment, type DoctorProfile } from '@/lib/api';
import { formatDateTime, parseAvailability, dayNameFromDate } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Avatar, StatTile, SectionHeader } from '@/components/shared';
import { Card, Button, StatusBadge, EmptyState, Spinner, Badge } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

interface AppointmentRow extends Appointment {
  patient?: { full_name: string; email: string };
}

export function DoctorDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'upcoming' | 'history'>('requests');

  async function loadAppointments() {
    if (!profile) return;
    try {
      const data = await api.appointments.list('doctor');
      setAppointments(data as AppointmentRow[]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAppointments();
  }, [profile]);

  const pending = appointments.filter((a) => a.status === 'PENDING');
  const upcoming = appointments.filter((a) => a.status !== 'CANCELLED' && new Date(a.scheduled_at) > new Date());
  const history = appointments.filter((a) => a.status === 'CANCELLED' || a.status === 'RESCHEDULED' || new Date(a.scheduled_at) <= new Date());
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED');
  const totalPatients = new Set(appointments.map((a) => a.patient_id)).size;

  async function handleConfirm(id: string) {
    try {
      await api.appointments.update(id, { status: 'CONFIRMED' } as any);
      loadAppointments();
    } catch (err: any) { alert(err.message); }
  }

  async function handleDecline(id: string) {
    const reason = window.prompt('Decline reason? (optional)');
    try {
      await api.appointments.update(id, { status: 'CANCELLED', cancellation_reason: reason ?? null } as any);
      loadAppointments();
    } catch (err: any) { alert(err.message); }
  }

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  }

  const tabs = [
    { id: 'requests' as const, label: 'Requests', count: pending.length, icon: <Clock className="h-4 w-4" /> },
    { id: 'upcoming' as const, label: 'Upcoming', count: upcoming.length, icon: <Calendar className="h-4 w-4" /> },
    { id: 'history' as const, label: 'History', count: history.length, icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/30 via-white to-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <SectionHeader
            eyebrow="Doctor Dashboard"
            title={`Welcome, Dr. ${profile?.full_name?.replace(/^Dr\.?\s+/i, '') ?? ''}`}
            description="Manage your practice, review requests, and track your performance."
          />
          <Link to="/doctors">
            <Button variant="outline" size="sm"><Stethoscope className="h-4 w-4" /> View public profile</Button>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Total Patients" value={totalPatients} icon={<Users className="h-5 w-5" />} accent="teal" />
          <StatTile label="Confirmed" value={confirmed.length} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
          <StatTile label="Pending" value={pending.length} icon={<Clock className="h-5 w-5" />} accent="amber" />
          <StatTile label="Appointments" value={appointments.length} icon={<TrendingUp className="h-5 w-5" />} accent="blue" />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-slate-200/60 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-brand-600 border-brand-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                activeTab === tab.id ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'requests' && (
            pending.length === 0 ? (
              <EmptyState
                icon={<Clock className="h-6 w-6" />}
                title="No pending requests"
                description="New appointment requests from patients will appear here."
              />
            ) : (
              <div className="space-y-4">
                {pending.map((apt) => (
                  <DoctorAppointmentCard key={apt.id} apt={apt} onConfirm={handleConfirm} onDecline={handleDecline} />
                ))}
              </div>
            )
          )}

          {activeTab === 'upcoming' && (
            upcoming.length === 0 ? (
              <EmptyState
                icon={<Calendar className="h-6 w-6" />}
                title="No upcoming appointments"
                description="Confirmed appointments will appear here."
              />
            ) : (
              <div className="space-y-4">
                {upcoming.map((apt) => (
                  <DoctorAppointmentCard key={apt.id} apt={apt} />
                ))}
              </div>
            )
          )}

          {activeTab === 'history' && (
            history.length === 0 ? (
              <EmptyState
                icon={<BarChart3 className="h-6 w-6" />}
                title="No history yet"
                description="Past and cancelled appointments will appear here."
              />
            ) : (
              <div className="space-y-4">
                {history.map((apt) => (
                  <DoctorAppointmentCard key={apt.id} apt={apt} />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorAppointmentCard({ apt, onConfirm, onDecline }: {
  apt: AppointmentRow;
  onConfirm?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  const patientName = (apt as any).patient?.full_name ?? 'Patient';
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar name={patientName} size={48} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{patientName}</h3>
              <StatusBadge status={apt.status} />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4 text-slate-400" />{formatDateTime(apt.scheduled_at)}</span>
            </div>
            {apt.cancellation_reason && <p className="mt-1 text-xs text-red-600">Reason: {apt.cancellation_reason}</p>}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {apt.status === 'PENDING' && onConfirm && onDecline && (
            <>
              <Button size="sm" variant="primary" onClick={() => onConfirm(apt.id)}>
                <CheckCircle2 className="h-4 w-4" /> Confirm
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDecline(apt.id)}>
                <XCircle className="h-4 w-4" /> Decline
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
