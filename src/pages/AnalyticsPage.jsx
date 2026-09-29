import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { formatCurrency } from '../utils/formatters';
import ChartCard from '../components/ChartCard';
import CategoryPieChart from '../charts/CategoryPieChart';
import SpendingTimelineChart from '../charts/SpendingTimelineChart';
import CategoryBarChart from '../charts/CategoryBarChart';
import BudgetVsActualChart from '../charts/BudgetVsActualChart';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  TrendingUp,
  Tag,
  DollarSign,
  PieChart,
  Lightbulb,
  Award
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [budgetComp, setBudgetComp] = useState(null);
  const [insights, setInsights] = useState([]);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [sumRes, catRes, timeRes, budRes, insRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getCategories(),
          analyticsService.getTrends(timeRange),
          analyticsService.getBudgetComparison(),
          analyticsService.getInsights()
        ]);

        if (sumRes.success) setSummary(sumRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (timeRes.success) setTimeline(timeRes.data);
        if (budRes.success) setBudgetComp(budRes.data);
        if (insRes.success) setInsights(insRes.data.insights || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [timeRange]);

  const currency = user?.currency || 'INR';

  if (loading && !summary) {
    return <LoadingSpinner size="lg" message="Crunching your spending numbers..." />;
  }

  const { finance = {} } = summary || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Spending & Habit Analytics</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Deep dive into category distributions, cashflow velocity, and behavioral insights.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid-cards">
        <DashboardCard
          title="Daily Average"
          value={formatCurrency(finance.averageDailySpending || 0, currency)}
          subtitle="Typical day spending"
          icon={DollarSign}
          iconColor="#6366F1"
          iconBg="rgba(99, 102, 241, 0.15)"
        />
        <DashboardCard
          title="Weekly Average"
          value={formatCurrency(finance.averageWeeklySpending || 0, currency)}
          subtitle="7-day projected burn"
          icon={TrendingUp}
          iconColor="#10B981"
          iconBg="rgba(16, 185, 129, 0.15)"
        />
        <DashboardCard
          title="Top Category"
          value={finance.topExpenseCategory ? finance.topExpenseCategory.category : 'None'}
          subtitle={
            finance.topExpenseCategory
              ? `${formatCurrency(finance.topExpenseCategory.amount, currency)} spent`
              : 'No expenses yet'
          }
          icon={Tag}
          iconColor="#EC4899"
          iconBg="rgba(236, 72, 153, 0.15)"
        />
        <DashboardCard
          title="Largest Expense"
          value={
            finance.largestExpense
              ? formatCurrency(finance.largestExpense.amount, currency)
              : '₹0'
          }
          subtitle={finance.largestExpense?.merchant || finance.largestExpense?.category || 'No data'}
          icon={Award}
          iconColor="#F59E0B"
          iconBg="rgba(245, 158, 11, 0.15)"
        />
      </div>

      {/* Chart 1: Cashflow Timeline */}
      <ChartCard
        title="Cashflow Over Time"
        subtitle="Tracking daily and monthly shifts in expenses vs income"
        height="320px"
        actions={
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { label: '7D', value: '7days' },
              { label: '30D', value: '30days' },
              { label: '3M', value: '3months' },
              { label: '6M', value: '6months' },
              { label: '1Y', value: '1year' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setTimeRange(tab.value)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: timeRange === tab.value ? 'var(--primary-600)' : 'var(--bg-main)',
                  color: timeRange === tab.value ? '#FFFFFF' : 'var(--text-muted)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      >
        <SpendingTimelineChart data={timeline?.timeline || []} currency={currency} />
      </ChartCard>

      {/* Charts Grid: Donut + Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <ChartCard
          title="Expense Categories (Donut)"
          subtitle="Relative breakdown across all categories"
          height="300px"
        >
          <CategoryPieChart data={categories?.breakdown || []} currency={currency} />
        </ChartCard>

        <ChartCard
          title="Category Rankings (Bar)"
          subtitle="Highest to lowest spending category"
          height="300px"
        >
          <CategoryBarChart data={categories?.breakdown || []} currency={currency} />
        </ChartCard>
      </div>

      {/* Chart 4: Budget vs Actual */}
      {budgetComp && budgetComp.hasBudget && (
        <ChartCard
          title="Budget vs Actual Spending"
          subtitle={`Allocated budgets versus real expenditure for ${budgetComp.month}`}
          height="320px"
        >
          <BudgetVsActualChart data={budgetComp.categories || []} currency={currency} />
        </ChartCard>
      )}

      {/* Smart Spending Suggestions List */}
      <section
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Lightbulb size={22} color="#F59E0B" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            Automated Spending Insights
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {insights.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {item.title}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary-600)',
                    fontWeight: 600
                  }}
                >
                  {item.category}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.message}
              </p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '1.25rem', fontStyle: 'italic' }}>
          * These insights are generated using rule-based algorithms to foster healthy teen budgeting habits. They do not constitute certified financial advisory.
        </p>
      </section>
    </div>
  );
}
