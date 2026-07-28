# Test Structure

- `backend/helpers`: temporary SQLite database setup and deterministic fixtures.
- `backend/repository`: persistence, archive, and sorting behavior.
- `backend/service`: validation and overdue business rules.
- `frontend/components`: focused React interaction tests when they add value.

Backend tests must use throwaway databases and must never read or modify `data/todo.db`.