import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const api = express.Router();

api.get('/health', (_: any, res: any) => {
  res.json({ status: 'ok', from: 'serverless-function', timestamp: new Date().toISOString() });
});

app.use('/api', api);

export default function handler(req: any, res: any) {
  const originalPath = req.query.path as string | undefined;
  if (originalPath) {
    req.url = '/api/' + originalPath;
  }
  return app(req, res);
}
