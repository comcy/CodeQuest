# CodeQuest — User Management Dashboard

A sample Angular application used as part of a technical interview for senior software developer candidates. The app is intentionally functional but contains a number of code-quality issues and bugs for the candidate to identify and fix.

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Angular CLI** ≥ 21

```bash
npm install -g @angular/cli
```

## Installation

```bash
git clone <repository-url>
cd CodeQuest
npm install
```

## Development server

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app auto-reloads on file changes.

## Project structure

The project follows the angular workspace paradigm which supports multiple project. (Ref: https://angular.dev/reference/configs/file-structure)
In this project we currently have a single application, a domain specific library and a shared-library.

```
CodeQuest/
├── projects/
│   ├── code-quest-app/          # Main application
│   │   └── src/app/
│   │       ├── dashboard/       # Dashboard page with stats
│   │       ├── app.ts           # Root component
│   │       ├── app.routes.ts    # Routing
│   │       └── app.config.ts   # App providers (HTTP, animations)
│   ├── shared-lib/              # Shared models, pipes, components, mock backend
│   │   └── src/lib/
│   │       ├── models/          # User model & types
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

There is no real backend. HTTP calls are intercepted by `mockApiInterceptor` (in `shared-lib`) which handles all `/api/users` endpoints in-memory with 20 seeded users.

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
| Framework | Angular 21 (standalone components) |
| UI library | Angular Material + CDK |
| Forms | Reactive Forms |
| HTTP | `HttpClient` with functional interceptor |
| Tests | Vitest 4 |
| Build | `@angular/build` (esbuild) |

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
