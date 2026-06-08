import type { CreateTaskRequest, TaskItem, UpdateTaskRequest } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7127/api';
const TASKS_URL = `${API_BASE_URL}/Kanban`;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const tasksApi = {
  getAll: () => request<TaskItem[]>(TASKS_URL),
  create: (payload: CreateTaskRequest) =>
    request<TaskItem>(TASKS_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  update: (id: string, payload: UpdateTaskRequest) =>
    request<TaskItem>(`${TASKS_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  remove: (id: string) =>
    request<void>(`${TASKS_URL}/${id}`, {
      method: 'DELETE'
    })
};
