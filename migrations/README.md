# Database Migrations

Versioned SQLite schema changes live here. Migrations are append-only and run in filename order. `001_create_tasks.sql` creates the initial task schema and indexes.

Applied filenames are recorded in `schema_migrations`, making repeated runs of `npm run db:migrate` safe.

**AI Declaration:** This document was reviewed and edited with: Github Copilot[GPT-5.6-Sol]