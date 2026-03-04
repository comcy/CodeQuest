export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive';

export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
}

/**
 * TS-CHALLENGE-2 ─ Utility Types
 *
 * This type is supposed to represent a *partial* update payload for an existing
 * user. The caller should only be able to mutate profile fields — NOT the
 * immutable identity fields (`id`, `email`, `createdAt`).
 *
 * BUG: The current definition is too permissive. It allows callers to pass
 *      `id`, `email`, and `createdAt` in an update request, which must never
 *      reach the backend.
 *
 * Task: Fix `UserUpdateRequest` using only built-in TypeScript utility types
 *       so that `id`, `email`, and `createdAt` are excluded and every remaining
 *       field is optional.
 */
export type UserUpdateRequest = Partial<User>; // ← BUG: overly broad

/**
 * Represents how a User is projected for display in a data table.
 * `fullName` is derived from `firstName + lastName`; the raw name fields
 * are deliberately omitted to avoid duplication.
 *
 * Task (bonus): Express `UserTableRow` purely through TypeScript utility
 *               types — without manually re-listing every `User` property.
 */
export interface UserTableRow {
  id: number;
  fullName: string; // derived: `${firstName} ${lastName}`
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  createdAt: string;
}

/**
 * TSBUG-13 — String literal union contains a non-existent property
 *
 * `UserSortField` is intended to enumerate the subset of `User` keys that
 * are safe to pass to `sortBy()`. However, the literal `'fullName'` is
 * included even though `User` has no `fullName` property (it has separate
 * `firstName` and `lastName` fields). Any call to
 * `sortBy(users, 'fullName')` silently sorts by `undefined` instead of
 * producing a compile-time error — even after TS-CHALLENGE-4 is fixed.
 *
 * Fix: Remove `'fullName'` from the union. If a sort-by-full-name feature
 *      is needed, derive the field name from an actual key of `User`:
 *      `type UserSortField = keyof Omit<User, 'id' | 'createdAt'>`
 */
export type UserSortField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'role'
  | 'status'
  | 'fullName'; // ← TSBUG-13: 'fullName' does not exist on User
