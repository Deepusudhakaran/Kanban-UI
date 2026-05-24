export type TaskStatus = 'ToDo' | 'InProgress' | 'Done';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface UpdateTaskRequest extends CreateTaskRequest {}
