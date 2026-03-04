/**
 * TS-CHALLENGE-4 ─ Generic Constraints & Return Types
 *
 * This module provides generic collection helpers used across the application.
 * It currently contains two TypeScript bugs that weaken type safety.
 */

// ---------------------------------------------------------------------------
// sortBy
// ---------------------------------------------------------------------------

/**
 * Returns a new sorted array without mutating the original.
 *
 * BUG: The type parameter `K` has no constraint, so the compiler cannot
 *      verify that `key` is a valid property of `T`. An invalid key
 *      (e.g. a typo) silently compiles and produces `undefined` comparisons
 *      at runtime.
 *
 * Task: Add the correct generic constraint so that passing a key that does
 *       not exist on `T` is a compile-time error.
 *
 * @example
 *   sortBy(users, 'lastName')          // ✔ should compile
 *   sortBy(users, 'nonExistentField')  // ✖ should be a compile error
 */
export function sortBy<T, K>(
  items: T[],
  key: K,
  direction: 'asc' | 'desc' = 'asc',
): T[] {
  return [...items].sort((a, b) => {
    const valA = (a as Record<string, unknown>)[key as string];
    const valB = (b as Record<string, unknown>)[key as string];
    if (valA == null || valB == null) return 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cmp = (valA as any) < (valB as any) ? -1 : (valA as any) > (valB as any) ? 1 : 0;
    return direction === 'asc' ? cmp : -cmp;
  });
}

// ---------------------------------------------------------------------------
// groupBy
// ---------------------------------------------------------------------------

/**
 * Groups an array of items by the value of a given key.
 *
 * BUG: The return type is `any`, which means callers get no type information
 *      about the grouped structure and lose all downstream type safety.
 *
 * Task: Replace the `any` return type with the precise, fully-typed
 *       equivalent. Callers must be able to rely on the compiler when
 *       accessing grouped entries.
 *
 * @example
 *   const byRole = groupBy(users, 'role');
 *   byRole['admin'];         // ✔ should be `User[]`
 *   byRole['admin'][0].id;   // ✔ should be `number`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupBy<T>(items: T[], key: keyof T): any {
  return items.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      (acc[groupKey] ??= []).push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

// ---------------------------------------------------------------------------
// filterBy (bonus)
// ---------------------------------------------------------------------------

/**
 * Returns items whose `key` strictly equals `value`.
 *
 * Task (bonus): The current signature accepts any value for `value`.
 *               Tighten it so that `value` is constrained to the actual
 *               type of `T[K]`, making heterogeneous comparisons impossible.
 *
 * @example
 *   filterBy(users, 'role', 'admin')   // ✔ UserRole is assignable
 *   filterBy(users, 'role', 42)        // ✖ should be a compile error
 */
export function filterBy<T, K extends keyof T>(
  items: T[],
  key: K,
  // BUG: value should be `T[K]`, not `unknown`
  value: unknown,
): T[] {
  return items.filter(item => item[key] === value);
}

// ---------------------------------------------------------------------------
// TSBUG-14 — reduce accumulator typed as `any[]` instead of `T[]`
// ---------------------------------------------------------------------------

/**
 * Returns a new array with duplicate entries (by key) removed, preserving
 * the first occurrence of each distinct key value.
 *
 * BUG: The `reduce` accumulator is initialised as `[] as any[]`, which
 *      widens the return type from `T[]` to `any[]`. Callers lose all
 *      element-type information — the result is effectively untyped.
 *
 * Fix: Change `[] as any[]` to `[] as T[]` so TypeScript correctly infers
 *      `T[]` as the return type, and remove the inner `as any[]` cast.
 *
 * @example
 *   const unique = uniqueBy(users, 'email');
 *   unique[0].id;  // type error today (any) — should be `number` after fix
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function uniqueBy<T, K extends keyof T>(items: T[], key: K): any[] { // ← TSBUG-14: return type should be T[]
  const seen = new Set<T[K]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return items.reduce((acc: any[], item) => { // ← TSBUG-14: accumulator should be T[]
    if (!seen.has(item[key])) {
      seen.add(item[key]);
      acc.push(item);
    }
    return acc;
  }, [] as any[]); // ← TSBUG-14
}
