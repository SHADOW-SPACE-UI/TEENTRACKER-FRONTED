import api from './api';

export const analyticsService = {
  async getSummary() {
    const res = await api.get('/analytics/summary');
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/analytics/categories');
    return res.data;
  },

  async getTrends(range = '30days') {
    const res = await api.get('/analytics/trends', { params: { range } });
    return res.data;
  },

  async getBudgetComparison() {
    const res = await api.get('/analytics/budget');
    return res.data;
  },

  async getSavings() {
    const res = await api.get('/analytics/savings');
    return res.data;
  },

  async getInsights() {
    const res = await api.get('/analytics/insights');
    return res.data;
  }
};
