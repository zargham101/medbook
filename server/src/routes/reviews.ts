import { Router } from 'express';
import { query } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
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

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
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
    if (rating !== undefined) {
      updates.push(`rating = $${idx++}`);
      params.push(rating);
    }
    if (comment !== undefined) {
      updates.push(`comment = $${idx++}`);
      params.push(comment);
    }
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

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
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

export default router;
