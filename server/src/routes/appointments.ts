import { Router } from 'express';
import { query } from '../db';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
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

router.post('/', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
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

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { status, cancellation_reason, scheduled_at } = req.body;

    const existing = await query(
      'SELECT * FROM appointments WHERE id = $1',
      [id],
    );
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
    if (status !== undefined) {
      updates.push(`status = $${idx++}`);
      params.push(status);
    }
    if (cancellation_reason !== undefined) {
      updates.push(`cancellation_reason = $${idx++}`);
      params.push(cancellation_reason);
    }
    if (scheduled_at !== undefined) {
      updates.push(`scheduled_at = $${idx++}`);
      params.push(scheduled_at);
    }
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

export default router;
