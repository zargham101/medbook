import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export default function handler(req: any, res: any) {
  res.json({ step: 'pool-created', hasQuery: typeof pool.query === 'function' });
}
