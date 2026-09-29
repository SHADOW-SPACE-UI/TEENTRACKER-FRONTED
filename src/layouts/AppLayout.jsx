import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { expenseService } from '../services/expenseService';
import { taskService } from '../services/taskService';

export default function AppLayout() {
  const { user } = useAuth();
  const toast = useToast();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleQuickExpenseSubmit = async (formData) => {
    try {
      await expenseService.createExpense(formData);
      toast.success('Expense recorded successfully!');
      setIsExpenseModalOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create expense');
    }
  };

  const handleQuickTaskSubmit = async (formData) => {
    try {
      await taskService.createTask(formData);
      toast.success('Task created successfully!');
      setIsTaskModalOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Desktop Sidebar (hidden on mobile via CSS media query) */}
      <div className="desktop-sidebar-container">
        <Sidebar
          onQuickExpense={() => setIsExpenseModalOpen(true)}
          onQuickTask={() => setIsTaskModalOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingBottom: '70px' }}>
        <Navbar streakDisabled={user?.streak_disabled} />

        <main style={{ flex: 1, padding: '1.5rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <Outlet context={{ refreshKey, triggerRefresh: () => setRefreshKey((k) => k + 1) }} />
        </main>

        {/* Mobile Navigation */}
        <div className="mobile-nav-container">
          <MobileNavbar onQuickExpense={() => setIsExpenseModalOpen(true)} />
        </div>
      </div>

      {/* Quick Add Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Quick Add Expense"
      >
        <ExpenseForm
          onSubmit={handleQuickExpenseSubmit}
          onCancel={() => setIsExpenseModalOpen(false)}
        />
      </Modal>

      {/* Quick Add Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Quick Add Task"
      >
        <TaskForm
          onSubmit={handleQuickTaskSubmit}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>

      <style>{`
        .desktop-sidebar-container {
          display: block;
        }
        .mobile-nav-container {
          display: none;
        }
        @media (max-width: 900px) {
          .desktop-sidebar-container {
            display: none;
          }
          .mobile-nav-container {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
