import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import doctorsRoutes from './routes/doctors.js';
import appointmentsRoutes from './routes/appointments.js';
import reviewsRoutes from './routes/reviews.js';
import doctorProfileRoutes from './routes/doctorProfile.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/doctor-profile', doctorProfileRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = parseInt(process.env.PORT || '3001', 10);

if (process.argv[1] && (process.argv[1].includes('index.ts') || process.argv[1].includes('index.js'))) {
  app.listen(PORT, () => {
    console.log(`MedBook API server running at http://localhost:${PORT}`);
  });
}

export default app;
