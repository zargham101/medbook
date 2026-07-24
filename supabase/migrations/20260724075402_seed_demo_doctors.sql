/*
# Seed Demo Doctors for Public Directory

1. Purpose
Populates the platform with six demo doctor accounts so the public provider
directory is populated and browsable immediately. Without these, a brand-new
visitor sees an empty directory.

2. What this creates
Six auth.users accounts (emails demo+doctorN@medbook.dev) with DOCTOR role
metadata, which auto-creates matching profile rows via the
on_auth_user_created trigger. A follow-up insert adds their professional
doctor_profiles rows (specialty, bio, fee, availability, experience).

3. Idempotency
Each insert is guarded by "IF NOT EXISTS" checks on the email, so re-running
this migration is safe and will not create duplicates.

4. Security notes
- Passwords are hashed with pgcrypto crypt() (bcrypt-style) so the accounts
  are real, sign-in-able auth accounts, not soft-deleted shells.
- These are demo accounts only. They all share a known demo password.
- No RLS changes here.
*/

-- Ensure pgcrypto is available for crypt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  demo_password text;
BEGIN
  -- bcrypt-style hash of the shared demo password "demoPassword123"
  demo_password := crypt('demoPassword123', gen_salt('bf'));

  -- Dr. Sarah Chen — Cardiology
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo+chen@medbook.dev') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'demo+chen@medbook.dev', demo_password, now(), now(), now(),
      '{}'::jsonb, '{"full_name":"Dr. Sarah Chen","role":"DOCTOR"}'::jsonb
    );
  END IF;

  -- Dr. Marcus Rodriguez — Dermatology
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo+rodriguez@medbook.dev') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'demo+rodriguez@medbook.dev', demo_password, now(), now(), now(),
      '{}'::jsonb, '{"full_name":"Dr. Marcus Rodriguez","role":"DOCTOR"}'::jsonb
    );
  END IF;

  -- Dr. Aisha Patel — Pediatrics
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo+patel@medbook.dev') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'demo+patel@medbook.dev', demo_password, now(), now(), now(),
      '{}'::jsonb, '{"full_name":"Dr. Aisha Patel","role":"DOCTOR"}'::jsonb
    );
  END IF;

  -- Dr. James O'Brien — Orthopedics
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo+obrien@medbook.dev') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'demo+obrien@medbook.dev', demo_password, now(), now(), now(),
      '{}'::jsonb, '{"full_name":"Dr. James O''Brien","role":"DOCTOR"}'::jsonb
    );
  END IF;

  -- Dr. Emily Watson — Neurology
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo+watson@medbook.dev') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'demo+watson@medbook.dev', demo_password, now(), now(), now(),
      '{}'::jsonb, '{"full_name":"Dr. Emily Watson","role":"DOCTOR"}'::jsonb
    );
  END IF;

  -- Dr. David Kim — Psychiatry
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo+kim@medbook.dev') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
    VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'demo+kim@medbook.dev', demo_password, now(), now(), now(),
      '{}'::jsonb, '{"full_name":"Dr. David Kim","role":"DOCTOR"}'::jsonb
    );
  END IF;
END $$;

