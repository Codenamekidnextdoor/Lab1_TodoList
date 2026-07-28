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

- Materialized separate `src/frontend`, `src/backend`, `src/shared`, and `tests` boundaries.
- Kept `src/app` as the Next.js-required composition and route-handler area.
- Made `src/app/page.tsx` render a frontend-owned `AppShell` to prove the dependency direction.
- Added boundary documentation and tracked placeholders without implementing task behavior.
- Added local database ignore rules and an environment example.

**Validation:** `npm run lint` and `npx tsc --noEmit` passed after restructuring.

This section will be extended as implementation slices are completed. Each entry should identify the prompt or constraint, the generated area, any rejected or revised output, and the validation command used.

## Session 1 — Debugging

This section will record substantive test, lint, build, or runtime failures and the resulting correction. Routine successful command output is summarized rather than copied in full.

## Declaration

The project was developed with assistance from GitHub Copilot. The human supplied the assignment, selected and corrected the architecture, reviewed the repository output, and remains responsible for understanding and submitting the work.