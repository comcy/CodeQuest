import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
  { id: 1, firstName: 'Anna', lastName: 'Schmidt', email: 'anna.schmidt@example.com', role: 'admin', status: 'active', department: 'Engineering', createdAt: '2024-01-15T10:30:00Z' },
  { id: 2, firstName: 'Ben', lastName: 'Müller', email: 'ben.mueller@example.com', role: 'editor', status: 'active', department: 'Marketing', createdAt: '2024-02-20T14:00:00Z' },
  { id: 3, firstName: 'Clara', lastName: 'Weber', email: 'clara.weber@example.com', role: 'viewer', status: 'active', department: 'Sales', createdAt: '2024-03-05T09:15:00Z' },
  { id: 4, firstName: 'David', lastName: 'Fischer', email: 'david.fischer@example.com', role: 'editor', status: 'inactive', department: 'Engineering', createdAt: '2024-03-10T11:45:00Z' },
  { id: 5, firstName: 'Elena', lastName: 'Braun', email: 'elena.braun@example.com', role: 'admin', status: 'active', department: 'HR', createdAt: '2024-04-01T08:00:00Z' },
  { id: 6, firstName: 'Felix', lastName: 'Hoffmann', email: 'felix.hoffmann@example.com', role: 'viewer', status: 'active', department: 'Engineering', createdAt: '2024-04-12T16:30:00Z' },
  { id: 7, firstName: 'Greta', lastName: 'Schulz', email: 'greta.schulz@example.com', role: 'editor', status: 'active', department: 'Design', createdAt: '2024-05-03T13:20:00Z' },
  { id: 8, firstName: 'Hans', lastName: 'Koch', email: 'hans.koch@example.com', role: 'viewer', status: 'inactive', department: 'Sales', createdAt: '2024-05-18T10:00:00Z' },
  { id: 9, firstName: 'Ida', lastName: 'Bauer', email: 'ida.bauer@example.com', role: 'editor', status: 'active', department: 'Marketing', createdAt: '2024-06-07T15:45:00Z' },
  { id: 10, firstName: 'Jan', lastName: 'Wagner', email: 'jan.wagner@example.com', role: 'admin', status: 'active', department: 'Engineering', createdAt: '2024-06-20T09:30:00Z' },
  { id: 11, firstName: 'Katrin', lastName: 'Richter', email: 'katrin.richter@example.com', role: 'viewer', status: 'active', department: 'HR', createdAt: '2024-07-01T11:00:00Z' },
  { id: 12, firstName: 'Lukas', lastName: 'Klein', email: 'lukas.klein@example.com', role: 'editor', status: 'active', department: 'Design', createdAt: '2024-07-15T14:15:00Z' },
  { id: 13, firstName: 'Mia', lastName: 'Wolf', email: 'mia.wolf@example.com', role: 'viewer', status: 'inactive', department: 'Marketing', createdAt: '2024-08-02T08:45:00Z' },
  { id: 14, firstName: 'Noah', lastName: 'Schröder', email: 'noah.schroeder@example.com', role: 'editor', status: 'active', department: 'Engineering', createdAt: '2024-08-20T16:00:00Z' },
  { id: 15, firstName: 'Olivia', lastName: 'Neumann', email: 'olivia.neumann@example.com', role: 'admin', status: 'active', department: 'Sales', createdAt: '2024-09-05T10:30:00Z' },
  { id: 16, firstName: 'Paul', lastName: 'Schwarz', email: 'paul.schwarz@example.com', role: 'viewer', status: 'active', department: 'Engineering', createdAt: '2024-09-18T13:00:00Z' },
  { id: 17, firstName: 'Rosa', lastName: 'Zimmermann', email: 'rosa.zimmermann@example.com', role: 'editor', status: 'active', department: 'HR', createdAt: '2024-10-01T09:00:00Z' },
  { id: 18, firstName: 'Stefan', lastName: 'Krüger', email: 'stefan.krueger@example.com', role: 'viewer', status: 'inactive', department: 'Design', createdAt: '2024-10-15T15:30:00Z' },
  { id: 19, firstName: 'Tina', lastName: 'Hartmann', email: 'tina.hartmann@example.com', role: 'editor', status: 'active', department: 'Marketing', createdAt: '2024-11-02T11:15:00Z' },
  { id: 20, firstName: 'Uwe', lastName: 'Lang', email: 'uwe.lang@example.com', role: 'admin', status: 'active', department: 'Engineering', createdAt: '2024-11-20T14:45:00Z' },
];
