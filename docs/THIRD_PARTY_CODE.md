# Third-Party Code

The application uses the direct packages below. Versions are the versions installed from the committed `package-lock.json`; transitive dependencies are managed by npm and are not used directly by application code.

## Runtime Dependencies

| Package | Installed version | Why it was chosen |
| --- | --- | --- |
| `better-sqlite3` | 13.0.1 | Provides a small synchronous SQLite API suited to a local, single-user application and supports isolated test databases. |
| `lucide-react` | 1.27.0 | Supplies accessible, consistent React icons for compact task actions without maintaining custom SVG markup. |
| `next` | 16.2.12 | Provides the required Next.js App Router, local development server, production build, pages, and HTTP route handlers. |
| `react` | 19.2.4 | Provides the component and state model used by the browser interface. |
| `react-dom` | 19.2.4 | Connects the React component tree to the browser DOM through Next.js. |

## Development Dependencies

| Package | Installed version | Why it was chosen |
| --- | --- | --- |
| `@testing-library/dom` | 10.4.1 | Provides DOM queries and assertions that test the interface through user-visible behavior. |
| `@testing-library/react` | 16.3.2 | Renders React components and drives interaction tests in Vitest. |
| `@types/better-sqlite3` | 7.6.13 | Adds TypeScript declarations for the SQLite driver. |
| `@types/node` | 20.19.43 | Adds TypeScript declarations for Node.js APIs used by the backend, scripts, and tests. |
| `@types/react` | 19.2.17 | Adds TypeScript declarations for React components and hooks. |
| `@types/react-dom` | 19.2.3 | Adds TypeScript declarations for React DOM integration. |
| `@vitejs/plugin-react` | 6.0.4 | Lets Vitest transform React JSX consistently during component tests. |
| `eslint` | 9.39.5 | Performs static checks for code-quality and correctness issues. |
| `eslint-config-next` | 16.2.12 | Applies lint rules aligned with the installed Next.js and React versions. |
| `jsdom` | 29.1.1 | Emulates browser DOM APIs for deterministic component tests in Node.js. |
| `tsx` | 4.23.1 | Runs the TypeScript database migration script directly without a separate compilation step. |
| `typescript` | 5.9.3 | Type-checks shared contracts and the frontend/backend implementation. |
| `vitest` | 4.1.10 | Runs backend and frontend behavior tests through one documented command. |

## Dependency Policy

- Direct dependencies must be used by shipped code or development tooling and have a documented reason above.
- `package-lock.json` is committed so `npm ci` reproduces the verified dependency tree.
- The project does not copy third-party source code into the repository.
- Dependency updates require the automated tests, lint, type-check, and production build to pass.

**AI Declaration:** This document was reviewed and edited with: Github Copilot[GPT-5.6-Sol]