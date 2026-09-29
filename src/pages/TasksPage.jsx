import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { taskService } from '../services/taskService';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, CheckSquare, Flame, Search } from 'lucide-react';

export default function TasksPage() {
  const { user } = useAuth();
  const toast = useToast();
  const { refreshKey, triggerRefresh } = useOutletContext() || {};

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('due_date');
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks({
        filter: activeFilter,
        category: selectedCategory,
        sortBy,
        search: searchTerm
      });

      if (res.success) {
        setTasks(res.data);
        if (res.meta && res.meta.currentStreak !== undefined) {
          setStreak(res.meta.currentStreak);
        }
      }
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeFilter, selectedCategory, sortBy, searchTerm, refreshKey]);

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await taskService.toggleComplete(taskId, completed);
      toast.success(completed ? 'Task completed! Keep up the momentum! 🎉' : 'Task reopened.');
      fetchTasks();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      toast.error('Failed to update task state');
    }
  };

  const handleCreateTask = async (data) => {
    try {
      await taskService.createTask(data);
      toast.success('Task created successfully!');
      setIsCreateOpen(false);
      fetchTasks();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleUpdateTask = async (data) => {
    try {
      await taskService.updateTask(editingTask.id, data);
      toast.success('Task updated!');
      setEditingTask(null);
      fetchTasks();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      toast.success('Task deleted');
      fetchTasks();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  // Calculations for today's tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.due_date === todayStr);
  const completedTodayCount = todayTasks.filter((t) => t.status === 'Completed').length;
  const todayPercentage = todayTasks.length > 0 ? Math.round((completedTodayCount / todayTasks.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>To-Do & Productivity</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Organize daily schoolwork, personal routines, and financial habit milestones.
          </p>
        </div>

        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Progress & Streak Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              Today's Progress: {completedTodayCount} of {todayTasks.length} tasks completed
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {todayTasks.length === 0 ? 'No tasks scheduled for today.' : `${todayPercentage}% completed`}
            </div>
          </div>

          {!user?.streak_disabled && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: streak > 0 ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-main)',
                color: streak > 0 ? '#D97706' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              <Flame size={18} fill={streak > 0 ? '#F59E0B' : 'none'} color={streak > 0 ? '#F59E0B' : 'currentColor'} />
              <span>{streak}-Day Streak</span>
            </div>
          )}
        </div>

        {todayTasks.length > 0 && (
          <ProgressBar
            value={completedTodayCount}
            max={todayTasks.length}
            color="#10B981"
            height="8px"
          />
        )}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search
          size={16}
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks by title, description, or category..."
          className="form-input"
          style={{ paddingLeft: '38px', height: '40px', fontSize: '0.875rem' }}
        />
      </div>

      {/* Filter Tabs */}
      <TaskFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Task List */}
      {loading ? (
        <LoadingSpinner size="md" message="Loading tasks..." />
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={(task) => setEditingTask(task)}
          onDelete={handleDeleteTask}
          onAddTask={() => setIsCreateOpen(true)}
        />
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>
    </div>
  );
}
