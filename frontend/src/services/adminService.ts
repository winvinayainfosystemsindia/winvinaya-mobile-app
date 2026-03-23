import api from './api';
import { type User } from '../models/auth';

const adminService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getGroups: async (): Promise<any[]> => {
    const response = await api.get('/groups/');
    return response.data;
  },

  updateUserRole: async (userId: number, role: string): Promise<User> => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  }
};

export default adminService;
