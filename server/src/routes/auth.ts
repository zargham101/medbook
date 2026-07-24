import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db';
import { signToken, authenticate } from '../middleware/auth';

const router = Router();

router.post('/signup', async (req, res) => {
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

router.post('/signin', async (req, res) => {
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

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const result = await query(
      'SELECT id, email, full_name, role, avatar_url, created_at FROM profiles WHERE id = $1',
      [user.userId],
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

export default router;
