import api from './api';

export const incomeService = {
  async getIncome(params = {}) {
    const res = await api.get('/income', { params });
    return res.data;
  },

  async createIncome(data) {
    const res = await api.post('/income', data);
    return res.data;
  },

  async updateIncome(id, data) {
    const res = await api.put(`/income/${id}`, data);
    return res.data;
  },

  async deleteIncome(id) {
    const res = await api.delete(`/income/${id}`);
    return res.data;
  }
};
