import api from './api';

export const teacherService = {
  getTeacherDashboardStats: async () => {
    try {
      const response = await api.get('/analytics/teacher-stats');
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getTeacherResultAnalysis: async () => {
    try {
      const response = await api.get('/analytics/teacher-analysis');
      return response.data.data;
    } catch (error) {
      console.error("Teacher analysis fetching failed", error);
      throw error;
    }
  },

  getStudentsBySubject: async (subjectId) => {
    const response = await api.get(`/marks/students/${subjectId}`);
    return response.data.data || response.data; // should be list of students
  },

  submitMarks: async (marksArray) => {
    // marksArray = [{ registrationNumber, subjectId, marks }]
    const promises = marksArray.map(m => api.post('/marks', m));
    await Promise.all(promises);
    return true;
  },

  getAnalyticsByBranch: async (branch) => {
    const response = await api.get(`/analytics/teacher-performance/${branch}`);
    return response.data.data || response.data;
  }
};
