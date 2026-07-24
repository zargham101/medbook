import './db';

export default function handler(req: any, res: any) {
  res.json({ status: 'db-imported' });
}
