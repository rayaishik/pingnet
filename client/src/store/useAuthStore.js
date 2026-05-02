import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('pingnet_user')) || null,
  token: localStorage.getItem('pingnet_token') || null,
  isAuthenticated: !!localStorage.getItem('pingnet_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, token } = data.data;
      localStorage.setItem('pingnet_token', token);
      localStorage.setItem('pingnet_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      const { user, token } = data.data;
      localStorage.setItem('pingnet_token', token);
      localStorage.setItem('pingnet_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('pingnet_token');
    localStorage.removeItem('pingnet_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  fetchMe: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      const user = data.data;
      localStorage.setItem('pingnet_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch {
      get().logout();
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
