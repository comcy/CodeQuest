/**
 * Functions that transform User data between representations.
 *
 * This file contains intentional TypeScript bugs tagged TSBUG-9 through
 * TSBUG-12. Find each one, understand why it is unsafe, and fix it.
 */

import type { User, UserCreateRequest } from '../models/user.model';
import type { ApiResponse, ApiSuccess, ApiError } from '../models/api-response.model';

/** Minimal typing for an RxJS-style observable used in TSBUG-11. */
interface RxObservable<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toPromise(): Promise<T | undefined>; // deprecated in RxJS 7, removed in RxJS 8
  subscribe(observer: (value: T) => void): void;
}

// ---------------------------------------------------------------------------
// TSBUG-9 — `as` type assertion papers over missing required fields
// ---------------------------------------------------------------------------

/**
 * Constructs a full `User` from a `UserCreateRequest`.
 * Used in unit tests to produce a mock user without hitting the backend.
 *
 * BUG: `req as User` silences the compile error about the missing `id` and
 *      `createdAt` fields. At runtime the returned object has
 *      `id === undefined` and `createdAt === undefined`, breaking any
 *      downstream code that relies on those properties (e.g. routing to
 *      `/users/:id` will navigate to `/users/undefined`).
 *
 * Fix: Construct the object properly, supplying explicit test values for
 *      the fields that `UserCreateRequest` does not include:
 *
 *      return { ...req, id: 0, createdAt: new Date().toISOString() };
 *
 * @example
 *   mockUserFromRequest(req).id  // undefined today — should be 0 or a number
 */
export function mockUserFromRequest(req: UserCreateRequest): User {
  return req as User; // ← TSBUG-9
}

// ---------------------------------------------------------------------------
// TSBUG-10 — `'data' in response` instead of discriminant check
// ---------------------------------------------------------------------------

/**
 * Extracts the typed payload from an `ApiResponse<T>`, or the error message.
 *
 * BUG: `'data' in response` checks for property *existence*, not the
 *      value of the discriminant `success`. Any object that has a `data`
 *      property — including a hypothetical future `ApiError` extension —
 *      would wrongly pass this check. The correct guard for a discriminated
 *      union is to compare the literal discriminant:
 *      `response.success === true`.
 *
 * Fix: Replace `'data' in response` with `response.success === true`.
 *
 * @example
 *   // If ApiError gains a `data` field in future, this would silently break.
 */
export function unwrapResponse<T>(response: ApiResponse<T>): T | string {
  if ('data' in response) { // ← TSBUG-10: should be `response.success === true`
    return (response as ApiSuccess<T>).data;
  }
  return (response as ApiError).error;
}

// ---------------------------------------------------------------------------
// TSBUG-11 — Deprecated `.toPromise()` + unhandled async error
// ---------------------------------------------------------------------------

/**
 * Fetches all users and logs the total count to the console.
 * Intended as a diagnostic utility called once at application startup.
 *
 * BUG A — Deprecated API:
 *   `.toPromise()` was deprecated in RxJS 7 and removed in RxJS 8.
 *   TypeScript will not surface this as a type error (the method signature
 *   still exists in some versions), but it will throw at runtime or produce
 *   unexpected `undefined` results for empty Observables.
 *   Fix: Use `firstValueFrom(getUsers())` from `rxjs`.
 *
 * BUG B — Unhandled async error:
 *   The `async` function has no `try/catch`. A network error or a 500
 *   response will produce an unhandled Promise rejection that silently
 *   kills the diagnostic without any log output.
 *   Fix: Wrap the await in a try/catch block.
 *
 * @example
 *   logUserCount(service.getUsers.bind(service));
 */
export async function logUserCount(
  getUsers: () => RxObservable<User[]>,
): Promise<void> {
  const users = await getUsers().toPromise(); // ← TSBUG-11A + TSBUG-11B
  console.log('Total users:', users?.length);
}

// ---------------------------------------------------------------------------
// TSBUG-12 — No validation before `new Date(string)`
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable relative time string, e.g. `"3 days ago"`.
 *
 * BUG: `new Date(user.createdAt)` silently produces an `Invalid Date`
 *      when `createdAt` is not a parseable ISO string (empty string,
 *      locale-formatted date, null coerced to string, etc.).
 *      Subsequent arithmetic on `NaN` propagates silently through the UI,
 *      displaying `"NaN days ago"`.
 *
 * Fix: Validate the parsed date with `isNaN(created.getTime())` and return
 *      a sensible fallback string such as `'Unknown'` for invalid input.
 *
 * @example
 *   timeAgo({ ...user, createdAt: '' })  // returns 'NaN days ago' today
 */
export function timeAgo(user: User): string {
  const created = new Date(user.createdAt); // ← TSBUG-12: no validity check
  const diffMs = Date.now() - created.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  return diffDays === 0 ? 'Today' : `${diffDays} days ago`;
}
