import axios from 'axios';

const api = axios.create({
  baseURL: 'https://college-project-backend-dbx5.onrender.com/api',
  withCredentials: true, // Important for cookies/sessions if used
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
