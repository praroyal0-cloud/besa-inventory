import { BaseService } from './baseService'

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'

export type Task = {
  id: number
  title: string
  assignee: string
  priority: 'High' | 'Medium' | 'Low'
  status: TaskStatus
  dueDate: string
}

const taskSeed: Task[] = [
  { id: 1, title: 'Finalize safety briefing', assignee: 'Prasad', priority: 'High', status: 'Pending', dueDate: '2026-09-30' },
  { id: 2, title: 'Review alert logs', assignee: 'Sneha', priority: 'Medium', status: 'In Progress', dueDate: '2026-10-02' },
  { id: 3, title: 'Update access matrix', assignee: 'Amit', priority: 'High', status: 'Completed', dueDate: '2026-09-27' },
  { id: 4, title: 'Prepare training docs', assignee: 'Vijay', priority: 'Low', status: 'Pending', dueDate: '2026-10-05' },
]

export const taskService = new BaseService<Task>('tasks', taskSeed)
