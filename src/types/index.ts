export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface Report {
  id: number;
  createdOn: string;
  createdBy: number;
  title: string;
  type: 'RED_FLAG' | 'INTERVENTION';
  location: string;
  status: 'DRAFT' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'REJECTED';
  images: string[];
  videos: string[];
  comment: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ReportState {
  reports: Report[];
  selectedReport: Report | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  username: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
}

export interface CreateReportFormData {
  title: string;
  type: 'RED_FLAG' | 'INTERVENTION';
  location: string;
  comment: string;
  images?: File[];
  videos?: File[];
} 