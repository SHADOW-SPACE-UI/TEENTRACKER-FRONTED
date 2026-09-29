import api from './api';

export const budgetService = {
  async getBudgets() {
    const res = await api.get('/budgets');
    return res.data;
  },

  async getCurrentBudget(month) {
    const res = await api.get('/budgets/current', { params: { month } });
    return res.data;
  },

  async saveBudget(data) {
    const res = await api.post('/budgets', data);
    return res.data;
  },

  async deleteBudget(id) {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  }
};
