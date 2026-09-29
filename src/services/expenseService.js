import api from './api';

export const expenseService = {
  async getExpenses(params = {}) {
    const res = await api.get('/expenses', { params });
    return res.data;
  },

  async getExpenseById(id) {
    const res = await api.get(`/expenses/${id}`);
    return res.data;
  },

  async createExpense(data) {
    const res = await api.post('/expenses', data);
    return res.data;
  },

  async updateExpense(id, data) {
    const res = await api.put(`/expenses/${id}`, data);
    return res.data;
  },

  async deleteExpense(id) {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  },

  async getRecurring() {
    const res = await api.get('/expenses/recurring');
    return res.data;
  },

  async createRecurring(data) {
    const res = await api.post('/expenses/recurring', data);
    return res.data;
  },

  async deleteRecurring(id) {
    const res = await api.delete(`/expenses/recurring/${id}`);
    return res.data;
  }
};
