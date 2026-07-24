import pg from 'pg';

export default function handler(req: any, res: any) {
  res.json({ step: 'pg-imported', hasPool: typeof pg.Pool === 'function' });
}
