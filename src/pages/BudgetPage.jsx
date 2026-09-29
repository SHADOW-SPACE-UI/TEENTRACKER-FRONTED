import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { budgetService } from '../services/budgetService';
import { incomeService } from '../services/incomeService';
import { analyticsService } from '../services/analyticsService';
import BudgetCard from '../components/BudgetCard';
import ChartCard from '../components/ChartCard';
import BudgetVsActualChart from '../charts/BudgetVsActualChart';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, getCurrentMonth, formatDate } from '../utils/formatters';
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from '../constants';
import { Wallet, Plus, ArrowDownLeft, Trash2 } from 'lucide-react';

export default function BudgetPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [budgetComparison, setBudgetComparison] = useState(null);
  const [incomeList, setIncomeList] = useState([]);

  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);

  // Budget form state
  const [budgetForm, setBudgetForm] = useState({
    month: getCurrentMonth(),
    total_budget: '',
    categories: []
  });

  // Income form state
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    source: 'Allowance',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    notes: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [compRes, incRes] = await Promise.all([
        analyticsService.getBudgetComparison(),
        incomeService.getIncome()
      ]);

      if (compRes.success) {
        setBudgetComparison(compRes.data);
        if (compRes.data.hasBudget) {
          setBudgetForm({
            month: compRes.data.month,
            total_budget: compRes.data.totalBudget,
            categories: compRes.data.categories.map((c) => ({
              category: c.category,
              allocated_amount: c.budget
            }))
          });
        } else {
          // Preset suggestions
          setBudgetForm({
            month: getCurrentMonth(),
            total_budget: 4500,
            categories: [
              { category: 'Food', allocated_amount: 1500 },
              { category: 'Transport', allocated_amount: 600 },
              { category: 'Entertainment', allocated_amount: 800 },
              { category: 'Education', allocated_amount: 600 },
              { category: 'Shopping', allocated_amount: 500 }
            ]
          });
        }
      }

      if (incRes.success) {
        setIncomeList(incRes.data);
      }
    } catch (err) {
      toast.error('Failed to load budget and income data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!budgetForm.total_budget || Number(budgetForm.total_budget) < 0) {
      toast.error('Please enter a valid monthly budget amount');
      return;
    }

    try {
      await budgetService.saveBudget({
        month: budgetForm.month,
        total_budget: Number(budgetForm.total_budget),
        categories: budgetForm.categories.map((c) => ({
          category: c.category,
          allocated_amount: Number(c.allocated_amount || 0)
        }))
      });
      toast.success('Budget saved successfully!');
      setIsEditBudgetOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving budget');
    }
  };

  const handleCategoryAmountChange = (index, value) => {
    const updated = [...budgetForm.categories];
    updated[index].allocated_amount = value;
    setBudgetForm((prev) => ({ ...prev, categories: updated }));
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!incomeForm.amount || Number(incomeForm.amount) <= 0) {
      toast.error('Please enter a valid income amount');
      return;
    }

    try {
      await incomeService.createIncome({
        amount: Number(incomeForm.amount),
        source: incomeForm.source,
        date: incomeForm.date,
        recurring: incomeForm.recurring,
        notes: incomeForm.notes || null
      });
      toast.success('Income recorded!');
      setIsAddIncomeOpen(false);
      setIncomeForm({
        amount: '',
        source: 'Allowance',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
        notes: ''
      });
      loadData();
    } catch (err) {
      toast.error('Failed to record income');
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await incomeService.deleteIncome(id);
      toast.success('Income entry removed');
      loadData();
    } catch (err) {
      toast.error('Failed to delete income');
    }
  };

  const currency = user?.currency || 'INR';

  if (loading && !budgetComparison) {
    return <LoadingSpinner size="lg" message="Loading budget management..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Budget & Income</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Set monthly targets, compare category caps with actual expenses, and record allowances.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setIsAddIncomeOpen(true)} className="btn btn-secondary btn-sm">
            <ArrowDownLeft size={16} />
            + Record Income
          </button>
          <button onClick={() => setIsEditBudgetOpen(true)} className="btn btn-primary btn-sm">
            <Wallet size={16} />
            {budgetComparison?.hasBudget ? 'Edit Monthly Budget' : 'Set Budget'}
          </button>
        </div>
      </div>

      {/* Main Budget Card */}
      <BudgetCard
        budgetData={budgetComparison}
        currency={currency}
        onEditBudget={() => setIsEditBudgetOpen(true)}
      />

      {/* Budget vs Actual Comparison Chart */}
      {budgetComparison?.hasBudget && budgetComparison.categories.length > 0 && (
        <ChartCard
          title="Budget vs. Actual Spending"
          subtitle="Visual comparison of allocated limits against current expenditures"
          height="320px"
        >
          <BudgetVsActualChart data={budgetComparison.categories} currency={currency} />
        </ChartCard>
      )}

      {/* Income Records Section */}
      <section
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Income & Allowance Log</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total Income Recorded: {formatCurrency(incomeList.reduce((s, i) => s + Number(i.amount), 0), currency)}
            </span>
          </div>

          <button onClick={() => setIsAddIncomeOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={16} />
            Add Income
          </button>
        </div>

        {incomeList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No income entries recorded yet. Add your allowance or part-time earnings above!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {incomeList.map((inc) => (
              <div
                key={inc.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{inc.source}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(inc.date)} {inc.notes ? `• ${inc.notes}` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, color: '#10B981', fontSize: '1rem' }}>
                    +{formatCurrency(inc.amount, currency)}
                  </span>
                  <button
                    onClick={() => handleDeleteIncome(inc.id)}
                    className="btn-icon"
                    style={{ color: 'var(--accent-rose)', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={isEditBudgetOpen}
        onClose={() => setIsEditBudgetOpen(false)}
        title="Configure Monthly Budget"
        maxWidth="600px"
      >
        <form onSubmit={handleSaveBudget}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Month</label>
              <input
                type="month"
                value={budgetForm.month}
                onChange={(e) => setBudgetForm((p) => ({ ...p, month: e.target.value }))}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Monthly Budget *</label>
              <input
                type="number"
                value={budgetForm.total_budget}
                onChange={(e) => setBudgetForm((p) => ({ ...p, total_budget: e.target.value }))}
                placeholder="e.g. 5000"
                required
                step="any"
                className="form-input"
                style={{ fontWeight: 700 }}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>
            Category Caps (Optional)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
            {budgetForm.categories.map((cat, idx) => (
              <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '120px', fontSize: '0.85rem', fontWeight: 600 }}>
                  {cat.category}
                </span>
                <input
                  type="number"
                  value={cat.allocated_amount}
                  onChange={(e) => handleCategoryAmountChange(idx, e.target.value)}
                  placeholder="0.00"
                  step="any"
                  className="form-input"
                  style={{ height: '36px', fontSize: '0.85rem' }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsEditBudgetOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Budget
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Income Modal */}
      <Modal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        title="Record Income / Allowance"
      >
        <form onSubmit={handleAddIncome}>
          <div className="form-group">
            <label className="form-label">Amount *</label>
            <input
              type="number"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm((p) => ({ ...p, amount: e.target.value }))}
              placeholder="0.00"
              required
              step="any"
              className="form-input"
              style={{ fontSize: '1.25rem', fontWeight: 700 }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Income Source</label>
            <select
              value={incomeForm.source}
              onChange={(e) => setIncomeForm((p) => ({ ...p, source: e.target.value }))}
              className="form-select"
            >
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date Received</label>
            <input
              type="date"
              value={incomeForm.date}
              onChange={(e) => setIncomeForm((p) => ({ ...p, date: e.target.value }))}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <input
              type="text"
              value={incomeForm.notes}
              onChange={(e) => setIncomeForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="e.g. Allowance from mom, tutoring fee"
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setIsAddIncomeOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Income
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
