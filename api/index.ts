import express from 'express';
import cors from 'cors';
import authRoutes from '../server/src/routes/auth';
import doctorsRoutes from '../server/src/routes/doctors';
import appointmentsRoutes from '../server/src/routes/appointments';
import reviewsRoutes from '../server/src/routes/reviews';
import doctorProfileRoutes from '../server/src/routes/doctorProfile';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/doctor-profile', doctorProfileRoutes);
app.get('/api/health', (_: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default function handler(req: any, res: any) {
  const originalPath = req.query.path as string | undefined;
  if (originalPath) {
    req.url = '/api/' + originalPath;
  }
  return app(req, res);
}
