import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { formatCurrency } from '../utils/formatters';
import DashboardCard from '../components/DashboardCard';
import ChartCard from '../components/ChartCard';
import CategoryPieChart from '../charts/CategoryPieChart';
import SpendingTimelineChart from '../charts/SpendingTimelineChart';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flame,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Target
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { refreshKey } = useOutletContext() || {};

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [insightsData, setInsightsData] = useState([]);
  const [timelineRange, setTimelineRange] = useState('30days');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [sumRes, catRes, timeRes, insRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getCategories(),
          analyticsService.getTrends(timelineRange),
          analyticsService.getInsights()
        ]);

        if (sumRes.success) setSummary(sumRes.data);
        if (catRes.success) setCategoryData(catRes.data.breakdown || []);
        if (timeRes.success) setTimelineData(timeRes.data.timeline || []);
        if (insRes.success) setInsightsData(insRes.data.insights || []);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [refreshKey, timelineRange]);

  if (loading && !summary) {
    return <LoadingSpinner size="lg" message="Loading your dashboard..." />;
  }

  const { finance, productivity } = summary || {
    finance: { totalIncome: 0, totalExpenses: 0, currentBalance: 0, totalSavings: 0, monthlyBudget: 0, budgetSpent: 0, budgetRemaining: 0 },
    productivity: { tasksTodayCount: 0, completedTasksToday: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0, currentStreak: 0 }
  };

  const currency = user?.currency || 'INR';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Welcome Banner */}
      <div
        className="glass-panel gradient-card-blue"
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            Hey, {user?.name || 'Explorer'}! 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Here is your financial and daily habit progress for today.
          </p>
        </div>

        {!user?.streak_disabled && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F59E0B'
              }}
            >
              <Flame size={20} fill="#F59E0B" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {productivity.currentStreak}-Day Streak
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Keep completing tasks daily!
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Finance Overview Grid */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Financial Overview</h3>
          <Link to="/expenses" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            View All Expenses <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid-cards">
          <DashboardCard
            title="Current Balance"
            value={formatCurrency(finance.currentBalance, currency)}
            subtitle="Income minus Total Expenses"
            icon={Wallet}
            iconColor="#6366F1"
            iconBg="rgba(99, 102, 241, 0.15)"
          />
          <DashboardCard
            title="Total Income"
            value={formatCurrency(finance.totalIncome, currency)}
            subtitle="Allowance & gifts"
            icon={ArrowDownLeft}
            iconColor="#10B981"
            iconBg="rgba(16, 185, 129, 0.15)"
          />
          <DashboardCard
            title="Total Expenses"
            value={formatCurrency(finance.totalExpenses, currency)}
            subtitle={`Avg ${formatCurrency(finance.averageDailySpending || 0, currency)}/day`}
            icon={ArrowUpRight}
            iconColor="#F43F5E"
            iconBg="rgba(244, 63, 94, 0.15)"
          />
          <DashboardCard
            title="Total Saved"
            value={formatCurrency(finance.totalSavings, currency)}
            subtitle={`${finance.savingsRate || 0}% overall savings rate`}
            icon={PiggyBank}
            iconColor="#A855F7"
            iconBg="rgba(168, 85, 247, 0.15)"
          />
        </div>
      </section>

      {/* Productivity Overview Grid */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Productivity Overview</h3>
          <Link to="/tasks" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            View To-Do List <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid-cards">
          <DashboardCard
            title="Tasks Today"
            value={`${productivity.completedTasksToday} / ${productivity.tasksTodayCount}`}
            subtitle={
              productivity.tasksTodayCount > 0
                ? `${Math.round((productivity.completedTasksToday / productivity.tasksTodayCount) * 100)}% done today`
                : 'No tasks scheduled today'
            }
            icon={CheckCircle2}
            iconColor="#3B82F6"
            iconBg="rgba(59, 130, 246, 0.15)"
          />
          <DashboardCard
            title="Pending Tasks"
            value={productivity.pendingTasks}
            subtitle="Active to-dos remaining"
            icon={Clock}
            iconColor="#F59E0B"
            iconBg="rgba(245, 158, 11, 0.15)"
          />
          <DashboardCard
            title="Overdue Tasks"
            value={productivity.overdueTasks}
            subtitle={productivity.overdueTasks === 0 ? 'All caught up!' : 'Needs your attention'}
            icon={AlertCircle}
            iconColor={productivity.overdueTasks > 0 ? '#F43F5E' : '#10B981'}
            iconBg={productivity.overdueTasks > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)'}
          />
          <DashboardCard
            title="Completion Rate"
            value={`${productivity.taskCompletionRate}%`}
            subtitle={`${productivity.completedTasks} total tasks finished`}
            icon={Target}
            iconColor="#10B981"
            iconBg="rgba(16, 185, 129, 0.15)"
          />
        </div>
      </section>

      {/* Monthly Budget Glance Bar */}
      {finance.monthlyBudget > 0 && (
        <section
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Monthly Budget Progress</span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {formatCurrency(finance.budgetSpent, currency)} spent of {formatCurrency(finance.monthlyBudget, currency)}
            </span>
          </div>

          <ProgressBar
            value={finance.budgetSpent}
            max={finance.monthlyBudget}
            color={finance.budgetSpent > finance.monthlyBudget ? '#F43F5E' : '#6366F1'}
            height="10px"
            showLabel
            labelPrefix={`${finance.budgetUsagePercentage}% used • ${formatCurrency(finance.budgetRemaining, currency)} remaining`}
          />
        </section>
      )}

      {/* Charts Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Spending over time */}
        <ChartCard
          title="Spending & Income Timeline"
          subtitle="Cash flow trends over time"
          actions={
            <div style={{ display: 'flex', gap: '4px' }}>
              {['7days', '30days', '3months'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimelineRange(range)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    backgroundColor: timelineRange === range ? 'var(--primary-600)' : 'var(--bg-main)',
                    color: timelineRange === range ? '#FFFFFF' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {range === '7days' ? '7D' : range === '30days' ? '30D' : '3M'}
                </button>
              ))}
            </div>
          }
        >
          <SpendingTimelineChart data={timelineData} currency={currency} />
        </ChartCard>

        {/* Expenses by Category Donut */}
        <ChartCard
          title="Expenses by Category"
          subtitle="Distribution across spending types"
        >
          <CategoryPieChart data={categoryData} currency={currency} />
        </ChartCard>
      </section>

      {/* Smart Spending & Habit Insights */}
      {insightsData.length > 0 && (
        <section
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Lightbulb size={20} color="#F59E0B" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Smart Insights & Habit Tips
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {insightsData.slice(0, 3).map((item) => (
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
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.675rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary-600)',
                      fontWeight: 600
                    }}
                  >
                    {item.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {item.message}
                </p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '1rem', fontStyle: 'italic' }}>
            * Educational suggestions to assist your daily habits; not formal financial advice.
          </p>
        </section>
      )}
    </div>
  );
}
