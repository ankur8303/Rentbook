import axios from 'axios';
import { API_CONFIG } from '../constants';
import { LoginCredentials, Product, ApiResponse } from '../types';

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

  static async getProductDetails(productId: number, token: string): Promise<ApiResponse<Product>> {
    try {
      const response = await api.get(`/node_svlss/api/v1/products/${productId}/`, {
        headers: {
          ...API_CONFIG.HEADERS,
          'Authorization': `Bearer ${token}`
        }
      });
      return { data: response.data, success: true };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || 'Failed to fetch product', 
        success: false 
      };
    }
  }
}

export default api;