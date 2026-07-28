# COMS3011A Todo Application

A local-first, single-user todo application built with Next.js, TypeScript, and SQLite for COMS3011A Lab 1.

> **Current status:** Phase 1 foundation complete; task behavior begins in Phase 2.

## Architecture

The project keeps browser and server responsibilities visibly separate:

```text
src/app          Next.js pages and route adapters only
src/frontend     React components, hooks, styles, and browser API client
src/backend      Controllers, services, repositories, database, logs, and errors
src/shared       API-safe contracts shared across the boundary
tests            Separate backend and frontend test trees
```

The backend dependency direction is:

```text
route handler -> controller -> service -> repository -> SQLite
```

See [the project plan](docs/PROJECT_PLAN.md) for the complete structure, ownership rules, implementation phases, and rubric traceability. The database decisions are documented in [the database design](docs/DATABASE_DESIGN.md).

## Development

Install dependencies, initialize the local database, and start the application:

```bash
npm install
npm run db:migrate
npm run dev
```

The default database is `data/todo.db`. Set `DATABASE_PATH` to override it. Run the available checks with:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Open [http://localhost:3000](http://localhost:3000) after starting the development server.

## Local-Only Scope

This application is intended to run on the user's machine. It has no deployment target, remote database, or user accounts. Runtime task data will be stored in the ignored `data/` directory.
