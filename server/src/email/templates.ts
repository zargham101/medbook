export interface EmailData {
  to_name: string; doctor_name: string; patient_name: string;
  date_time: string; clinic?: string; specialty?: string;
  cancellation_reason?: string; old_date_time?: string;
}

export function emailLayout(title: string, body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0;background:#f5f5f5;color:#333}
.container{max-width:560px;margin:0 auto;padding:24px}
.header{background:#2563eb;color:#fff;padding:24px 32px;border-radius:12px 12px 0 0}
.header h1{margin:0;font-size:22px;font-weight:600}
.body{background:#fff;padding:32px;border-radius:0 0 12px 12px;line-height:1.6}
.footer{text-align:center;padding:16px;color:#888;font-size:13px}
.detail{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0}
.detail dt{font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-top:12px}
.detail dt:first-child{margin-top:0}
.detail dd{margin:4px 0 0;font-size:16px;font-weight:500;color:#1e293b}
.badge{display:inline-block;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:500}
.badge-pending{background:#fef3c7;color:#92400e}
.badge-confirmed{background:#dbeafe;color:#1e40af}
.badge-cancelled{background:#fee2e2;color:#991b1b}
</style></head><body><div class="container"><div class="header"><h1>${title}</h1></div><div class="body">${body}<div class="footer"><p>MedBook &mdash; Doctor Appointment Scheduling</p></div></div></div></body></html>`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function bookingPatientEmail(d: EmailData) { return { subject: 'Appointment Confirmed - MedBook', html: emailLayout('Appointment Booked', `<p>Hi ${d.to_name},</p><p>Your appointment has been successfully booked.</p><dl class="detail"><dt>Doctor</dt><dd>${d.doctor_name}${d.specialty ? ` (${d.specialty})` : ''}</dd><dt>Date &amp; Time</dt><dd>${d.date_time}</dd>${d.clinic ? `<dt>Location</dt><dd>${d.clinic}</dd>` : ''}<dt>Status</dt><dd><span class="badge badge-pending">Pending</span></dd></dl><p>You can manage this appointment from your dashboard. A reminder will be sent before the appointment.</p>`), }; }

export function bookingDoctorEmail(d: EmailData) { return { subject: 'New Appointment - MedBook', html: emailLayout('New Appointment', `<p>Hi ${d.to_name},</p><p>You have a new appointment scheduled.</p><dl class="detail"><dt>Patient</dt><dd>${d.patient_name}</dd><dt>Date &amp; Time</dt><dd>${d.date_time}</dd><dt>Status</dt><dd><span class="badge badge-pending">Pending</span></dd></dl><p>Please confirm or reschedule the appointment from your dashboard.</p>`), }; }

export function reschedulePatientEmail(d: EmailData) { return { subject: 'Appointment Rescheduled - MedBook', html: emailLayout('Appointment Rescheduled', `<p>Hi ${d.to_name},</p><p>Your appointment has been rescheduled.</p><dl class="detail"><dt>Doctor</dt><dd>${d.doctor_name}</dd>${d.old_date_time ? `<dt>Previous Time</dt><dd>${d.old_date_time}</dd>` : ''}<dt>New Date &amp; Time</dt><dd>${d.date_time}</dd>${d.clinic ? `<dt>Location</dt><dd>${d.clinic}</dd>` : ''}<dt>Status</dt><dd><span class="badge badge-pending">Pending</span></dd></dl><p>Please review the updated time from your dashboard.</p>`), }; }

export function rescheduleDoctorEmail(d: EmailData) { return { subject: 'Appointment Rescheduled - MedBook', html: emailLayout('Appointment Rescheduled', `<p>Hi ${d.to_name},</p><p>An appointment has been rescheduled.</p><dl class="detail"><dt>Patient</dt><dd>${d.patient_name}</dd>${d.old_date_time ? `<dt>Previous Time</dt><dd>${d.old_date_time}</dd>` : ''}<dt>New Date &amp; Time</dt><dd>${d.date_time}</dd><dt>Status</dt><dd><span class="badge badge-pending">Pending</span></dd></dl><p>Please confirm the new time from your dashboard.</p>`), }; }

export function cancellationPatientEmail(d: EmailData) { return { subject: 'Appointment Cancelled - MedBook', html: emailLayout('Appointment Cancelled', `<p>Hi ${d.to_name},</p><p>Your appointment has been cancelled.</p><dl class="detail"><dt>Doctor</dt><dd>${d.doctor_name}</dd><dt>Original Date &amp; Time</dt><dd>${d.date_time}</dd><dt>Status</dt><dd><span class="badge badge-cancelled">Cancelled</span></dd>${d.cancellation_reason ? `<dt>Reason</dt><dd>${d.cancellation_reason}</dd>` : ''}</dl><p>You can book a new appointment at any time from the doctors directory.</p>`), }; }

export function cancellationDoctorEmail(d: EmailData) { return { subject: 'Appointment Cancelled - MedBook', html: emailLayout('Appointment Cancelled', `<p>Hi ${d.to_name},</p><p>An appointment has been cancelled.</p><dl class="detail"><dt>Patient</dt><dd>${d.patient_name}</dd><dt>Original Date &amp; Time</dt><dd>${d.date_time}</dd><dt>Status</dt><dd><span class="badge badge-cancelled">Cancelled</span></dd>${d.cancellation_reason ? `<dt>Reason</dt><dd>${d.cancellation_reason}</dd>` : ''}</dl><p>The time slot is now available for other patients.</p>`), }; }

export function reminderPatientEmail(d: EmailData) { return { subject: '⏰ Appointment Reminder - MedBook', html: emailLayout('Appointment Reminder', `<p>Hi ${d.to_name},</p><p>This is a reminder that you have an appointment <strong>in about 1 hour</strong>.</p><dl class="detail"><dt>Doctor</dt><dd>${d.doctor_name}${d.specialty ? ` (${d.specialty})` : ''}</dd><dt>Date &amp; Time</dt><dd>${d.date_time}</dd>${d.clinic ? `<dt>Location</dt><dd>${d.clinic}</dd>` : ''}</dl><p>Please arrive on time. You can reschedule from your dashboard if needed.</p>`), }; }

export function reminderDoctorEmail(d: EmailData) { return { subject: '⏰ Appointment Reminder - MedBook', html: emailLayout('Appointment Reminder', `<p>Hi ${d.to_name},</p><p>This is a reminder that you have an appointment <strong>in about 1 hour</strong>.</p><dl class="detail"><dt>Patient</dt><dd>${d.patient_name}</dd><dt>Date &amp; Time</dt><dd>${d.date_time}</dd></dl><p>Please ensure you are prepared for the appointment.</p>`), }; }
