# CodeQuest — User Management Dashboard

A sample Angular and TypeScript application used as part of a technical interview for senior software developer candidates. The app is intentionally functional but contains a number of code-quality issues and bugs — both Angular-specific and pure TypeScript — for the candidate to identify and fix.

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Angular CLI** ≥ 21

```bash
npm install -g @angular/cli
```

## Installation

```bash
git clone https://github.com/comcy/CodeQuest
cd CodeQuest
npm install
```

## Development server

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app auto-reloads on file changes.

## Project structure

The project follows the Angular workspace paradigm which supports multiple projects. (Ref: https://angular.dev/reference/configs/file-structure)
In this project we have a single application, a domain-specific feature library (`users-lib`) and a shared library (`shared-lib`). The shared library contains both Angular-specific code (components, pipes, interceptor) and framework-agnostic TypeScript utilities (models, collection helpers, type utilities, stats and transform functions).

```
CodeQuest/
├── projects/
│   ├── code-quest-app/          # Main application
│   │   └── src/app/
│   │       ├── dashboard/       # Dashboard page with stats
│   │       ├── app.ts           # Root component
│   │       ├── app.routes.ts    # Routing
│   │       └── app.config.ts    # App providers (HTTP, animations)
│   ├── shared-lib/              # Shared models, utils, pipes, components, mock backend
│   │   └── src/lib/
│   │       ├── models/          # User model & types, API response types
│   │       │   ├── user.model.ts
│   │       │   └── api-response.model.ts
│   │       ├── utils/           # TypeScript utility helpers
│   │       │   ├── collection.utils.ts
│   │       │   ├── type.utils.ts
│   │       │   ├── user-stats.utils.ts
│   │       │   └── user-transform.utils.ts
│   │       ├── interceptors/    # Mock API interceptor (replaces real backend)
│   │       ├── components/      # ConfirmDialog, LoadingSpinner
│   │       └── pipes/           # RoleBadgeColor, StatusLabel
│   └── users-lib/               # User feature library
│       └── src/lib/
│           ├── services/        # UserService (CRUD via HttpClient)
│           ├── user-list/       # User table with sort, filter, pagination
│           ├── user-form-dialog/ # Create / edit dialog (Reactive Forms)
│           └── user-detail/     # User detail view
└── tsconfig.json                # Path aliases: shared-lib, users-lib → source
```

## Mock backend

> **No separate backend process is needed.** The mock backend runs entirely inside the browser as an Angular HTTP interceptor. Starting `ng serve` is sufficient — there is nothing else to start.

HTTP calls are intercepted by `mockApiInterceptor` (in `shared-lib`) which handles all `/api/users` endpoints in-memory with 20 seeded users (`mock-data/users.data.ts`).

The `ApiResponse<T>` discriminated union (`models/api-response.model.ts`) defines the shape of every response. The utility layers (`user-stats.utils.ts`, `user-transform.utils.ts`, `collection.utils.ts`) operate on this data without any Angular dependency — they are plain TypeScript.

This workspace runs **zoneless** (via `provideZonelessChangeDetection()` in `app.config.ts`), so the mock API returns **GET** responses synchronously to keep the UI reactive without Zone.js.

## Running unit tests

```bash
ng test
```

Tests run with [Vitest](https://vitest.dev/) + jsdom.

## Building

```bash
ng build
```

Build artifacts are placed in `dist/`.

## Tech stack

| | |
|---|---|
| Framework | Angular 21 (standalone components, zoneless) |
| Language | TypeScript 5 (strict mode, `noImplicitAny`, `noImplicitReturns`) |
| UI library | Angular Material + CDK |
| Forms | Reactive Forms |
| HTTP | `HttpClient` with functional interceptor |
| Tests | Vitest 4 + jsdom |
| Build | `@angular/build` (esbuild) |

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
