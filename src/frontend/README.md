# Frontend Boundary

This directory owns browser-facing React code. It may import application types from `src/types`, but it must not import from `src/backend`.

- `components/layout`: page shells and structural layout components.
- `components/tasks`: task forms, lists, items, filters, and empty states.
- `components/ui`: small reusable controls such as buttons, fields, badges, and dialogs.
- `hooks`: client-side task state and interaction hooks.
- `lib`: typed HTTP calls to the Next.js route handlers.
- `styles`: frontend design tokens and component styling.
- `types`: presentation-only view models.

**AI Declaration:** This document was reviewed and edited with: Github Copilot[GPT-5.6-Sol]