-- Doctor professional profiles (idempotent via user_id match)
INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, v.specialty, v.biography, v.clinic_address, v.fee, v.grid::jsonb, v.years
FROM profiles p
JOIN (
  SELECT 'demo+chen@medbook.dev' AS email, 'Cardiology' AS specialty,
    'Board-certified cardiologist specializing in preventive heart health, arrhythmia management, and post-operative cardiac care. Dr. Chen believes in partnering with patients to build lifelong heart-healthy habits.' AS biography,
    '500 Heart Health Plaza, Suite 200, San Francisco, CA' AS clinic_address,
    18000 AS fee,
    '{"timezone":"local","weekly":[{"day":"Monday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Tuesday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Wednesday","slots":["09:00","10:00","14:00","15:00"]},{"day":"Thursday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Friday","slots":["09:00","10:00","11:00"]},{"day":"Saturday","slots":[]},{"day":"Sunday","slots":[]}]}' AS grid,
    14 AS years
) v ON p.email = v.email
WHERE NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, v.specialty, v.biography, v.clinic_address, v.fee, v.grid::jsonb, v.years
FROM profiles p
JOIN (
  SELECT 'demo+rodriguez@medbook.dev' AS email, 'Dermatology' AS specialty,
    'Dermatologist focused on medical and cosmetic skin care, including acne treatment, skin cancer screening, and personalized skincare regimens for all skin types.' AS biography,
    '120 Skin Care Avenue, Suite 5, San Francisco, CA' AS clinic_address,
    15000 AS fee,
    '{"timezone":"local","weekly":[{"day":"Monday","slots":["10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Tuesday","slots":["10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Wednesday","slots":["10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Thursday","slots":["10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Friday","slots":["10:00","11:00","13:00","14:00"]},{"day":"Saturday","slots":["10:00","11:00"]},{"day":"Sunday","slots":[]}]}' AS grid,
    9 AS years
) v ON p.email = v.email
WHERE NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, v.specialty, v.biography, v.clinic_address, v.fee, v.grid::jsonb, v.years
FROM profiles p
JOIN (
  SELECT 'demo+patel@medbook.dev' AS email, 'Pediatrics' AS specialty,
    'Compassionate pediatrician dedicated to the health and development of children from infancy through adolescence. Dr. Patel provides well-child visits, vaccinations, and family-centered care.' AS biography,
    '300 Family Wellness Center, Suite 12, San Francisco, CA' AS clinic_address,
    12000 AS fee,
    '{"timezone":"local","weekly":[{"day":"Monday","slots":["08:00","09:00","10:00","11:00","14:00","15:00","16:00"]},{"day":"Tuesday","slots":["08:00","09:00","10:00","11:00","14:00","15:00","16:00"]},{"day":"Wednesday","slots":["08:00","09:00","10:00","14:00","15:00","16:00"]},{"day":"Thursday","slots":["08:00","09:00","10:00","11:00","14:00","15:00","16:00"]},{"day":"Friday","slots":["08:00","09:00","10:00","11:00"]},{"day":"Saturday","slots":["09:00","10:00","11:00"]},{"day":"Sunday","slots":[]}]}' AS grid,
    11 AS years
) v ON p.email = v.email
WHERE NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, v.specialty, v.biography, v.clinic_address, v.fee, v.grid::jsonb, v.years
FROM profiles p
JOIN (
  SELECT 'demo+obrien@medbook.dev' AS email, 'Orthopedics' AS specialty,
    'Orthopedic surgeon treating sports injuries, joint pain, and mobility issues. Dr. O''Brien combines surgical expertise with conservative therapies to get patients moving again.' AS biography,
    '800 Mobility Medical Building, Suite 300, San Francisco, CA' AS clinic_address,
    20000 AS fee,
    '{"timezone":"local","weekly":[{"day":"Monday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Tuesday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Wednesday","slots":["09:00","10:00","14:00","15:00"]},{"day":"Thursday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Friday","slots":["09:00","10:00","11:00","14:00"]},{"day":"Saturday","slots":[]},{"day":"Sunday","slots":[]}]}' AS grid,
    17 AS years
) v ON p.email = v.email
WHERE NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, v.specialty, v.biography, v.clinic_address, v.fee, v.grid::jsonb, v.years
FROM profiles p
JOIN (
  SELECT 'demo+watson@medbook.dev' AS email, 'Neurology' AS specialty,
    'Neurologist specializing in headache disorders, epilepsy, and memory care. Dr. Watson uses the latest diagnostic tools to build precise, personalized treatment plans.' AS biography,
    '450 NeuroCare Institute, Suite 110, San Francisco, CA' AS clinic_address,
    22000 AS fee,
    '{"timezone":"local","weekly":[{"day":"Monday","slots":["10:00","11:00","13:00","14:00","15:00"]},{"day":"Tuesday","slots":["10:00","11:00","13:00","14:00","15:00"]},{"day":"Wednesday","slots":["10:00","11:00","13:00","14:00","15:00"]},{"day":"Thursday","slots":["10:00","11:00","13:00","14:00","15:00"]},{"day":"Friday","slots":["10:00","11:00","13:00"]},{"day":"Saturday","slots":[]},{"day":"Sunday","slots":[]}]}' AS grid,
    13 AS years
) v ON p.email = v.email
WHERE NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, v.specialty, v.biography, v.clinic_address, v.fee, v.grid::jsonb, v.years
FROM profiles p
JOIN (
  SELECT 'demo+kim@medbook.dev' AS email, 'Psychiatry' AS specialty,
    'Psychiatrist offering evidence-based mental health care for anxiety, depression, and ADHD. Dr. Kim blends medication management with therapy referrals for whole-person wellness.' AS biography,
    '620 Mindful Health Center, Suite 8, San Francisco, CA' AS clinic_address,
    17000 AS fee,
    '{"timezone":"local","weekly":[{"day":"Monday","slots":["09:00","10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Tuesday","slots":["09:00","10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Wednesday","slots":["09:00","10:00","13:00","14:00","15:00","16:00"]},{"day":"Thursday","slots":["09:00","10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Friday","slots":["09:00","10:00","11:00","13:00"]},{"day":"Saturday","slots":["10:00","11:00"]},{"day":"Sunday","slots":[]}]}' AS grid,
    8 AS years
) v ON p.email = v.email
WHERE NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);
