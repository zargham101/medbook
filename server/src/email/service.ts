import { emailLayout, bookingPatientEmail, bookingDoctorEmail, reschedulePatientEmail, rescheduleDoctorEmail, cancellationPatientEmail, cancellationDoctorEmail, reminderPatientEmail, reminderDoctorEmail, formatDateTime } from './templates';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'MedBook <notifications@medbook.dev>';

export async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) { console.warn(`RESEND_API_KEY not set, skipping "${subject}" -> ${to}`); return; }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) console.error('Email failed:', res.status, await res.text());
}

export interface EmailData {
  to_name: string; doctor_name: string; patient_name: string;
  date_time: string; clinic?: string; specialty?: string;
  cancellation_reason?: string; old_date_time?: string;
}

export async function sendAppointmentNotification(type: 'booked' | 'rescheduled' | 'cancelled', apt: any, oldScheduledAt?: string) {
  const { query } = await import('../db');
  const [patientResult, doctorResult, doctorProfileResult] = await Promise.all([
    query('SELECT email, full_name FROM profiles WHERE id = $1', [apt.patient_id]),
    query('SELECT email, full_name FROM profiles WHERE id = $1', [apt.doctor_id]),
    query('SELECT specialty, clinic_address FROM doctor_profiles WHERE user_id = $1', [apt.doctor_id]),
  ]);
  const patient = patientResult.rows[0];
  const doctor = doctorResult.rows[0];
  const profile = doctorProfileResult.rows[0];

  const d: EmailData = {
    to_name: patient.full_name, doctor_name: doctor.full_name,
    patient_name: patient.full_name, date_time: formatDateTime(apt.scheduled_at),
    clinic: profile?.clinic_address, specialty: profile?.specialty,
    cancellation_reason: apt.cancellation_reason,
    old_date_time: oldScheduledAt ? formatDateTime(oldScheduledAt) : undefined,
  };

  if (type === 'booked') {
    const { subject: ps, html: ph } = bookingPatientEmail({ ...d, to_name: patient.full_name });
    const { subject: ds, html: dh } = bookingDoctorEmail({ ...d, to_name: doctor.full_name, patient_name: patient.full_name });
    await Promise.all([sendEmail(patient.email, ps, ph), sendEmail(doctor.email, ds, dh)]);
  } else if (type === 'rescheduled') {
    const { subject: ps, html: ph } = reschedulePatientEmail({ ...d, to_name: patient.full_name });
    const { subject: ds, html: dh } = rescheduleDoctorEmail({ ...d, to_name: doctor.full_name, patient_name: patient.full_name });
    await Promise.all([sendEmail(patient.email, ps, ph), sendEmail(doctor.email, ds, dh)]);
  } else if (type === 'cancelled') {
    const { subject: ps, html: ph } = cancellationPatientEmail({ ...d, to_name: patient.full_name });
    const { subject: ds, html: dh } = cancellationDoctorEmail({ ...d, to_name: doctor.full_name, patient_name: patient.full_name });
    await Promise.all([sendEmail(patient.email, ps, ph), sendEmail(doctor.email, ds, dh)]);
  }
}
