# AI Usage Transcript

> **Project:** COMS3011A Lab 1 — Local Todo Application  
> **Assistant:** GitHub Copilot  
> **Started:** 28 July 2026

## How to Read This Record

This is a concise transcript of AI-assisted planning, code generation, and debugging. It records the human constraints, the assistant's actions, corrections made by the human, and where accepted decisions appear in the repository. It is not a claim that every line of code was authored manually.

## Session 1 — Requirements and Architecture

### Initial request

**Human prompt:**

> Read the supplied PDF, create a proper plan in a folder, design the project and folder structure, produce polished Markdown suitable for submission, and then create and install the files required by the document. Document the purpose and reason for each requested item.

### Constraints extracted from the brief

**Assistant summary:**

- Use Next.js and SQLite for a local-first, single-user application.
- Support creating, editing, and archiving tasks; never delete tasks.
- Store title, description, due date, topic, and one of three fixed statuses.
- Sort tasks by topic, status, and due date.
- Derive and display overdue state without adding it as a status.
- Persist information across application restarts.
- Provide at least three deterministic behavior tests from one documented command.
- Provide accurate third-party code, database design, and running documentation.
- Preserve an AI usage transcript and plan a coherent Git history.

**Outcome:** Accepted. These requirements are traced in `docs/PROJECT_PLAN.md`.

### Human correction and architectural redirection

**Human prompt:**

> Before you continue I would love for the backend to have: service — which contains the business logic; controller — for controller; utils — for logs and errors; tests file; repository that the service will be calling.

**Why this changed the output:**

The first architecture direction had not yet committed to these named backend layers. The human correctly constrained the design before application scaffolding so that business rules would not be placed directly in Next.js route handlers.

**Assistant response:**

> Structure the backend flow as route handler → controller → service → repository → SQLite, keep logging and typed errors in utils, and place deterministic tests in a dedicated tests tree using throwaway databases.

**Outcome:** Accepted and traceable to:

- `docs/PROJECT_PLAN.md` for responsibilities and the folder tree.
- `src/backend/controller/` for HTTP translation.
- `src/backend/service/` for business logic.
- `src/backend/repository/` for SQLite operations called by the service.
- `src/backend/utils/` for logs and errors.
- `tests/` for isolated behavior tests.

### Human correction to the frontend/backend boundary

**Human prompt:**

> I do not like the folder structure; there should be a clear distinction between the backend and frontend. Do not rush to coding the whole app yet. Confirm whether planning is done so we can commit and push the architecture. I am also not seeing component folders for the React frontend.

**Why this changed the output:**

The proposed `src/components/` and `src/server/` names separated some responsibilities but did not present an immediately clear frontend/backend boundary. The component tree was also too shallow to show where task-specific and reusable React components belonged.

**Assistant correction:**

- Replaced the design with explicit `src/frontend/` and `src/backend/` trees.
- Kept `src/app/` as a thin Next.js composition boundary for pages and route handlers only.
- Added `frontend/components/layout`, `frontend/components/tasks`, and `frontend/components/ui` folders.
- Added dependency rules preventing frontend code from importing backend modules directly.
- Paused application implementation so the architecture can be reviewed and committed first.

**Outcome:** Traceable to the architecture, dependency direction, folder tree, and delivery phases in `docs/PROJECT_PLAN.md`.

### Scaffolding correction

**Assistant action:** Attempted to run the official Next.js scaffolder in a temporary directory named `.scaffold` to preserve the existing PDF and documentation.

**Observed problem:** npm package naming rules reject names beginning with a period, so the scaffolder exited without generating project files.

**Correction:** Reran the same official scaffold using the valid temporary package name `scaffold-temp`. No source requirements or architecture decisions changed.

## Session 1 — Code Generation

### Architecture scaffold

**Human prompt:**

> Fix the folder structure and architecture, then identify what remains from the project plan.

**Assistant action:**

- Materialized separate `src/frontend`, `src/backend`, `src/types`, and `tests` boundaries. The original `src/shared` name was later simplified to `src/types` at the user's request.
- Kept `src/app` as the Next.js-required composition and route-handler area.
- Made `src/app/page.tsx` render a frontend-owned `AppShell` to prove the dependency direction.
- Added boundary documentation and tracked placeholders without implementing task behavior.
- Added local database ignore rules and an environment example.

**Validation:** `npm run lint` and `npx tsc --noEmit` passed after restructuring.

### Phase 1 database foundation

