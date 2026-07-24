import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth';
import doctorsRoutes from './routes/doctors';
import appointmentsRoutes from './routes/appointments';
import reviewsRoutes from './routes/reviews';
import doctorProfileRoutes from './routes/doctorProfile';

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

const __filename = fileURLToPath(import.meta.url);
const PORT = parseInt(process.env.PORT || '3001', 10);

if (process.argv[1] && process.argv[1] === __filename) {
  app.listen(PORT, () => {
    console.log(`MedBook API server running at http://localhost:${PORT}`);
  });
}

export default app;
