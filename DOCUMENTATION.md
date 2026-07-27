# MedBook - Development Guide

## Overview

MedBook is a doctor appointment scheduling platform. Patients browse a public directory of doctors, view profiles with availability, book appointments, and leave reviews. Doctors manage their schedules, confirm or decline appointment requests, and track their performance. The platform sends notification emails for key events and runs automated appointment reminders.

---

## Functional Requirements

### Authentication & User Management

- Users must be able to sign up with email, password, full name, and role (PATIENT or DOCTOR).
- Users must be able to sign in with email and password.
- Sessions are maintained via JWT tokens stored in localStorage.
- The system must distinguish between PATIENT and DOCTOR roles and enforce role-based access:
  - Patients can access `/patient` dashboard.
  - Doctors can access `/doctor` dashboard and `/doctor/setup`.
  - Unauthenticated users can browse public pages only.
- Doctor signup must redirect to a profile setup page where the doctor fills in specialty, biography, clinic address, consultation fee, years of experience, and weekly availability.
- Doctors without a completed profile must not appear in the public directory and must be blocked from the doctor dashboard until setup is complete.

### Public Pages

- Landing page with hero section, how-it-works steps, feature highlights, testimonials, and call-to-action sections.
- About Us page with company mission, stats, value cards, team members, and CTA.
- Contact Us page with contact information cards, a message form, and an FAQ accordion.
- Blog page with a featured article, an article grid with category badges and author info, and a newsletter signup section.

### Doctor Directory

- Publicly browsable list of all doctors who have completed their profile.
- Each doctor card must display: full name, specialty, years of experience, consultation fee, average rating, review count, and clinic address.
- Search by doctor name and filter by specialty.
- Clicking a doctor navigates to their profile page.

### Doctor Profile & Booking

- Public doctor detail page showing:
  - Gradient banner with doctor name, specialty, and rating.
  - Profile photo, biography, clinic address, consultation fee, years of experience.
  - A weekly calendar showing available days and time slots.
- Patients must be able to select a date, view available slots, and book an appointment.
- Booking requires the patient to be logged in.
- After booking, the appointment appears as pending in both the patient's and doctor's dashboards.

### Patient Dashboard

- Logged-in patients see a dashboard with:
  - Stats tiles: total appointments, upcoming, completed, cancelled.
  - List of upcoming appointments with doctor name, date, time, and status.
  - Ability to cancel or reschedule appointments.
  - Ability to leave a review for completed appointments (star rating + optional comment).
- Statuses: PENDING, CONFIRMED, RESCHEDULED, CANCELLED.

### Doctor Dashboard

- Logged-in doctors see a dashboard with:
  - Stats tiles: total patients, confirmed appointments, pending requests, total appointments.
  - Tabbed interface: Requests (pending appointments with confirm/decline actions), Upcoming (confirmed future appointments), History (past and cancelled appointments).
  - Each appointment shows patient name, date, time, status, and optional cancellation reason.
  - Confirm action changes status to CONFIRMED. Decline action changes status to CANCELLED with an optional reason.

### Reviews

- Patients can leave reviews on completed appointments.
- Reviews consist of a 1-5 star rating and an optional text comment.
- Reviews are displayed on the doctor's public profile page.
- Average rating and review count are shown on doctor directory cards.

---

## Email Notification System

### Trigger Events

The system sends email notifications for the following events:

- Patient books a new appointment -> confirmation to patient, notification to doctor.
- Doctor confirms an appointment -> notification to patient.
- Doctor declines an appointment -> notification to patient with optional reason.
- Patient cancels an appointment -> cancellation notice to patient, notification to doctor.
- Patient reschedules an appointment -> updated details to both parties.
- Automated reminder 1 hour before appointment -> reminder to both patient and doctor.

### Email Templates

Each trigger event has a dedicated HTML email template. Templates include the MedBook brand styling and contain relevant appointment details such as doctor name, patient name, date, time, clinic address, and specialty. The reschedule and cancellation templates also include the old date/time and the reason if provided.

### Reminder Idempotency

The cron job that sends reminders must track which appointments have already received a reminder. Each appointment has a `reminder_sent` boolean flag and a `reminded_at` timestamp. Once a reminder is sent, the appointment is marked as reminded and will not receive a duplicate reminder in subsequent runs.

### Test Mode

The system supports a TEST_EMAIL_OVERRIDE environment variable. When set, all outgoing emails are redirected to the specified email address instead of the intended recipient. This allows testing the full email flow without sending emails to real users.

---

## Automated Cron Job

### Purpose

A daily cron job runs once per day at 9:00 AM UTC to send appointment reminders for upcoming appointments.

### Behavior

- The cron job examines the appointments table for any appointment scheduled approximately 1 hour in the future.
- It only considers appointments with status PENDING or CONFIRMED.
- It only considers appointments that have NOT already received a reminder (reminder_sent is false or null).
- For each qualifying appointment, it sends a reminder email to both the patient and the doctor.
- After sending, it marks the appointment as reminded so it is not picked up again.

### Schedule Limitation

On the Vercel Hobby plan, cron jobs can only run once per day. The schedule is set to 0 9 * * * (daily at 9:00 AM UTC). This means that appointments falling outside the 1-hour window at 9:00 AM will not receive automated reminders on the Hobby plan. Upgrading to a Pro plan allows more frequent cron schedules (`*/15 * * * *` or similar) to cover all appointment times throughout the day.

### Authentication

The cron endpoint is protected by a CRON_SECRET environment variable. Only requests bearing the correct Bearer token in the Authorization header can trigger the cron job. This prevents unauthorized invocation of the endpoint.

### Idempotency

Multiple invocations of the cron job within the same time window are safe: the `reminder_sent` flag prevents duplicate reminders. If the cron job runs again, appointments that already received a reminder are skipped.

---

## Database Requirements

### Tables

The system requires the following database tables:

- **profiles** - Stores user accounts (id, email, password_hash, full_name, role, avatar_url, timestamps). Role is either PATIENT or DOCTOR.
- **doctor_profiles** - Stores professional details for doctors (user_id FK to profiles, specialty, biography, clinic_address, consultation_fee, years_experience, availability_grid as JSONB, timestamps). One row per doctor. Availability grid defines weekly time slots per day.
- **appointments** - Stores bookings (patient_id FK, doctor_id FK, scheduled_at timestamp, status, cancellation_reason, reminder_sent boolean, reminded_at timestamp, timestamps). Statuses: PENDING, CONFIRMED, RESCHEDULED, CANCELLED.
- **reviews** - Stores patient reviews (appointment_id FK, patient_id FK, doctor_id FK, rating 1-5, comment, timestamps).

### Indexes

Indexes should be created on frequently queried columns: doctor_profiles.specialty, doctor_profiles.user_id, appointments.patient_id, appointments.doctor_id, appointments.status, reviews.doctor_id.

### Row-Level Security

If using a managed PostgreSQL service with RLS support (such as Supabase):
- Profiles table: public read for doctor profiles, owner-only write.
- Doctor Profiles table: public read, doctor-only insert/update.
- Appointments table: patient and doctor can read/update appointments they are party to.
- Reviews table: public read, patient-only insert for their own appointments.
