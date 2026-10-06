import { BaseService } from './baseService'

export type User = {
  id: number
  name: string
  email: string
  role: string
  date: string
  status: 'Active' | 'Inactive'
}

const userSeed: User[] = [
  { id: 1, name: 'Prasad Nalawade', email: 'prasad@example.com', role: 'Admin', status: 'Active', date: '15 Jan 2024' },
  { id: 2, name: 'Vijay Borde', email: 'vijay@example.com', role: 'Manager', status: 'Active', date: '12 Jan 2024' },
  { id: 3, name: 'Sneha Patil', email: 'sneha@example.com', role: 'Designer', status: 'Inactive', date: '22 Jan 2024' },
  { id: 4, name: 'Amit Sharma', email: 'amit@example.com', role: 'Developer', status: 'Active', date: '10 Feb 2024' },
  { id: 5, name: 'Rohit Deshmukh', email: 'rohit@example.com', role: 'Analyst', status: 'Active', date: '18 Feb 2024' },
]

export const userService = new BaseService<User>('users', userSeed)
