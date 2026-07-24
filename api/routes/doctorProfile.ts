import { Router } from 'express';
import { query } from '../db';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const result = await query(
      'SELECT * FROM doctor_profiles WHERE user_id = $1',
      [user.userId],
    );
    if (result.rows.length === 0) {
      res.json(null);
      return;
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Doctor profile get error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
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

router.patch('/', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
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

export default router;
