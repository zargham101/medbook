import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'medbook-dev-secret-change-in-production';
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.on('error', (err) => console.error('DB pool error:', err));

function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}

function signToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authenticate(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req: any, _res: any, next: any) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.slice(7);
      req.user = jwt.verify(token, JWT_SECRET);
    } catch { /* ignore */ }
  }
  next();
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use((req: any, _res: any, next: any) => {
  const fwd = req.headers['x-vercel-forwarded-url'] || req.headers['x-forwarded-url'];
  if (fwd && typeof fwd === 'string') {
    try { req.url = new URL(fwd, 'http://n').pathname + (req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''); } catch {}
  }
  next();
});

app.get('/api/health', (_: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/signup', async (req: any, res: any) => {
  try {
    const { email, password, full_name, role } = req.body;
    if (!email || !password || !full_name || !role) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (!['PATIENT', 'DOCTOR'].includes(role)) {
      res.status(400).json({ error: 'Role must be PATIENT or DOCTOR' });
      return;
    }
    const existing = await query('SELECT id FROM profiles WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO profiles (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, avatar_url, created_at`,
      [email, password_hash, full_name, role],
    );
    const profile = result.rows[0];
    const token = signToken({ userId: profile.id, role: profile.role });
    res.status(201).json({ token, profile });
  } catch (err: any) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signin', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const result = await query(
      'SELECT id, email, password_hash, full_name, role, avatar_url, created_at FROM profiles WHERE email = $1',
      [email],
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const profile = result.rows[0];
    const valid = await bcrypt.compare(password, profile.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const token = signToken({ userId: profile.id, role: profile.role });
    const { password_hash: _, ...safeProfile } = profile;
    res.json({ token, profile: safeProfile });
  } catch (err: any) {
    console.error('Signin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticate, async (req: any, res: any) => {
  try {
    const result = await query(
      'SELECT id, email, full_name, role, avatar_url, created_at FROM profiles WHERE id = $1',
      [req.user.userId],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json({ profile: result.rows[0] });
  } catch (err: any) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/doctors', optionalAuth, async (_req: any, res: any) => {
  try {
    const result = await query(`
      SELECT dp.*,
        jsonb_build_object(
          'id', p.id, 'email', p.email, 'full_name', p.full_name,
          'role', p.role, 'avatar_url', p.avatar_url, 'created_at', p.created_at
        ) AS profiles
      FROM doctor_profiles dp
      JOIN profiles p ON p.id = dp.user_id
      ORDER BY p.full_name ASC
    `);
    const doctors = result.rows;
    const withStats = await Promise.all(
      doctors.map(async (d: any) => {
        const revResult = await query(
          'SELECT COALESCE(AVG(rating), 0) as avg_rating, COUNT(*) as review_count FROM reviews WHERE doctor_id = $1',
          [d.user_id],
        );
        return {
          ...d,
          avg_rating: parseFloat(revResult.rows[0].avg_rating),
          review_count: parseInt(revResult.rows[0].review_count, 10),
        };
      }),
    );
    res.json(withStats);
  } catch (err: any) {
    console.error('Doctors list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/doctors/:userId', optionalAuth, async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const docResult = await query(`
      SELECT dp.*,
        jsonb_build_object(
          'id', p.id, 'email', p.email, 'full_name', p.full_name,
          'role', p.role, 'avatar_url', p.avatar_url, 'created_at', p.created_at
        ) AS profiles
      FROM doctor_profiles dp
      JOIN profiles p ON p.id = dp.user_id
      WHERE dp.user_id = $1
    `, [userId]);
    if (docResult.rows.length === 0) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }
    const doctor = docResult.rows[0];
    const revResult = await query(`
      SELECT r.*,
        jsonb_build_object(
          'id', pp.id, 'email', pp.email, 'full_name', pp.full_name,
          'role', pp.role, 'avatar_url', pp.avatar_url, 'created_at', pp.created_at
        ) AS patient
      FROM reviews r
      JOIN profiles pp ON pp.id = r.patient_id
      WHERE r.doctor_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);
    res.json({ ...doctor, reviews: revResult.rows });
  } catch (err: any) {
    console.error('Doctor detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/appointments', authenticate, async (req: any, res: any) => {
  try {
    const user = req.user;
    const { role } = req.query;
    let sql: string;
    let params: unknown[];
    if (role === 'doctor') {
      sql = `
        SELECT a.*,
          jsonb_build_object(
            'id', p.id, 'email', p.email, 'full_name', p.full_name,
            'role', p.role, 'avatar_url', p.avatar_url, 'created_at', p.created_at
          ) AS patient
        FROM appointments a
        JOIN profiles p ON p.id = a.patient_id
        WHERE a.doctor_id = $1
        ORDER BY a.scheduled_at ASC
      `;
      params = [user.userId];
    } else {
      sql = `
        SELECT a.*,
          jsonb_build_object(
            'id', p.id, 'email', p.email, 'full_name', p.full_name,
            'role', p.role, 'avatar_url', p.avatar_url, 'created_at', p.created_at
          ) AS doctor
        FROM appointments a
        JOIN profiles p ON p.id = a.doctor_id
        WHERE a.patient_id = $1
        ORDER BY a.scheduled_at ASC
      `;
      params = [user.userId];
    }
    const result = await query(sql, params);
    const appointments = result.rows;
    if (role !== 'doctor') {
      const doctorIds = [...new Set(appointments.map((a: any) => a.doctor_id))];
      if (doctorIds.length > 0) {
        const dpResult = await query(
          'SELECT * FROM doctor_profiles WHERE user_id = ANY($1)',
          [doctorIds],
        );
        const dpMap = new Map(dpResult.rows.map((dp: any) => [dp.user_id, dp]));
        appointments.forEach((a: any) => {
          a.doctor_profile = dpMap.get(a.doctor_id) || null;
        });
      }
    }
    res.json(appointments);
  } catch (err: any) {
    console.error('Appointments list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/appointments', authenticate, async (req: any, res: any) => {
  try {
    const user = req.user;
    const { doctor_id, scheduled_at } = req.body;
    if (!doctor_id || !scheduled_at) {
      res.status(400).json({ error: 'doctor_id and scheduled_at are required' });
      return;
    }
    const result = await query(
      `INSERT INTO appointments (patient_id, doctor_id, scheduled_at, status)
       VALUES ($1, $2, $3, 'PENDING')
       RETURNING *`,
      [user.userId, doctor_id, scheduled_at],
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Appointment create error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/appointments/:id', authenticate, async (req: any, res: any) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status, cancellation_reason, scheduled_at } = req.body;
    const existing = await query('SELECT * FROM appointments WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    const apt = existing.rows[0];
    if (apt.patient_id !== user.userId && apt.doctor_id !== user.userId) {
      res.status(403).json({ error: 'Not authorized to update this appointment' });
      return;
    }
    const updates: string[] = [];
    const params: unknown[] = [];
    let idx = 1;
    if (status !== undefined) { updates.push(`status = $${idx++}`); params.push(status); }
    if (cancellation_reason !== undefined) { updates.push(`cancellation_reason = $${idx++}`); params.push(cancellation_reason); }
    if (scheduled_at !== undefined) { updates.push(`scheduled_at = $${idx++}`); params.push(scheduled_at); }
    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }
    params.push(id);
    const result = await query(
      `UPDATE appointments SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      params,
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Appointment update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/reviews', authenticate, async (req: any, res: any) => {
  try {
    const user = req.user;
    const { appointment_id, doctor_id, rating, comment } = req.body;
    if (!appointment_id || !doctor_id || !rating) {
      res.status(400).json({ error: 'appointment_id, doctor_id, and rating are required' });
      return;
    }
    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be between 1 and 5' });
      return;
    }
    const aptCheck = await query(
      'SELECT id FROM appointments WHERE id = $1 AND patient_id = $2',
      [appointment_id, user.userId],
    );
    if (aptCheck.rows.length === 0) {
      res.status(403).json({ error: 'You can only review your own appointments' });
      return;
    }
    const result = await query(
      `INSERT INTO reviews (appointment_id, patient_id, doctor_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [appointment_id, user.userId, doctor_id, rating, comment || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'You have already reviewed this appointment' });
      return;
    }
    console.error('Review create error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/reviews/:id', authenticate, async (req: any, res: any) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { rating, comment } = req.body;
    const existing = await query(
      'SELECT id FROM reviews WHERE id = $1 AND patient_id = $2',
      [id, user.userId],
    );
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Review not found or not yours to edit' });
      return;
    }
    const updates: string[] = [];
    const params: unknown[] = [];
    let idx = 1;
    if (rating !== undefined) { updates.push(`rating = $${idx++}`); params.push(rating); }
    if (comment !== undefined) { updates.push(`comment = $${idx++}`); params.push(comment); }
    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }
    params.push(id);
    const result = await query(
      `UPDATE reviews SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      params,
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Review update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/reviews/:id', authenticate, async (req: any, res: any) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const result = await query(
      'DELETE FROM reviews WHERE id = $1 AND patient_id = $2 RETURNING id',
      [id, user.userId],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Review not found or not yours to delete' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error('Review delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/doctor-profile', authenticate, async (req: any, res: any) => {
  try {
    const user = req.user;
    const result = await query('SELECT * FROM doctor_profiles WHERE user_id = $1', [user.userId]);
    res.json(result.rows.length === 0 ? null : result.rows[0]);
  } catch (err: any) {
    console.error('Doctor profile get error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/doctor-profile', authenticate, async (req: any, res: any) => {
  try {
    const user = req.user;
    if (user.role !== 'DOCTOR') {
      res.status(403).json({ error: 'Only doctors can create a doctor profile' });
      return;
    }
    const { specialty, biography, clinic_address, consultation_fee, years_experience, availability_grid } = req.body;
    if (!specialty) {
      res.status(400).json({ error: 'Specialty is required' });
      return;
    }
    const existing = await query('SELECT id FROM doctor_profiles WHERE user_id = $1', [user.userId]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Doctor profile already exists, use PATCH to update' });
      return;
    }
    const result = await query(
      `INSERT INTO doctor_profiles (user_id, specialty, biography, clinic_address, consultation_fee, years_experience, availability_grid)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user.userId, specialty, biography || '', clinic_address || '', consultation_fee || 0, years_experience || 0, availability_grid || '{}'],
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Doctor profile create error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/doctor-profile', authenticate, async (req: any, res: any) => {
  try {
    const user = req.user;
    const { specialty, biography, clinic_address, consultation_fee, years_experience, availability_grid } = req.body;
    const existing = await query('SELECT id FROM doctor_profiles WHERE user_id = $1', [user.userId]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Doctor profile not found, use POST to create' });
      return;
    }
    const updates: string[] = [];
    const params: unknown[] = [];
    let idx = 1;
    if (specialty !== undefined) { updates.push(`specialty = $${idx++}`); params.push(specialty); }
    if (biography !== undefined) { updates.push(`biography = $${idx++}`); params.push(biography); }
    if (clinic_address !== undefined) { updates.push(`clinic_address = $${idx++}`); params.push(clinic_address); }
    if (consultation_fee !== undefined) { updates.push(`consultation_fee = $${idx++}`); params.push(consultation_fee); }
    if (years_experience !== undefined) { updates.push(`years_experience = $${idx++}`); params.push(years_experience); }
    if (availability_grid !== undefined) { updates.push(`availability_grid = $${idx++}`); params.push(availability_grid); }
    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }
    params.push(user.userId);
    const result = await query(
      `UPDATE doctor_profiles SET ${updates.join(', ')} WHERE user_id = $${idx} RETURNING *`,
      params,
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Doctor profile update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default function handler(req: any, res: any) {
  app(req, res);
}
