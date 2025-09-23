import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { User, AuthState } from '../types';

export class StorageService {
  static async saveAuthData(user: User, token: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
        [STORAGE_KEYS.AUTH_TOKEN, token],
        [STORAGE_KEYS.LOGIN_STATE, 'true']
      ]);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  }

  static async getAuthState(): Promise<AuthState> {
    try {
      const [userData, token, loginState] = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.LOGIN_STATE
      ]);

      if (loginState[1] === 'true' && userData[1] && token[1]) {
        return {
          user: JSON.parse(userData[1]),
          token: token[1],
          isAuthenticated: true,
          isLoading: false
        };
      }
    } catch (error) {
      console.error('Error getting auth state:', error);
    }

    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    };
  }

  static async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.LOGIN_STATE
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
}