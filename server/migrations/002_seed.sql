CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  uid uuid;
BEGIN
  -- Dr. Sarah Chen — Cardiology
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'demo+chen@medbook.dev') THEN
    INSERT INTO profiles (email, password_hash, full_name, role)
    VALUES ('demo+chen@medbook.dev', crypt('demoPassword123', gen_salt('bf')), 'Dr. Sarah Chen', 'DOCTOR');
  END IF;
  -- Dr. Marcus Rodriguez — Dermatology
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'demo+rodriguez@medbook.dev') THEN
    INSERT INTO profiles (email, password_hash, full_name, role)
    VALUES ('demo+rodriguez@medbook.dev', crypt('demoPassword123', gen_salt('bf')), 'Dr. Marcus Rodriguez', 'DOCTOR');
  END IF;
  -- Dr. Aisha Patel — Pediatrics
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'demo+patel@medbook.dev') THEN
    INSERT INTO profiles (email, password_hash, full_name, role)
    VALUES ('demo+patel@medbook.dev', crypt('demoPassword123', gen_salt('bf')), 'Dr. Aisha Patel', 'DOCTOR');
  END IF;
  -- Dr. James O'Brien — Orthopedics
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'demo+obrien@medbook.dev') THEN
    INSERT INTO profiles (email, password_hash, full_name, role)
    VALUES ('demo+obrien@medbook.dev', crypt('demoPassword123', gen_salt('bf')), 'Dr. James O''Brien', 'DOCTOR');
  END IF;
  -- Dr. Emily Watson — Neurology
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'demo+watson@medbook.dev') THEN
    INSERT INTO profiles (email, password_hash, full_name, role)
    VALUES ('demo+watson@medbook.dev', crypt('demoPassword123', gen_salt('bf')), 'Dr. Emily Watson', 'DOCTOR');
  END IF;
  -- Dr. David Kim — Psychiatry
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'demo+kim@medbook.dev') THEN
    INSERT INTO profiles (email, password_hash, full_name, role)
    VALUES ('demo+kim@medbook.dev', crypt('demoPassword123', gen_salt('bf')), 'Dr. David Kim', 'DOCTOR');
  END IF;
END $$;

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, 'Cardiology',
  'Board-certified cardiologist specializing in preventive heart health, arrhythmia management, and post-operative cardiac care.',
  '500 Heart Health Plaza, Suite 200, San Francisco, CA',
  18000,
  '{"timezone":"local","weekly":[{"day":"Monday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Tuesday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Wednesday","slots":["09:00","10:00","14:00","15:00"]},{"day":"Thursday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Friday","slots":["09:00","10:00","11:00"]},{"day":"Saturday","slots":[]},{"day":"Sunday","slots":[]}]}'::jsonb,
  14
FROM profiles p WHERE p.email = 'demo+chen@medbook.dev'
AND NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, 'Dermatology',
  'Dermatologist focused on medical and cosmetic skin care, including acne treatment, skin cancer screening, and personalized skincare regimens.',
  '120 Skin Care Avenue, Suite 5, San Francisco, CA',
  15000,
  '{"timezone":"local","weekly":[{"day":"Monday","slots":["10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Tuesday","slots":["10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Wednesday","slots":["10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Thursday","slots":["10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Friday","slots":["10:00","11:00","13:00","14:00"]},{"day":"Saturday","slots":["10:00","11:00"]},{"day":"Sunday","slots":[]}]}'::jsonb,
  9
FROM profiles p WHERE p.email = 'demo+rodriguez@medbook.dev'
AND NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, 'Pediatrics',
  'Compassionate pediatrician dedicated to the health and development of children from infancy through adolescence.',
  '300 Family Wellness Center, Suite 12, San Francisco, CA',
  12000,
  '{"timezone":"local","weekly":[{"day":"Monday","slots":["08:00","09:00","10:00","11:00","14:00","15:00","16:00"]},{"day":"Tuesday","slots":["08:00","09:00","10:00","11:00","14:00","15:00","16:00"]},{"day":"Wednesday","slots":["08:00","09:00","10:00","14:00","15:00","16:00"]},{"day":"Thursday","slots":["08:00","09:00","10:00","11:00","14:00","15:00","16:00"]},{"day":"Friday","slots":["08:00","09:00","10:00","11:00"]},{"day":"Saturday","slots":["09:00","10:00","11:00"]},{"day":"Sunday","slots":[]}]}'::jsonb,
  11
FROM profiles p WHERE p.email = 'demo+patel@medbook.dev'
AND NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, 'Orthopedics',
  'Orthopedic surgeon treating sports injuries, joint pain, and mobility issues.',
  '800 Mobility Medical Building, Suite 300, San Francisco, CA',
  20000,
  '{"timezone":"local","weekly":[{"day":"Monday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Tuesday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Wednesday","slots":["09:00","10:00","14:00","15:00"]},{"day":"Thursday","slots":["09:00","10:00","11:00","14:00","15:00"]},{"day":"Friday","slots":["09:00","10:00","11:00","14:00"]},{"day":"Saturday","slots":[]},{"day":"Sunday","slots":[]}]}'::jsonb,
  17
FROM profiles p WHERE p.email = 'demo+obrien@medbook.dev'
AND NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, 'Neurology',
  'Neurologist specializing in headache disorders, epilepsy, and memory care.',
  '450 NeuroCare Institute, Suite 110, San Francisco, CA',
  22000,
  '{"timezone":"local","weekly":[{"day":"Monday","slots":["10:00","11:00","13:00","14:00","15:00"]},{"day":"Tuesday","slots":["10:00","11:00","13:00","14:00","15:00"]},{"day":"Wednesday","slots":["10:00","11:00","13:00","14:00","15:00"]},{"day":"Thursday","slots":["10:00","11:00","13:00","14:00","15:00"]},{"day":"Friday","slots":["10:00","11:00","13:00"]},{"day":"Saturday","slots":[]},{"day":"Sunday","slots":[]}]}'::jsonb,
  13
FROM profiles p WHERE p.email = 'demo+watson@medbook.dev'
AND NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);

INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, availability_grid, years_experience)
SELECT p.id, 'Psychiatry',
  'Psychiatrist offering evidence-based mental health care for anxiety, depression, and ADHD.',
  '620 Mindful Health Center, Suite 8, San Francisco, CA',
  17000,
  '{"timezone":"local","weekly":[{"day":"Monday","slots":["09:00","10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Tuesday","slots":["09:00","10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Wednesday","slots":["09:00","10:00","13:00","14:00","15:00","16:00"]},{"day":"Thursday","slots":["09:00","10:00","11:00","13:00","14:00","15:00","16:00"]},{"day":"Friday","slots":["09:00","10:00","11:00","13:00"]},{"day":"Saturday","slots":["10:00","11:00"]},{"day":"Sunday","slots":[]}]}'::jsonb,
  8
FROM profiles p WHERE p.email = 'demo+kim@medbook.dev'
AND NOT EXISTS (SELECT 1 FROM doctor_profiles dp WHERE dp.user_id = p.id);
