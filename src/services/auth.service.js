import api from './api';

export const authService = {
  // ================= LOGIN =================
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });

    // ✅ STORE TOKEN
    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  },
  
  // ================= LOGOUT =================
  logout: async () => {
    const response = await api.post('/auth/logout');

    // ✅ REMOVE TOKEN
    localStorage.removeItem("token");

    return response.data;
  },

  // ================= UPDATE PASSWORD =================
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', { currentPassword, newPassword });
    return response.data;
  },

  // ================= UPDATE PROFILE =================
  updateProfile: async (photo) => {
    const response = await api.put('/auth/update-profile', { photo });
    return response.data;
  }
};
