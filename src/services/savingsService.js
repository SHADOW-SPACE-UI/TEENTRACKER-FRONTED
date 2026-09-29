import api from './api';

export const savingsService = {
  async getGoals() {
    const res = await api.get('/savings-goals');
    return res.data;
  },

  async getGoalById(id) {
    const res = await api.get(`/savings-goals/${id}`);
    return res.data;
  },

  async createGoal(data) {
    const res = await api.post('/savings-goals', data);
    return res.data;
  },

  async updateGoal(id, data) {
    const res = await api.put(`/savings-goals/${id}`, data);
    return res.data;
  },

  async addContribution(id, amount) {
    const res = await api.post(`/savings-goals/${id}/contribute`, { amount });
    return res.data;
  },

  async deleteGoal(id) {
    const res = await api.delete(`/savings-goals/${id}`);
    return res.data;
  }
};
