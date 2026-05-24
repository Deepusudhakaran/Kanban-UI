import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import type { TaskItem } from '../types/task';

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <article ref={setNodeRef} style={style} className={`task-card ${isDragging ? 'dragging' : ''}`}>
      <div className="drag-handle" {...attributes} {...listeners} aria-label="Drag task">⋮⋮</div>
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
      </div>
      <div className="task-actions">
        <button type="button" onClick={() => onEdit(task)}>Edit</button>
        <button type="button" className="danger" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </article>
  );
}
