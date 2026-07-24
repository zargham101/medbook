import express from 'express';
const app = express();

app.get('/api/health', (_: any, res: any) => {
  res.json({ status: 'ok', path: _.path, query: _.query });
});

export default function handler(req: any, res: any) {
  const originalPath = req.query.path as string | undefined;
  if (originalPath) {
    req.url = '/api/' + originalPath;
  }
  return app(req, res);
}