**Assistant action:** Added the versioned SQLite schema, reusable connection and migration runner, migration CLI, and an isolated migration test. Tests use temporary or in-memory databases and never access `data/todo.db`.

**Validation:** The migration test, lint, type check, and production build passed.

### Phase 2 backend

**Human constraint:**

> Make a simple test -> let it fail -> code the most minal code to make it pass -> after then we can refractor after all phases.

**Assistant action:** Implemented Phase 2 in small red-green slices: fixed task statuses and types; repository create, read, update, archive, active/archive listing, and allow-listed sorting; service validation and deterministic overdue derivation; controller HTTP translation; and thin Next.js route adapters. No deletion method or route was added.

**Validation:** Each behavior began with a focused failing test. The completed backend passes 12 tests across migration, types, repository, service, controller, and full route-to-SQL coverage. ESLint, TypeScript, and the production build also pass.

**Runtime correction:** A controller test sent JSON without a title and exposed an attempted `.trim()` on `undefined`, which returned HTTP 500. Runtime type checks were added at the service boundary so malformed task input returns a typed HTTP 400 response. A Turbopack file-tracing warning was removed by marking the configurable database and migration paths as runtime-only while preserving automatic migration discovery.

### Phase 3 frontend

**Human prompt:**

> Ok lets go to phase three now.

**Assistant action:** Implemented the browser interface through the same red-green-minimal cycle: a reusable button, typed HTTP client, shared create/edit form, initial active-task loading, create, edit, archive, active/archive switching, allow-listed sorting, and a visible overdue marker sourced from the backend. Responsive styles were added only after the behavior tests passed.

**Debugging corrections:** Vitest's attempted environment glob did not apply jsdom to this setup, so frontend tests use an explicit jsdom environment directive. React Testing Library cleanup was added globally after stale rendered DOM caused duplicate button queries. Final validation also exposed an unconstrained API response generic and a React effect lint violation; a runtime error-payload guard and event-driven loading state resolved them.

**Validation:** Phase 3 completes with 19 passing tests across 10 files. ESLint, `npx tsc --noEmit`, and the Next.js production build pass. Browser checks at 1280px and 390px confirmed active/archive switching, sorting, form layout, stable controls, and no horizontal overflow.

**Edge-case review:** The human proposed a stronger overdue alert, a delete icon, and a direct way to complete Todo or In-Progress tasks. The accessible overdue summary and direct Mark complete action were accepted. Destructive deletion was rejected because the assignment requires archiving while retaining tasks for the archived view; the existing archive icon remains the lifecycle removal control. Completion uses the existing update route, changes only the status to `COMPLETE`, and immediately clears overdue presentation.

### Phase 4 verification and submission

**Human prompt:**

> Now we can do phase 4.

**Assistant action:** Re-read the assignment rubric, audited the shipped files and direct dependencies, removed the unused `zod` and `vite-tsconfig-paths` packages, and added the missing `RUNNING_IT.md` and `THIRD_PARTY_CODE.md` documents. The README was made sufficient for the first clean-clone walkthrough step and now names the verified Node.js version and exact install, migration, start, and test commands.

**Clean-clone correction:** The first `npm ci` attempt overlapped with an already running development server, which held files under `node_modules` open on Windows and caused an invalid interrupted install. The server was stopped and `npm ci` was rerun alone; it installed all 438 packages successfully from `package-lock.json`. This was an environment file-lock issue rather than an application defect.

**Walkthrough:** A new temporary SQLite database was migrated and used for the fixed seven-step checklist. Tasks carrying all four required fields were created; an edit survived reload; archiving moved a task from the active to archived view without deletion; topic, status, and due-date sorts returned the expected orders; a past-due Todo was visibly flagged while the form exposed only the three fixed statuses; and active plus archived data remained after stopping and restarting the server.

**Dependency review:** A non-destructive audit reported high-severity advisories in transitive packages associated with the installed Next.js release. npm's forced recommendation proposed a breaking downgrade to Next.js 9.3.3, so it was rejected rather than applying an unsafe automated change.

**Validation:** The final repository passes 19 tests across 10 files, ESLint, `npx tsc --noEmit`, and the optimized Next.js production build. The Git history audit found eight coherent commits spread across 28 and 29 July 2026.

## Session 1 — Debugging

Substantive failures and corrections are recorded with their implementation slices above. Routine successful command output is summarized rather than copied in full.

## Declaration

The project was developed with assistance from GitHub Copilot. The human supplied the assignment, selected and corrected the architecture, reviewed the repository output, and remains responsible for understanding and submitting the work.