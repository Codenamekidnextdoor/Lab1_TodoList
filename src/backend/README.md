# Backend Boundary

This directory owns server-only application code. It must not import React components, frontend hooks, or browser-only APIs.

The dependency flow is one-way:

```text
controller -> service -> repository -> database
                 |            |
                 +-- utils ----+
```

- `controller`: translates HTTP requests and service results; contains no SQL or business policy.
- `service`: owns validation and task business rules; calls repositories through explicit interfaces.
- `repository`: owns parameterized SQLite queries and row mapping; contains no HTTP behavior.
- `utils`: typed application errors and structured local logging.
- `database.ts` (planned): creates SQLite connections and applies migrations.