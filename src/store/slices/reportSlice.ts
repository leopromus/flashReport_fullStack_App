import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Report, ReportState } from '../../types';
import type { RootState } from '../../store'; // Make sure '../store' exists and exports RootState. Update the path if your store file is elsewhere, e.g. './store' or '../store/index'
import type { CreateReportFormData } from '../../types';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

// Configure axios interceptor for authentication
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchReports = createAsyncThunk(
  'reports/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching reports from API...');
      const response = await axios.get(`${API_URL}/red-flags`);
      console.log('API Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching reports:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch reports');
    }
  }
);

export const createReport = createAsyncThunk(
  'reports/create',
  async (reportData: CreateReportFormData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Create the report request object
      const reportRequest = {
        title: reportData.title,
        type: reportData.type,
        location: reportData.location,
        comment: reportData.comment
      };
      
      // Append the report data as a JSON blob with the key 'report'
      formData.append('report', new Blob([JSON.stringify(reportRequest)], {
        type: 'application/json'
      }));

      // Add images if present
      if (reportData.images && reportData.images.length > 0) {
        reportData.images.forEach((image: File) => {
          formData.append('images', image);
        });
      }

      // Add videos if present
      if (reportData.videos && reportData.videos.length > 0) {
        reportData.videos.forEach((video) => {
          formData.append('videos', video);
        });
      }

      const response = await axios.post(`${API_URL}/red-flags`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.data;
    } catch (error: any) {
      console.error('Create report error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to create report');
    }
  }
);

export const updateReport = createAsyncThunk(
  'reports/update',
  async ({ id, data }: { id: number; data: Partial<Report> }, { rejectWithValue }) => {
    try {
      // Ensure status updates go through the proper endpoint
      if ('status' in data) {
        throw new Error('Status updates must use updateStatus endpoint');
      }
      const response = await axios.patch(`${API_URL}/red-flags/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Update report error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to update report');
    }
  }
);

export const updateStatus = createAsyncThunk(
  'reports/updateStatus',
  async ({ id, status }: { id: number; status: Report['status'] }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/red-flags/${id}/status`, { 
        status: status 
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Update status error:', error.response?.data || error.message);
      // Extract the actual error message from the response
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message ||
                         'Failed to update status';
      
      // If it's a notification error but the status was updated, return success
      if (errorMessage.includes('Failed to send email') && error.response?.data?.data) {
        return error.response.data.data;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/red-flags/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete report');
    }
  }
);

const initialState: ReportState = {
  reports: [],
  selectedReport: null,
  isLoading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    selectReport: (state, action) => {
      state.selectedReport = state.reports.find(report => report.id === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports.push(action.payload);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.reports.findIndex(report => report.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.reports.findIndex(report => report.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = state.reports.filter(report => report.id !== action.payload);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectReportById = (state: RootState, id: number) => 
  state.reports.reports.find(report => report.id === id);

export const { clearError, selectReport } = reportSlice.actions;
export default reportSlice.reducer; 