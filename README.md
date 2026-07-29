# COMS3011A Todo Application

A local-first, single-user todo application built with Next.js, TypeScript, and SQLite for COMS3011A Lab 1.

> **Current status:** Phase 4 complete. The tested local task workspace supports creating, editing, completing, archiving, active/archive views, sorting, overdue alerts, and SQLite persistence across restarts.

## Architecture

The project keeps browser and server responsibilities visibly separate:

```text
src/app          Next.js pages and route adapters only
src/frontend     React components, hooks, styles, and browser API client
src/backend      Controllers, services, repositories, database, logs, and errors
src/types        All application TypeScript types and fixed status values
tests            Separate backend and frontend test trees
```

The backend dependency direction is:

```text
route handler -> controller -> service -> repository -> SQLite
```

See [the project plan](docs/PROJECT_PLAN.md) for the complete structure, ownership rules, implementation phases, and rubric traceability. The required submission guides document the [database design](docs/DATABASE_DESIGN.md), [third-party code](docs/THIRD_PARTY_CODE.md), and [clean-clone commands](docs/RUNNING_IT.md).

## Install and Run

Install Node.js 24.11.1, then run these exact commands from the repository root:

```bash
npm ci
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Stop the server with `Ctrl+C`; start it again with `npm run dev`. Tasks persist in `data/todo.db` across page reloads and restarts.

Run all automated tests with the single required test command:

```bash
npm test
```

Optional quality checks are:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

For production mode, run `npm run build` once and then `npm start`. Set `DATABASE_PATH` before migration and startup to use a database somewhere other than the default `data/todo.db`. See [Running It](docs/RUNNING_IT.md) for clean-clone, database override, and production details.

## Task Workspace

The browser interface supports the complete task workflow without a page reload:

- Create and edit tasks with title, description, due date, topic, and a fixed status.
- Archive tasks without deleting their SQLite records.
- Switch between active and archived views.
- Sort the current view by due date, topic, or status.
- See an accessible summary alert and row indicator for overdue tasks, identified from the backend's derived `isOverdue` value.
- Mark any Todo or In-Progress task complete directly from the task list.

The layout is keyboard accessible and responsive across desktop and mobile widths.

## Local-Only Scope

This application is intended to run on the user's machine. It has no deployment target, remote database, or user accounts. Runtime task data will be stored in the ignored `data/` directory.

**AI Declaration:** This document was reviewed and edited with: Github Copilot[GPT-5.6-Sol]
