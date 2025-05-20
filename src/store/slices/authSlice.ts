import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, LoginFormData, RegisterFormData } from '../../types';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, credentials);
      const { token, ...user } = response.data.data;
      localStorage.setItem('token', token);
      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/signup',
  async (userData: RegisterFormData, { rejectWithValue }) => {
    try {
      // Log the exact data being sent
      console.log('Registration payload:', JSON.stringify(userData, null, 2));

      // Ensure role is explicitly set in the request body
      const requestData = {
        ...userData,
        role: userData.role || 'USER' // Ensure role is included and defaulted if missing
      };

      console.log('Sending registration request with data:', JSON.stringify(requestData, null, 2));
      const response = await axios.post(`${API_URL}/auth/signup`, requestData);
      console.log('Registration response:', JSON.stringify(response.data, null, 2));
      
      const { token, ...user } = response.data.data;
      localStorage.setItem('token', token);
      return { user, token };
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: { id: number; firstname: string; lastname: string; email: string; phoneNumber: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/v1/users/${userData.id}`, userData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update user');
    }
  }
);

const token = localStorage.getItem('token');

const initialState: AuthState = {
  user: null,
  token: token,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 