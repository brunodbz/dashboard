import axios from 'axios';
import type { User, CorrelationResult, DashboardStats, DataSource } from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  register: async (data: { username: string; email: string; password: string; role: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Dashboard
export const dashboardAPI = {
  getCriticalAlerts: async (hours: number = 24): Promise<CorrelationResult[]> => {
    const response = await api.get('/dashboard/critical-alerts', { params: { hours } });
    return response.data;
  },
  
  getStatistics: async (hours: number = 24): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/statistics', { params: { hours } });
    return response.data;
  },
  
  getTimeline: async (hours: number = 24) => {
    const response = await api.get('/dashboard/timeline', { params: { hours } });
    return response.data;
  },
};

// Admin
export const adminAPI = {
  listUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  createUser: async (data: any) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },
  
  updateUserRole: async (userId: number, role: string) => {
    const response = await api.patch(`/admin/users/${userId}/role`, null, { params: { role } });
    return response.data;
  },
  
  deleteUser: async (userId: number) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
  
  listDataSources: async (): Promise<DataSource[]> => {
    const response = await api.get('/admin/sources');
    return response.data;
  },
  
  createDataSource: async (data: any) => {
    const response = await api.post('/admin/sources', data);
    return response.data;
  },
  
  updateDataSource: async (sourceId: number, data: any) => {
    const response = await api.patch(`/admin/sources/${sourceId}`, data);
    return response.data;
  },
  
  deleteDataSource: async (sourceId: number) => {
    const response = await api.delete(`/admin/sources/${sourceId}`);
    return response.data;
  },
};

// Export
export const exportAPI = {
  exportExcel: async (hours: number = 24) => {
    const response = await api.get('/export/excel', {
      params: { hours },
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'soc_critical_alerts.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  
  exportPDF: async (hours: number = 24) => {
    const response = await api.get('/export/pdf', {
      params: { hours },
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'soc_critical_alerts.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default api;
