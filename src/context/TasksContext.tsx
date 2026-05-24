import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tasksApi } from '../api/tasksApi';
import type { CreateTaskRequest, TaskItem, TaskStatus, UpdateTaskRequest } from '../types/task';

interface TasksContextValue {
  tasks: TaskItem[];
  isLoading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
  createTask: (payload: CreateTaskRequest) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (task: TaskItem, status: TaskStatus) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const createTask = useCallback(async (payload: CreateTaskRequest) => {
    const created = await tasksApi.create(payload);
    setTasks((current) => [...current, created]);
  }, []);

  const updateTask = useCallback(async (id: string, payload: UpdateTaskRequest) => {
    const updated = await tasksApi.update(id, payload);
    setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await tasksApi.remove(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const moveTask = useCallback(async (task: TaskItem, status: TaskStatus) => {
    if (task.status === status) return;

    const previousTasks = tasks;
    const optimisticTask = { ...task, status, updatedAt: new Date().toISOString() };
    setTasks((current) => current.map((item) => (item.id === task.id ? optimisticTask : item)));

    try {
      const updated = await tasksApi.update(task.id, {
        title: task.title,
        description: task.description,
        status
      });
      setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)));
    } catch (err) {
      setTasks(previousTasks);
      throw err;
    }
  }, [tasks]);

  const value = useMemo(
    () => ({ tasks, isLoading, error, refreshTasks, createTask, updateTask, deleteTask, moveTask }),
    [tasks, isLoading, error, refreshTasks, createTask, updateTask, deleteTask, moveTask]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
