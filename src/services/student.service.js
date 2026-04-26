import api from './api';

export const studentService = {
  getStudentDashboardStats: async (regNo) => {
    try {
      const response = await api.get('/analytics/student-stats');
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getMyResults: async (regno) => {
    const response = await api.get(`/student-performance/${regno}`);
    return response.data;
  }
};
