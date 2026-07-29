# Running It

## Prerequisites

- Node.js 24.11.1
- npm 11.6.2, included with that Node.js installation
- Git, only to obtain a clean clone

No separate database server is required. SQLite is embedded in the application.

## Clean Clone

From a clean clone, run these commands in the repository root:

```bash
npm ci
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The migration creates `data/todo.db` and can be run repeatedly without losing existing tasks.

Stop the development server with `Ctrl+C`. Restart it with:

```bash
npm run dev
```

The same tasks remain available after the restart because they are stored in SQLite.

## Test and Verify

Run all automated tests with one command:

```bash
npm test
```

The tests use throwaway databases and never read or modify `data/todo.db`.

The additional static and production checks are:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Production Mode

After installing dependencies and migrating the database, build and start the production server:

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000). Stop the server with `Ctrl+C`.

## Database Location

The default database path is `data/todo.db`. To use another location, set `DATABASE_PATH` for both migration and server commands.

PowerShell:

```powershell
$env:DATABASE_PATH = "C:\path\to\todo.db"
npm run db:migrate
npm run dev
```

Bash-compatible shell:

```bash
DATABASE_PATH=/path/to/todo.db npm run db:migrate
DATABASE_PATH=/path/to/todo.db npm run dev
```

The parent directory is created automatically when it does not exist.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Reproduce the dependency tree from `package-lock.json` |
| `npm run db:migrate` | Create or update the selected SQLite database |
| `npm run dev` | Start the local development server |
| `npm test` | Run the complete deterministic test suite once |
| `npm run lint` | Check source and test lint rules |
| `npx tsc --noEmit` | Type-check without creating output files |
| `npm run build` | Create a production build |
| `npm start` | Serve the completed production build |

**AI Declaration:** This document was reviewed and edited with: Github Copilot[GPT-5.6-Sol]