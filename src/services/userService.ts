import axios from 'axios';

export interface User {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  role: 'ADMIN' | 'USER';
}

const API_URL = '/api/v1/users';

export const userService = {
  getAllUsers: async () => {
    const response = await axios.get<{ data: User[] }>(API_URL);
    return response.data;
  },

  getUsersByRole: async (role: string) => {
    const response = await axios.get<{ data: User[] }>(`${API_URL}/role/${role}`);
    return response.data;
  },

  getAdminCount: async () => {
    const response = await axios.get<{ data: number }>(`${API_URL}/admins/count`);
    return response.data;
  },

  promoteToAdmin: async (userId: number) => {
    const response = await axios.patch<{ data: User }>(`${API_URL}/${userId}/promote`);
    return response.data;
  },

  demoteFromAdmin: async (userId: number) => {
    const response = await axios.patch<{ data: User }>(`${API_URL}/${userId}/demote`);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axios.get<{ data: User }>(`${API_URL}/profile`);
    return response.data;
  },

  updateCurrentUser: async (userData: Partial<User>) => {
    const response = await axios.patch<{ data: User }>(`${API_URL}/profile`, userData);
    return response.data;
  },

  updateUser: async (userId: number, userData: Partial<User>) => {
    const response = await axios.patch<{ data: User }>(`${API_URL}/${userId}/manage`, userData);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await axios.delete<{ data: void }>(`${API_URL}/${userId}`);
    return response.data;
  }
}; 