import './middleware/auth';

export default function handler(req: any, res: any) {
  res.json({ status: 'auth-middleware-imported' });
}
