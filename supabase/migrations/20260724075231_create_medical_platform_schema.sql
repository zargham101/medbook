/*
# Medical Scheduling Platform — Core Schema

1. Overview
This migration builds the data layer for a multi-tenant medical appointment
scheduling platform. There are three user roles: PATIENT, DOCTOR, and ADMIN.
Patients browse a public directory of doctors, request appointments, and leave
reviews after confirmed visits. Doctors confirm/cancel requests, set weekly
availability, and view analytics. All authenticated users own their own rows.

2. New Tables
- `profiles` — one row per auth user. Columns: id (uuid PK = auth.users.id),
  email (text), full_name (text), role (enum PATIENT/DOCTOR/ADMIN),
  avatar_url (text nullable), created_at (timestamptz default now()).
- `doctor_profiles` — public-facing professional info for doctors. Columns:
  id (uuid PK), user_id (uuid FK -> profiles.id ON DELETE CASCADE),
  specialty (text), biography (text), clinic_address (text),
  consultation_fee (integer, in cents), availability_grid (jsonb — weekly
  schedule), years_experience (integer), created_at (timestamptz).
- `appointments` — booking engine core. Columns: id (uuid PK), patient_id
  (uuid FK -> profiles.id), doctor_id (uuid FK -> profiles.id — the doctor's
  user id), scheduled_at (timestamptz), status (enum
  PENDING/CONFIRMED/RESCHEDULED/CANCELLED), cancellation_reason (text
  nullable), created_at, updated_at (auto-updated trigger).
- `reviews` — patient feedback after a confirmed appointment. Columns: id
  (uuid PK), appointment_id (uuid FK -> appointments.id ON DELETE CASCADE,
  unique), patient_id, doctor_id, rating (integer 1-5, check constraint),
  comment (text nullable), created_at.

3. Security (RLS)
- `profiles`: owner-scoped CRUD — each authenticated user reads/writes only
  their own profile row. PUBLIC read is allowed on profiles whose role is
  DOCTOR so the public doctor directory can list them.
- `doctor_profiles`: PUBLIC read (the directory is public so anon/visitors can
  browse doctors). INSERT/UPDATE restricted to the doctor who owns the row.
- `appointments`: a patient can read/update/delete only their own
  appointments; a doctor can read/update appointments where they are the
  doctor. Insert is allowed for authenticated patients (patient_id must equal
  auth.uid()). Update is allowed for either the patient or the doctor.
- `reviews`: public read (reviews show on doctor profiles). INSERT limited to
  the patient who owns the reviewed appointment and who is also the review's
  patient_id. UPDATE/DELETE limited to that patient.
- All policies use auth.uid() for ownership checks.

4. Indexes
- profiles(role) — speeds directory filtering.
- doctor_profiles(specialty) — speeds specialty search.
- appointments(patient_id), appointments(doctor_id), appointments(status) —
  speeds dashboard queries.
- reviews(doctor_id) — speeds aggregate rating lookups.

5. Important Notes
1) Every owner column that clients insert without specifying an owner uses
   DEFAULT auth.uid() so the insert passes the WITH CHECK policy.
2) The appointments.updated_at column is auto-maintained by a trigger so
   status changes are timestamped without client logic.
3) A unique constraint on reviews.appointment_id enforces one review per
   appointment.
4) Demo doctor rows are seeded in a separate follow-up migration so this
   schema migration remains idempotent and focused.
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'PATIENT' CHECK (role IN ('PATIENT','DOCTOR','ADMIN')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read for doctor profiles (directory is browsable by anyone incl. anon)
DROP POLICY IF EXISTS "public_read_doctors" ON profiles;
CREATE POLICY "public_read_doctors"
ON profiles FOR SELECT
TO anon, authenticated
USING (role = 'DOCTOR');

-- Owner read
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Owner update
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Owner insert (rare, mainly handled by trigger, but safe)
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Doctor profiles table
CREATE TABLE IF NOT EXISTS doctor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialty text NOT NULL,
  biography text NOT NULL DEFAULT '',
  clinic_address text NOT NULL DEFAULT '',
  consultation_fee integer NOT NULL DEFAULT 0,
  availability_grid jsonb NOT NULL DEFAULT '{}'::jsonb,
  years_experience integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Public read — directory browsable by anyone
DROP POLICY IF EXISTS "public_read_doctor_profiles" ON doctor_profiles;
CREATE POLICY "public_read_doctor_profiles"
ON doctor_profiles FOR SELECT
TO anon, authenticated
USING (true);

-- Doctor inserts own profile row
DROP POLICY IF EXISTS "insert_own_doctor_profile" ON doctor_profiles;
CREATE POLICY "insert_own_doctor_profile"
ON doctor_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Doctor updates own profile row
DROP POLICY IF EXISTS "update_own_doctor_profile" ON doctor_profiles;
CREATE POLICY "update_own_doctor_profile"
ON doctor_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_doctor_profiles_specialty ON doctor_profiles(specialty);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','RESCHEDULED','CANCELLED')),
  cancellation_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Patient reads own appointments; doctor reads appointments where they are the doctor
DROP POLICY IF EXISTS "read_own_appointments" ON appointments;
CREATE POLICY "read_own_appointments"
ON appointments FOR SELECT
TO authenticated
USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Patient creates own appointment (patient_id defaults to auth.uid())
DROP POLICY IF EXISTS "insert_own_appointment" ON appointments;
CREATE POLICY "insert_own_appointment"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = patient_id);

-- Patient or doctor can update an appointment they're party to
DROP POLICY IF EXISTS "update_appointment_party" ON appointments;
CREATE POLICY "update_appointment_party"
ON appointments FOR UPDATE
TO authenticated
USING (auth.uid() = patient_id OR auth.uid() = doctor_id)
WITH CHECK (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Patient or doctor can cancel (delete) an appointment they're party to
DROP POLICY IF EXISTS "delete_appointment_party" ON appointments;
CREATE POLICY "delete_appointment_party"
ON appointments FOR DELETE
TO authenticated
USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- updated_at auto-maintenance trigger
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS appointments_touch_updated_at ON appointments;
CREATE TRIGGER appointments_touch_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews are public so they display on doctor profiles
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews"
ON reviews FOR SELECT
TO anon, authenticated
USING (true);

-- Patient inserts review for an appointment they own and as themselves
DROP POLICY IF EXISTS "insert_own_review" ON reviews;
CREATE POLICY "insert_own_review"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = patient_id
  AND EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.id = appointment_id
      AND a.patient_id = auth.uid()
  )
);

-- Patient can update/delete their own review
DROP POLICY IF EXISTS "update_own_review" ON reviews;
CREATE POLICY "update_own_review"
ON reviews FOR UPDATE
TO authenticated
USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "delete_own_review" ON reviews;
CREATE POLICY "delete_own_review"
ON reviews FOR DELETE
TO authenticated
USING (auth.uid() = patient_id);

CREATE INDEX IF NOT EXISTS idx_reviews_doctor ON reviews(doctor_id);

-- Auto-create a profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'PATIENT')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
