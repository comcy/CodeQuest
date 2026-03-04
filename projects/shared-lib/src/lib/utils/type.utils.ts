/**
 * TS-CHALLENGE-5 ─ Mapped Types & Conditional Types
 *
 * This module contains advanced TypeScript type utilities. Some are
 * intentionally incomplete or broken — fix them to make the tests pass.
 */

import type { UserCreateRequest } from '../models/user.model';

// ---------------------------------------------------------------------------
// DeepReadonly<T>
// ---------------------------------------------------------------------------

/**
 * Makes every property of `T` — and every nested object — `readonly`.
 *
 * BUG: This implementation is *shallow*: it marks top-level properties
 *      `readonly` but does NOT recurse into nested objects or arrays.
 *
 * Task: Rewrite `DeepReadonly<T>` so that it applies recursively to
 *       object-typed properties AND to the element type of arrays.
 *
 * @example
 *   type Config = { server: { host: string; port: number }; tags: string[] };
 *   type ROConfig = DeepReadonly<Config>;
 *   // ROConfig['server']['host'] should be readonly  ← broken today
 *   // ROConfig['tags'][0]         should be readonly  ← broken today
 */
export type DeepReadonly<T> = {
  // BUG: no recursion — nested objects remain mutable
  readonly [K in keyof T]: T[K];
};

// ---------------------------------------------------------------------------
// FormModel<T>
// ---------------------------------------------------------------------------

/**
 * Maps a plain data interface to its Angular strongly-typed reactive form
 * equivalent, where every leaf value becomes `FormControl<V | null>`.
 *
 * Angular's `FormBuilder.group()` infers the form type from an object whose
 * values are `[initialValue, validators?]` tuples or plain values. This
 * utility mirrors that: it converts each property type `V` to
 * `FormControl<V | null>` so that typed `FormGroup<FormModel<T>>` can be
 * declared without manually enumerating every control.
 *
 * Task: Complete the mapped type below. Import it in
 *       `user-form-dialog.component.ts` and change the untyped `FormGroup`
 *       to `FormGroup<FormModel<UserFormFields>>`.
 */
import type { FormControl } from '@angular/forms';

export type FormModel<T> = {
  // TODO: map each key K of T to FormControl<T[K] | null>
  [K in keyof T]: FormControl<T[K] | null>;
};

// ---------------------------------------------------------------------------
// Concrete form shape for the user form dialog
// ---------------------------------------------------------------------------

/**
 * Fields managed by the create / edit user form.
 * Deliberately separate from `UserCreateRequest` because the form holds an
 * `isActive` boolean that is converted to `UserStatus` on save.
 */
export interface UserFormFields
  extends Omit<UserCreateRequest, 'status'> {
  isActive: boolean;
}
