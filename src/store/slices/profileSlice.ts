import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios from 'axios';
import type { User, UpdateUserRequest } from '../../types';

const API_URL = 'http://localhost:8080/api/v1';

// Configure axios interceptor for authentication
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data: UpdateUserRequest, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/users/profile`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating profile:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Admin actions
export const fetchAllUsers = createAsyncThunk(
  'profile/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching users:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk(
  'profile/updateUser',
  async ({ id, ...data }: UpdateUserRequest & { id: number }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/users/${id}/manage`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating user:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'profile/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      return id;
    } catch (error: any) {
      console.error('Error deleting user:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

interface ProfileState {
  user: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  users: [],
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = profileSlice.actions;

export const selectProfile = (state: RootState) => state.profile?.user;
export const selectUsers = (state: RootState) => state.profile?.users || [];
export const selectProfileLoading = (state: RootState) => state.profile?.isLoading || false;
export const selectProfileError = (state: RootState) => state.profile?.error;

export default profileSlice.reducer; 