/**
 * Utility functions for computing User statistics and display helpers.
 *
 * This file contains intentional TypeScript bugs tagged TSBUG-1 through
 * TSBUG-8. Find each one, understand why it is unsafe, and fix it.
 */

import type { User, UserUpdateRequest } from '../models/user.model';

// ---------------------------------------------------------------------------
// TSBUG-1 — Non-null assertion without a proper guard
// ---------------------------------------------------------------------------

/**
 * Returns the full display name of a user.
 *
 * BUG: The `!` non-null assertions silence the compiler but cause a
 *      runtime crash (`TypeError: Cannot read properties of null`) when
 *      `user` is `null`. The function signature already documents that
 *      `null` is a valid input, so the assertions are a lie to the compiler.
 *
 * Fix: Replace the `!` assertions with a proper null guard — either an
 *      early return, a ternary, or optional chaining with a nullish fallback.
 *
 * @example
 *   getDisplayName(null)  // ← crashes today, should return '' or 'Unknown'
 */
export function getDisplayName(user: User | null): string {
  return user!.firstName + ' ' + user!.lastName; // ← TSBUG-1
}

// ---------------------------------------------------------------------------
// TSBUG-2 — Shared mutable reference returned instead of a fresh array
// ---------------------------------------------------------------------------

/**
 * Creates an in-memory cache for recently viewed users.
 *
 * BUG: The function returns the same module-level array reference on every
 *      call. Any caller that pushes to or clears the returned cache will
 *      mutate the shared state, affecting every other caller that holds a
 *      reference. TypeScript does not detect this: the types all check out.
 *
 * Fix: Return a fresh copy each time — either `[]` for an empty cache or
 *      `[..._sharedCache]` if pre-population is desired.
 *
 * @example
 *   const a = createUserCache();
 *   const b = createUserCache();
 *   a.push(user);
 *   console.log(b.length); // 1 today — should be 0
 */
const _sharedCache: User[] = [];

export function createUserCache(): User[] {
  return _sharedCache; // ← TSBUG-2: returns the same reference every time
}

// ---------------------------------------------------------------------------
// TSBUG-3 — Inconsistent return branches / missing return-type annotation
// ---------------------------------------------------------------------------

/**
 * Returns a display identifier string for a user, e.g. `"USER-42"`.
 *
 * BUG: The negative-id branch returns the raw `number` instead of a
 *      formatted string. Because no explicit return-type annotation is
 *      present the compiler widens the return type to `string | number`,
 *      so callers that pass the result to a string-only API fail silently.
 *
 * Fix: Add `: string` as an explicit return type and correct the branch
 *      so it always returns a string.
 *
 * @example
 *   formatUserId(-1)  // returns -1 (number) today — should return 'USER--1'
 */
export function formatUserId(id: number) { // ← TSBUG-3: no `: string` annotation
  if (id < 0) return id; // ← returns number instead of string
  return `USER-${id}`;
}

// ---------------------------------------------------------------------------
// TSBUG-4 — `typeof x === 'object'` does not exclude `null`
// ---------------------------------------------------------------------------

/**
 * Returns `true` if `value` is a non-null, object-shaped value.
 *
 * BUG: `typeof null === 'object'` is `true` in JavaScript. Passing `null`
 *      returns `true`, which is semantically incorrect — `null` is not
 *      a User-shaped object.
 *
 * Fix: Add an explicit `value !== null` check:
 *      `return typeof value === 'object' && value !== null;`
 *
 * @example
 *   isUserObject(null)  // returns true today — should be false
 */
export function isUserObject(value: unknown): boolean {
  return typeof value === 'object'; // ← TSBUG-4
}

// ---------------------------------------------------------------------------
// TSBUG-5 — Array index access without bounds check
// ---------------------------------------------------------------------------

/**
 * Returns the most recently added user (last element of the array).
 *
 * BUG: When `users` is empty, `users[users.length - 1]` evaluates to
 *      `undefined` — but the return type is declared (and inferred) as
 *      `User`, not `User | undefined`. Callers will receive `undefined`
 *      typed as `User` and crash when they access any property.
 *
 * Fix: Change the return type to `User | undefined` and add an early
 *      return for the empty-array case.
 *
 * @example
 *   getLatestUser([])  // returns undefined typed as User today
 */
export function getLatestUser(users: User[]): User {
  return users[users.length - 1]; // ← TSBUG-5: undefined when empty
}

// ---------------------------------------------------------------------------
// TSBUG-6 — Value-object interface fields are mutable
// ---------------------------------------------------------------------------

/**
 * A snapshot of aggregate user statistics. Once computed this object
 * must never be mutated — it is shared across multiple components.
 *
 * BUG: None of the fields are `readonly`. Any component can accidentally
 *      write `stats.totalUsers++` and corrupt the shared snapshot without
 *      the compiler complaining.
 *
 * Fix: Prefix every field with the `readonly` modifier.
 */
export interface UserStats {
  totalUsers: number;    // ← TSBUG-6: should be readonly
  activeUsers: number;   // ← TSBUG-6: should be readonly
  inactiveUsers: number; // ← TSBUG-6: should be readonly
  adminCount: number;    // ← TSBUG-6: should be readonly
}

/**
 * Computes aggregate statistics from a list of users.
 */
export function computeStats(users: User[]): UserStats {
  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    inactiveUsers: users.filter(u => u.status === 'inactive').length,
    adminCount: users.filter(u => u.role === 'admin').length,
  };
}

// ---------------------------------------------------------------------------
// TSBUG-7 — `object` parameter type is too broad
// ---------------------------------------------------------------------------

/**
 * Serialises a filter map to a URL query-parameter string.
 *
 * BUG: The parameter is typed as `object`. `Object.entries()` on an
 *      `object`-typed value is type-safe on the keys but loses value types
 *      entirely. More importantly, `object` accepts class instances, DOM
 *      nodes, and arrays — not just plain key-value records.
 *
 * Fix: Replace `object` with `Record<string, string | number | boolean>`.
 *
 * @example
 *   serializeFilters(new Date())  // compiles today — should not
 */
export function serializeFilters(filters: object): string { // ← TSBUG-7
  return Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

// ---------------------------------------------------------------------------
// TSBUG-8 — `as any` discards the type benefit of UserUpdateRequest
// ---------------------------------------------------------------------------

/**
 * Merges an update payload onto an existing user, returning a new object.
 *
 * BUG: Casting `updates` to `any` before spreading means TypeScript no
 *      longer checks that `updates` is a valid `UserUpdateRequest`.
 *      A caller could pass `{ id: 99 }` and the compiler would not
 *      complain — defeating the entire purpose of TS-CHALLENGE-2.
 *
 * Fix: Remove the `as any` cast. If the spread does not compile without
 *      it, fix `UserUpdateRequest` (TS-CHALLENGE-2) so it is structurally
 *      compatible with `Partial<User>`.
 *
 * @example
 *   applyUpdate(user, { id: 999 })  // compiles today — should not
 */
export function applyUpdate(user: User, updates: UserUpdateRequest): User {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { ...user, ...(updates as any) }; // ← TSBUG-8
}
