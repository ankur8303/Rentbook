import axios from 'axios';
import { API_CONFIG } from '../constants';
import { LoginCredentials, ApiResponse } from '../types';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    ...API_CONFIG.HEADERS,
    'Content-Type': 'application/json'
  }
});

export class ApiService {
  static async login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/customer/api/v1/customers/auth/verify', credentials);
      return { data: response.data, success: true };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || 'Login failed', 
        success: false 
      };
    }
  }


}

export default api;