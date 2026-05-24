import { FormEvent, useEffect, useState } from 'react';
import type { CreateTaskRequest, TaskItem, TaskStatus } from '../types/task';

interface TaskFormProps {
  task?: TaskItem | null;
  defaultStatus?: TaskStatus;
  onSubmit: (payload: CreateTaskRequest) => Promise<void>;
  onCancel?: () => void;
}

export function TaskForm({ task, defaultStatus = 'ToDo', onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setStatus(task?.status ?? defaultStatus);
  }, [task, defaultStatus]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSubmit({ title: title.trim(), description: description.trim(), status });
      if (!task) {
        setTitle('');
        setDescription('');
        setStatus(defaultStatus);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        maxLength={120}
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        rows={3}
        maxLength={500}
      />
      <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
        <option value="ToDo">To Do</option>
        <option value="InProgress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      {error && <p className="form-error">{error}</p>}
      <div className="form-actions">
        <button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : task ? 'Update Task' : 'Add Task'}</button>
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
