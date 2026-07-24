import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}

export function getClient() {
  return pool.connect();
}
