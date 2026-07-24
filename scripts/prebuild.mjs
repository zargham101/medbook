import { execSync } from 'child_process';
if (process.env.DATABASE_URL) {
  console.log('Running migrations...');
  execSync('npx tsx server/src/migrate.ts', { stdio: 'inherit' });
} else {
  console.log('DATABASE_URL not set, skipping migrations');
}
