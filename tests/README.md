# Test Structure

- `backend/helpers`: temporary SQLite database setup and deterministic fixtures.
- `backend/repository`: persistence, archive, and sorting behavior.
- `backend/service`: validation and overdue business rules.
- `frontend/components`: focused React interaction tests when they add value.

Backend tests must use throwaway databases and must never read or modify `data/todo.db`.

Run every test once with `npm test`. The migration test opens a database in the operating system's temporary directory, verifies the schema, opens it a second time to prove idempotence, and removes it afterward.

**AI Declaration:** This document was reviewed and edited with: Github Copilot[GPT-5.6-Sol]