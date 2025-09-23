import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { StorageService } from '../services/storage';
import { AuthState } from '../types';

export type RootStackParamList = {
  Login: undefined;
  ProductDetail: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [initialAuthState, setInitialAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const authState = await StorageService.getAuthState();
      setInitialAuthState({
        ...authState,
        isLoading: false
      });
    } catch (error) {
      setInitialAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  if (initialAuthState.isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitleAlign: 'center',
        }}
        initialRouteName={initialAuthState.isAuthenticated ? 'ProductDetail' : 'Login'}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        //   options={{
        // title: 'Login',
        // headerBackVisible: false,
        //   }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
        //   options={{
        // title: 'Product Detail',
        // headerBackTitle: 'Back',
        //   }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;