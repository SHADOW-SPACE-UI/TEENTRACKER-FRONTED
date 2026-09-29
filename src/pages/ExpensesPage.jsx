import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { expenseService } from '../services/expenseService';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseForm from '../components/ExpenseForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { Plus, Receipt, Repeat, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExpensesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const { refreshKey, triggerRefresh } = useOutletContext() || {};

  const [expenses, setExpenses] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 15
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'recurring'
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [recurringForm, setRecurringForm] = useState({
    title: '',
    amount: '',
    category: 'Subscription',
    frequency: 'Monthly',
    billing_day: 1
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseService.getExpenses(filters);
      if (res.success) {
        setExpenses(res.data);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recurring expenses
  const fetchRecurring = async () => {
    try {
      const res = await expenseService.getRecurring();
      if (res.success) {
        setRecurring(res.data);
      }
    } catch (err) {
      console.error('Error fetching recurring:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters, refreshKey]);

  useEffect(() => {
    fetchRecurring();
  }, [refreshKey]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      limit: 15
    });
  };

  const handleCreateExpense = async (data) => {
    try {
      await expenseService.createExpense(data);
      toast.success('Expense recorded successfully!');
      setIsCreateOpen(false);
      fetchExpenses();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error recording expense');
    }
  };

  const handleUpdateExpense = async (data) => {
    try {
      await expenseService.updateExpense(editingExpense.id, data);
      toast.success('Expense updated!');
      setEditingExpense(null);
      fetchExpenses();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating expense');
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      await expenseService.deleteExpense(expenseToDelete.id);
      toast.success('Expense deleted');
      setExpenseToDelete(null);
      fetchExpenses();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const handleCreateRecurring = async (e) => {
    e.preventDefault();
    if (!recurringForm.title || !recurringForm.amount) {
      toast.error('Please enter title and amount');
      return;
    }
    try {
      await expenseService.createRecurring({
        ...recurringForm,
        amount: Number(recurringForm.amount),
        billing_day: Number(recurringForm.billing_day)
      });
      toast.success('Recurring subscription added!');
      setIsRecurringModalOpen(false);
      setRecurringForm({ title: '', amount: '', category: 'Subscription', frequency: 'Monthly', billing_day: 1 });
      fetchRecurring();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add recurring expense');
    }
  };

  const handleDeleteRecurring = async (id) => {
    try {
      await expenseService.deleteRecurring(id);
      toast.success('Recurring subscription removed');
      fetchRecurring();
    } catch (err) {
      toast.error('Failed to remove recurring subscription');
    }
  };

  const currency = user?.currency || 'INR';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Expense Tracker</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Keep track of every rupee, manage categories, and audit recurring subscriptions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsRecurringModalOpen(true)}
            className="btn btn-secondary btn-sm"
          >
            <Repeat size={16} />
            + Subscription
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Tabs: All Transactions vs Recurring Subscriptions */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'all' ? 'var(--primary-50)' : 'transparent',
            color: activeTab === 'all' ? 'var(--primary-600)' : 'var(--text-muted)'
          }}
        >
          All Expenses ({meta.total || expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('recurring')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'recurring' ? 'var(--primary-50)' : 'transparent',
            color: activeTab === 'recurring' ? 'var(--primary-600)' : 'var(--text-muted)'
          }}
        >
          Recurring Subscriptions ({recurring.length})
        </button>
      </div>

      {activeTab === 'all' ? (
        <>
          {/* Filters */}
          <ExpenseFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          {/* List Content */}
          {loading ? (
            <LoadingSpinner size="md" message="Loading transactions..." />
          ) : expenses.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No expenses found"
              description="Add your first expense or clear filters to view your spending history."
              actionLabel="Add Expense"
              onAction={() => setIsCreateOpen(true)}
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="desktop-table-container glass-panel" style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <ExpenseTable
                  expenses={expenses}
                  currency={currency}
                  onEdit={(exp) => setEditingExpense(exp)}
                  onDelete={(exp) => setExpenseToDelete(exp)}
                />
              </div>

              {/* Mobile Card List View */}
              <div className="mobile-card-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {expenses.map((exp) => (
                  <ExpenseCard
                    key={exp.id}
                    expense={exp}
                    currency={currency}
                    onEdit={(e) => setEditingExpense(e)}
                    onDelete={(e) => setExpenseToDelete(e)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {meta.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Page {meta.page} of {meta.totalPages} ({meta.total} total)
                  </span>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      disabled={meta.page <= 1}
                      onClick={() => handleFilterChange('page', meta.page - 1)}
                      className="btn btn-secondary btn-sm"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <button
                      disabled={meta.page >= meta.totalPages}
                      onClick={() => handleFilterChange('page', meta.page + 1)}
                      className="btn btn-secondary btn-sm"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        /* Recurring Subscriptions View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Estimated Monthly Recurring Total
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '0.2rem' }}>
                {formatCurrency(
                  recurring.reduce((s, r) => s + Number(r.amount), 0),
                  currency
                )}/month
              </div>
            </div>

            <button onClick={() => setIsRecurringModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              Add Subscription
            </button>
          </div>

          {recurring.length === 0 ? (
            <EmptyState
              icon={Repeat}
              title="No recurring subscriptions"
              description="Keep track of Spotify, Netflix, mobile data recharges, or gaming passes."
              actionLabel="Add Subscription"
              onAction={() => setIsRecurringModalOpen(true)}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {recurring.map((rec) => (
                <div
                  key={rec.id}
                  className="glass-panel"
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{rec.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {rec.category} • Billed every {rec.billing_day}th of month
                      </span>
                    </div>

                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                      -{formatCurrency(rec.amount, currency)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                    <button
                      onClick={() => handleDeleteRecurring(rec.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}
                    >
                      Cancel / Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Expense Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Record New Expense"
      >
        <ExpenseForm
          onSubmit={handleCreateExpense}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={Boolean(editingExpense)}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        {editingExpense && (
          <ExpenseForm
            initialData={editingExpense}
            onSubmit={handleUpdateExpense}
            onCancel={() => setEditingExpense(null)}
          />
        )}
      </Modal>

      {/* Recurring Subscription Modal */}
      <Modal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        title="Add Recurring Subscription"
      >
        <form onSubmit={handleCreateRecurring}>
          <div className="form-group">
            <label className="form-label">Service / Name *</label>
            <input
              type="text"
              value={recurringForm.title}
              onChange={(e) => setRecurringForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Spotify, YouTube Premium, Cloud Storage"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount *</label>
            <input
              type="number"
              value={recurringForm.amount}
              onChange={(e) => setRecurringForm((p) => ({ ...p, amount: e.target.value }))}
              placeholder="0.00"
              required
              step="any"
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Frequency</label>
              <select
                value={recurringForm.frequency}
                onChange={(e) => setRecurringForm((p) => ({ ...p, frequency: e.target.value }))}
                className="form-select"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Billing Day of Month</label>
              <input
                type="number"
                min="1"
                max="31"
                value={recurringForm.billing_day}
                onChange={(e) => setRecurringForm((p) => ({ ...p, billing_day: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsRecurringModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Subscription
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteExpense}
        title="Delete Expense"
        message={`Are you sure you want to delete this expense of ${formatCurrency(expenseToDelete?.amount || 0, currency)}?`}
        confirmLabel="Delete Expense"
      />

      <style>{`
        .desktop-table-container {
          display: block;
        }
        .mobile-card-container {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-table-container {
            display: none;
          }
          .mobile-card-container {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}
