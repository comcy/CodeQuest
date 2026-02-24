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
