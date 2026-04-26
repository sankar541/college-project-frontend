import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/analytics/overview');
      return response.data.data;
    } catch (error) {
      console.error("Stats fetching failed.", error);
      throw error;
    }
  },

  getBranchResultAnalysis: async (branch, semester) => {
    try {
      const url = semester ? `/analytics/branch/${branch}?semester=${semester}` : `/analytics/branch/${branch}`;
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error("Result Analysis mapping failed.", error);
      throw error;
    }
  },

  createStudent: async (studentData) => {
    // Assuming backend returns { data }
    const response = await api.post('/students', studentData);
    return response.data;
  },

  createTeacher: async (teacherData) => {
     const response = await api.post('/teachers', teacherData);
     return response.data;
  },

  createSubject: async (subjectData) => {
    const response = await api.post('/subjects', subjectData);
    return response.data;
  },

  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data.data || response.data;
  },

  getStudents: async (branch, semester) => {
    let url = '/students';
    const params = new URLSearchParams();
    if (branch) params.append('branch', branch);
    if (semester) params.append('semester', semester);
    
    if (params.toString()) {
       url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data.data || response.data;
  },

  promoteStudent: async (id, newSemester) => {
    const response = await api.put(`/students/${id}/promote`, { newSemester });
    return response.data;
  },

  getTeachers: async () => {
    const response = await api.get('/teachers');
    return response.data.data;
  }
};
