export interface User {
  id: number;
  mobile: string;
  otp?: string;
}

export interface LoginCredentials {
  recipient: string;
  action: string;
  verification_type: string;
  authentication_type: string;
  credential: string;
  new_password: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}