import axios from 'axios';

// Base URL for API - adjust this based on your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  refresh: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
};

// Files API
export const filesAPI = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/files/my');
    return response.data;
  },
  delete: async (fileId: number) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },
  download: async (fileId: number) => {
    const response = await api.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
  preview: async (fileId: number) => {
    const response = await api.get(`/files/${fileId}/preview`);
    return response.data;
  },
};

// Mapping API
export const mappingAPI = {
  list: async (fileId: number) => {
    const response = await api.get(`/files/${fileId}/mapping`);
    return response.data;
  },
  create: async (fileId: number, data: { sourceColumn: string; targetField: string }) => {
    const response = await api.post(`/files/${fileId}/mapping`, data);
    return response.data;
  },
  update: async (fileId: number, mappingId: number, data: { targetField: string }) => {
    const response = await api.put(`/files/${fileId}/mapping/${mappingId}`, data);
    return response.data;
  },
  delete: async (fileId: number) => {
    const response = await api.delete(`/files/${fileId}/mapping`);
    return response.data;
  },
};

// Credits API
export const creditsAPI = {
  getBalance: async () => {
    const response = await api.get('/credits/my');
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/credits/history');
    return response.data;
  },
  add: async (amount: number) => {
    const response = await api.post('/credits/add', { amount });
    return response.data;
  },
};

// AI Analysis API
export const aiAPI = {
  analyze: async (fileId: number) => {
    const response = await api.post(`/ai/${fileId}/analyze`);
    return response.data;
  },
};

export default api;
