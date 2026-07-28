# Frontend Boundary

This directory owns browser-facing React code. It may import API-safe contracts from `src/shared`, but it must not import from `src/backend`.

- `components/layout`: page shells and structural layout components.
- `components/tasks`: task forms, lists, items, filters, and empty states.
- `components/ui`: small reusable controls such as buttons, fields, badges, and dialogs.
- `hooks`: client-side task state and interaction hooks.
- `lib`: typed HTTP calls to the Next.js route handlers.
- `styles`: frontend design tokens and component styling.
- `types`: presentation-only view models.