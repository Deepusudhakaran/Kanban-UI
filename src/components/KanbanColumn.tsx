import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TaskItem, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: TaskItem[];
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
}

export function KanbanColumn({ status, title, tasks, onEdit, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: 'column', status }
  });

  return (
    <section ref={setNodeRef} className={`kanban-column ${isOver ? 'over' : ''}`}>
      <header>
        <h2>{title}</h2>
        <span>{tasks.length}</span>
      </header>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && <p className="empty-state">Drop tasks here</p>}
        </div>
      </SortableContext>
    </section>
  );
}
