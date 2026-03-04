/**
 * TS-CHALLENGE-3 ─ Discriminated Unions & Type Guards
 *
 * Every HTTP call in this application should be wrapped in `ApiResponse<T>`,
 * a discriminated union that makes error-handling explicit and type-safe.
 *
 * The discriminant property is `success` (a boolean literal on each branch).
 */

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * BUG: This type guard is always `true` for any non-null object.
 *      It does NOT correctly narrow the union — `ApiError` objects will
 *      pass this guard and callers will incorrectly access `.data`.
 *
 * Task: Fix `isApiSuccess` so that it narrows `ApiResponse<T>` to
 *       `ApiSuccess<T>` using the discriminant property, then update
 *       `UserService` to wrap responses with `ApiResponse<T>` and
 *       unwrap them safely using this guard.
 *
 * Hint: Remember that a discriminated union guard must inspect the
 *       *literal-typed* discriminant, not the shape of the object.
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  // BUG: checks object identity, not the discriminant ─ always returns true
  return typeof response === 'object' && response !== null;
}

// ---------------------------------------------------------------------------
// TSBUG-15 — `||` instead of `&&` treats every status code as success
// ---------------------------------------------------------------------------

/**
 * Wraps a raw HTTP response body and status code into an `ApiResponse<T>`
 * discriminated union.
 *
 * BUG: The condition uses `||` (OR) instead of `&&` (AND).
 *      `statusCode >= 200 || statusCode <= 299` is a tautology — it is
 *      `true` for every possible integer, including 404 and 500.
 *      Every response is therefore wrapped as `ApiSuccess<T>`, making
 *      error handling completely unreachable.
 *
 * Fix: Replace `||` with `&&`:
 *      `if (statusCode >= 200 && statusCode <= 299) { ... }`
 *
 * @example
 *   wrapResponse(null, 404)  // returns ApiSuccess today — should be ApiError
 */
export function wrapResponse<T>(body: T, statusCode: number): ApiResponse<T> {
  if (statusCode >= 200 || statusCode <= 299) { // ← TSBUG-15: || should be &&
    return { success: true, data: body };
  }
  return {
    success: false,
    error: 'Request failed',
    statusCode,
  };
}
