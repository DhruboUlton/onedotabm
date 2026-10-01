/**
 * Applies the migrations in supabase/migrations that the database has not run
 * yet, oldest first, each in its own transaction.
 *
 * Deploying code ahead of its schema takes production down, so run this before
 * pushing a change that needs a new column or table:
 *
 *   npm run migrate          apply what is pending
 *   npm run migrate -- --dry list what is pending and change nothing
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const DIR = 'supabase/migrations';
const dryRun = process.argv.includes('--dry');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/migrate.mjs');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const client = await pool.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const applied = new Set(
    (await client.query('SELECT filename FROM public.schema_migrations')).rows.map((r) => r.filename)
  );

  const files = readdirSync(DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const pending = files.filter((f) => !applied.has(f));

  if (pending.length === 0) {
    console.log(`Up to date — ${files.length} migration(s) applied.`);
    process.exit(0);
  }

  if (dryRun) {
    console.log(`${pending.length} pending:`);
    pending.forEach((f) => console.log('  ' + f));
    process.exit(0);
  }

  for (const file of pending) {
    const sql = readFileSync(path.join(DIR, file), 'utf8');
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO public.schema_migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log('applied  ' + file);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('FAILED   ' + file + '\n         ' + error.message);
      process.exit(1);
    }
  }

  console.log(`Done — ${pending.length} applied.`);
} finally {
  client.release();
  await pool.end();
}
