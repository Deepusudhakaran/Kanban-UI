import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import { useTasks } from '../context/TasksContext';
import type { TaskItem, TaskStatus } from '../types/task';
import { KanbanColumn } from './KanbanColumn';
import { TaskForm } from './TaskForm';

const columns: Array<{ status: TaskStatus; title: string }> = [
  { status: 'ToDo', title: 'To Do' },
  { status: 'InProgress', title: 'In Progress' },
  { status: 'Done', title: 'Done' }
];

export function KanbanBoard() {
  const { tasks, isLoading, error, createTask, updateTask, deleteTask, moveTask } = useTasks();
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const tasksByStatus = useMemo(() => {
    return columns.reduce<Record<TaskStatus, TaskItem[]>>((acc, column) => {
      acc[column.status] = tasks.filter((task) => task.status === column.status);
      return acc;
    }, { ToDo: [], InProgress: [], Done: [] });
  }, [tasks]);

  const findTask = (id: string) => tasks.find((task) => task.id === id) ?? null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(findTask(String(event.active.id)));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const task = findTask(String(active.id));
    if (!task) return;

    const overData = over.data.current;
    const newStatus = overData?.type === 'column'
      ? overData.status as TaskStatus
      : overData?.task?.status as TaskStatus | undefined;

    if (!newStatus) return;

    try {
      setOperationError(null);
      await moveTask(task, newStatus);
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to move task');
    }
  };

  const handleEditSubmit = async (payload: { title: string; description: string; status: TaskStatus }) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, payload);
    setEditingTask(null);
  };

  const handleDelete = async (task: TaskItem) => {
    const confirmed = window.confirm(`Delete task "${task.title}"?`);
    if (!confirmed) return;

    try {
      setOperationError(null);
      await deleteTask(task.id);
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Full-stack assignment</p>
          <h1>Kanban Task Board</h1>
          <p>Create, edit, delete and move tasks across workflow columns.</p>
        </div>
      </section>

      <section className="panel">
        <h2>{editingTask ? 'Edit task' : 'Add new task'}</h2>
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleEditSubmit : createTask}
          onCancel={editingTask ? () => setEditingTask(null) : undefined}
        />
      </section>

      {(error || operationError) && <div className="alert">{error || operationError}</div>}
      {isLoading ? <div className="loading">Loading tasks...</div> : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTask(null)}
        >
          <section className="board">
            {columns.map((column) => (
              <KanbanColumn
                key={column.status}
                status={column.status}
                title={column.title}
                tasks={tasksByStatus[column.status]}
                onEdit={setEditingTask}
                onDelete={handleDelete}
              />
            ))}
          </section>
          <DragOverlay>
            {activeTask ? <div className="task-card overlay"><h3>{activeTask.title}</h3></div> : null}
          </DragOverlay>
        </DndContext>
      )}
    </main>
  );
}
