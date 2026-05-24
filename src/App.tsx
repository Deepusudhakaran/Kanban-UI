import { KanbanBoard } from './components/KanbanBoard';
import { TasksProvider } from './context/TasksContext';

export default function App() {
  return (
    <TasksProvider>
      <KanbanBoard />
    </TasksProvider>
  );
}
