import React, { useState } from 'react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';
import { CheckSquare } from 'lucide-react';

export default function TaskList({ tasks, onToggleComplete, onEdit, onDelete, onAddTask }) {
  const [taskToDelete, setTaskToDelete] = useState(null);

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No tasks found"
        description="You're all caught up! Add a new task to stay organized and achieve your goals."
        actionLabel="Add Task"
        onAction={onAddTask}
      />
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={(t) => setTaskToDelete(t)}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            onDelete(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        confirmLabel="Delete Task"
      />
    </>
  );
}
