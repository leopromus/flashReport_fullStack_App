import axios from 'axios';

const API_URL = '/api/v1/users';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role) => {
    const response = await axios.get(`${API_URL}/role/${role}`);
    return response.data;
  },

  // Get admin count
  getAdminCount: async () => {
    const response = await axios.get(`${API_URL}/admins/count`);
    return response.data;
  },

  // Promote user to admin
  promoteToAdmin: async (userId) => {
    const response = await axios.patch(`${API_URL}/${userId}/promote`);
    return response.data;
  },

  // Demote admin to user
  demoteFromAdmin: async (userId) => {
    const response = await axios.patch(`${API_URL}/${userId}/demote`);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  },

  // Update current user
  updateCurrentUser: async (userData) => {
    const response = await axios.patch(`${API_URL}/profile`, userData);
    return response.data;
  },

  // Admin update user
  updateUser: async (userId, userData) => {
    const response = await axios.patch(`${API_URL}/${userId}/manage`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response.data;
  }
}; 