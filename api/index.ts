import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export const handler = serverless(app);
