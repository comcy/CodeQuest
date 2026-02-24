import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { User } from '../models/user.model';
import { MOCK_USERS } from '../mock-data/users.data';

let users: User[] = [...MOCK_USERS];
let nextId = users.length + 1;

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;

  // GET /api/users
  if (url === '/api/users' && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: [...users] }));
  }

  // GET /api/users/:id
  const getMatch = url.match(/\/api\/users\/(\d+)$/);
  if (getMatch && req.method === 'GET') {
    const id = parseInt(getMatch[1], 10);
    const user = users.find(u => u.id === id);
    if (user) {
      return of(new HttpResponse({ status: 200, body: { ...user } }));
    }
    return of(new HttpResponse({ status: 404, body: { message: 'User not found' } }));
  }

  // POST /api/users
  if (url === '/api/users' && req.method === 'POST') {
    const body = req.body as Record<string, unknown>;
    const newUser: User = {
      ...body,
      id: nextId++,
      createdAt: new Date().toISOString(),
    } as User;
    users.push(newUser);
    return of(new HttpResponse({ status: 201, body: newUser })).pipe(delay(300));
  }

  // PUT /api/users/:id
  const putMatch = url.match(/\/api\/users\/(\d+)$/);
  if (putMatch && req.method === 'PUT') {
    const id = parseInt(putMatch[1], 10);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      const body = req.body as Record<string, unknown>;
      users[index] = { ...users[index], ...body };
      return of(new HttpResponse({ status: 200, body: users[index] })).pipe(delay(250));
    }
    return of(new HttpResponse({ status: 404, body: { message: 'User not found' } })).pipe(delay(100));
  }

  // DELETE /api/users/:id
  const deleteMatch = url.match(/\/api\/users\/(\d+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const id = parseInt(deleteMatch[1], 10);
    return of(new HttpResponse({ status: 200, body: { message: 'User deleted' } })).pipe(delay(200));
  }

  return next(req);
};
