# Database Migrations

Versioned SQLite schema changes live here. Migrations are append-only and run in filename order. `001_create_tasks.sql` creates the initial task schema and indexes.

Applied filenames are recorded in `schema_migrations`, making repeated runs of `npm run db:migrate` safe.