import express from 'express';
const app = express();
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

export default function handler(req: any, res: any) {
  app(req, res);
}
