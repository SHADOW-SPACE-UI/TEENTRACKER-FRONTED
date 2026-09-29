import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { savingsService } from '../services/savingsService';
import { analyticsService } from '../services/analyticsService';
import SavingsGoalCard from '../components/SavingsGoalCard';
import ChartCard from '../components/ChartCard';
import SavingsTrendChart from '../charts/SavingsTrendChart';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { PiggyBank, Plus, Target, Sparkles } from 'lucide-react';

export default function SavingsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [goals, setGoals] = useState([]);
  const [savingsTrend, setSavingsTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);

  const [form, setForm] = useState({
    title: '',
    target_amount: '',
    current_amount: '',
    target_date: '',
    notes: ''
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      const [goalsRes, trendRes] = await Promise.all([
        savingsService.getGoals(),
        analyticsService.getSavings()
      ]);

      if (goalsRes.success) setGoals(goalsRes.data);
      if (trendRes.success) setSavingsTrend(trendRes.data);
    } catch (err) {
      toast.error('Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.target_amount || Number(form.target_amount) <= 0) {
      toast.error('Please enter a valid title and target amount');
      return;
    }

    try {
      await savingsService.createGoal({
        title: form.title.trim(),
        target_amount: Number(form.target_amount),
        current_amount: Number(form.current_amount || 0),
        target_date: form.target_date || null,
        notes: form.notes || null
      });

      toast.success('Savings goal created! 🎯');
      setIsCreateOpen(false);
      setForm({ title: '', target_amount: '', current_amount: '', target_date: '', notes: '' });
      loadGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating savings goal');
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    if (!editingGoal) return;

    try {
      await savingsService.updateGoal(editingGoal.id, {
        title: editingGoal.title,
        target_amount: Number(editingGoal.target_amount),
        current_amount: Number(editingGoal.current_amount),
        target_date: editingGoal.target_date || null,
        notes: editingGoal.notes || null
      });

      toast.success('Savings goal updated!');
      setEditingGoal(null);
      loadGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating goal');
    }
  };

  const handleAddContribution = async (goalId, amount) => {
    try {
      await savingsService.addContribution(goalId, amount);
      toast.success(`Added ${formatCurrency(amount, user?.currency || 'INR')} to savings!`);
      loadGoals();
    } catch (err) {
      toast.error('Failed to add contribution');
    }
  };

  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;
    try {
      await savingsService.deleteGoal(goalToDelete.id);
      toast.success('Savings goal removed');
      setGoalToDelete(null);
      loadGoals();
    } catch (err) {
      toast.error('Failed to delete goal');
    }
  };

  const currency = user?.currency || 'INR';
  const totalSaved = goals.reduce((s, g) => s + Number(g.current_amount || 0), 0);
  const totalTarget = goals.reduce((s, g) => s + Number(g.target_amount || 0), 0);

  if (loading && goals.length === 0) {
    return <LoadingSpinner size="lg" message="Loading your savings goals..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Savings Goals</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Set targets for things you care about, track benchmarks, and turn your money habits into reality.
          </p>
        </div>

        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          Create Savings Goal
        </button>
      </div>

      {/* Summary Banner */}
      <div
        className="glass-panel gradient-card-purple"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Savings Progress
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#A855F7' }}>
              {formatCurrency(totalSaved, currency)}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              of {formatCurrency(totalTarget, currency)} total target
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Sparkles size={18} color="#A855F7" />
          <span>{goals.filter((g) => g.current_amount >= g.target_amount).length} of {goals.length} goals completed!</span>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="No savings goals yet"
          description="Whether it's new headphones, a gaming console, books, or a concert ticket—save with purpose!"
          actionLabel="Create First Goal"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {goals.map((g) => (
            <SavingsGoalCard
              key={g.id}
              goal={g}
              currency={currency}
              onAddSavings={handleAddContribution}
              onEdit={(goal) => setEditingGoal(goal)}
              onDelete={(goal) => setGoalToDelete(goal)}
            />
          ))}
        </div>
      )}

      {/* Savings Trend Chart */}
      {savingsTrend && savingsTrend.goals && savingsTrend.goals.length > 0 && (
        <ChartCard
          title="Savings Targets vs. Saved Amounts"
          subtitle="Progress towards each of your financial goals"
          height="300px"
        >
          <SavingsTrendChart data={savingsTrend.goals} currency={currency} />
        </ChartCard>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Savings Goal"
      >
        <form onSubmit={handleCreateGoal}>
          <div className="form-group">
            <label className="form-label">Goal Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Sony WH-1000XM4, Coding Course, Trip"
              required
              className="form-input"
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Target Amount *</label>
              <input
                type="number"
                value={form.target_amount}
                onChange={(e) => setForm((p) => ({ ...p, target_amount: e.target.value }))}
                placeholder="3000"
                required
                step="any"
                className="form-input"
                style={{ fontWeight: 700 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Saved Amount</label>
              <input
                type="number"
                value={form.current_amount}
                onChange={(e) => setForm((p) => ({ ...p, current_amount: e.target.value }))}
                placeholder="0"
                step="any"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Date (Optional)</label>
            <input
              type="date"
              value={form.target_date}
              onChange={(e) => setForm((p) => ({ ...p, target_date: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Why are you saving? E.g., Planning to buy during festival sale."
              rows={2}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Goal
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(editingGoal)}
        onClose={() => setEditingGoal(null)}
        title="Edit Savings Goal"
      >
        {editingGoal && (
          <form onSubmit={handleUpdateGoal}>
            <div className="form-group">
              <label className="form-label">Goal Title *</label>
              <input
                type="text"
                value={editingGoal.title}
                onChange={(e) => setEditingGoal((p) => ({ ...p, title: e.target.value }))}
                required
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Amount *</label>
                <input
                  type="number"
                  value={editingGoal.target_amount}
                  onChange={(e) => setEditingGoal((p) => ({ ...p, target_amount: e.target.value }))}
                  required
                  step="any"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Saved</label>
                <input
                  type="number"
                  value={editingGoal.current_amount}
                  onChange={(e) => setEditingGoal((p) => ({ ...p, current_amount: e.target.value }))}
                  step="any"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Date</label>
              <input
                type="date"
                value={editingGoal.target_date || ''}
                onChange={(e) => setEditingGoal((p) => ({ ...p, target_date: e.target.value }))}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setEditingGoal(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Goal
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleDeleteGoal}
        title="Delete Savings Goal"
        message={`Are you sure you want to delete the "${goalToDelete?.title}" goal?`}
        confirmLabel="Delete Goal"
      />
    </div>
  );
}
