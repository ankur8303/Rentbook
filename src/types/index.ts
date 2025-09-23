export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface LoginCredentials {
  recipient: string;
  action: string;
  verification_type: string;
  authentication_type: string;
  credential: string;
  new_password: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  sku?: string;
  category?: string;
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