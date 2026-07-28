# COMS3011A Todo Application

A local-first, single-user todo application built with Next.js, TypeScript, and SQLite for COMS3011A Lab 1.

> **Current status:** Architecture scaffold complete; task behavior is not implemented yet.

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

The exact clean-clone instructions will be finalized and verified in `docs/RUNNING_IT.md` once the database migration and test command are implemented. During architecture development, the available checks are:

```bash
npm install
npm run dev
npm run lint
npx tsc --noEmit
```

Open [http://localhost:3000](http://localhost:3000) after starting the development server.

## Local-Only Scope

This application is intended to run on the user's machine. It has no deployment target, remote database, or user accounts. Runtime task data will be stored in the ignored `data/` directory.
