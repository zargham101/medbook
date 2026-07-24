import express from 'express';
import authRoutes from './routes/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get('/api/health', (_: any, res: any) => {
  res.json({ status: 'ok' });
});

export default function handler(req: any, res: any) {
  const originalPath = req.query.path as string | undefined;
  if (originalPath) {
    req.url = '/api/' + originalPath;
  }
  return app(req, res);
}
