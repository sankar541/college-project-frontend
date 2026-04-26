import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', { currentPassword, newPassword });
    return response.data;
  },

  updateProfile: async (photo) => {
    const response = await api.put('/auth/update-profile', { photo });
    return response.data;
  }
};
