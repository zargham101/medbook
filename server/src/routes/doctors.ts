import { Router } from 'express';
import { query } from '../db';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        dp.*,
        jsonb_build_object(
          'id', p.id,
          'email', p.email,
          'full_name', p.full_name,
          'role', p.role,
          'avatar_url', p.avatar_url,
          'created_at', p.created_at
        ) AS profiles
      FROM doctor_profiles dp
      JOIN profiles p ON p.id = dp.user_id
      ORDER BY p.full_name ASC
    `);
    const doctors = result.rows;
    const withStats = await Promise.all(
      doctors.map(async (d) => {
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

router.get('/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const docResult = await query(`
      SELECT
        dp.*,
        jsonb_build_object(
          'id', p.id,
          'email', p.email,
          'full_name', p.full_name,
          'role', p.role,
          'avatar_url', p.avatar_url,
          'created_at', p.created_at
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
      SELECT
        r.*,
        jsonb_build_object(
          'id', pp.id,
          'email', pp.email,
          'full_name', pp.full_name,
          'role', pp.role,
          'avatar_url', pp.avatar_url,
          'created_at', pp.created_at
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

export default router;
