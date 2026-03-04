import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { User, UserCreateRequest, UserUpdateRequest, UserRole, UserStatus } from 'shared-lib';

/**
 * TS-CHALLENGE-1 ─ Generic HTTP types
 *
 * All methods below use `any` for their request / response types, which
 * defeats TypeScript's static analysis and allows silent runtime errors.
 *
 * Task: Replace every `any` occurrence with the correct, specific type.
 *   - `getUsers`    → `Observable<User[]>`
 *   - `getUserById` → `Observable<User>`
 *   - `createUser`  → accept `UserCreateRequest`, return `Observable<User>`
 *   - `updateUser`  → accept `UserUpdateRequest` (fix TS-2 first!), return `Observable<User>`
 *   - `deleteUser`  → `Observable<void>`
 *   - `searchUsers` → fix the broken overload signature described below
 *
 * After typing all methods, verify that the call-sites in
 * `user-list.component.ts` and `user-detail.component.ts` still compile
 * without additional casts.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * BUG: The `filters` parameter type is `object`, which accepts anything —
   *      including keys that don't correspond to real `User` fields.
   *      A caller could write `searchUsers('', { nonExistent: true })` and
   *      TypeScript would not complain.
   *
   * Task: Narrow `filters` so that only valid `User` filter keys are accepted.
   *       Specifically, only `role` and `status` should be filterable, and
   *       their values must match `UserRole` and `UserStatus` respectively.
   *
   * Note: The mock interceptor ignores query params and always returns the
   *       full list — that is intentional for this exercise.
   */
  searchUsers(query: string, filters: object = {}): Observable<any> {
    let params = new HttpParams().set('q', query);
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) params = params.set(k, String(v));
    });
    return this.http.get(this.apiUrl, { params });
  }
}
