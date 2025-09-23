import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { DEFAULT_CREDENTIALS } from '../constants';
import { LoginCredentials } from '../types';

type RootStackParamList = {
  Login: undefined;
  ProductDetail: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState(DEFAULT_CREDENTIALS.email);
  const [password, setPassword] = useState(DEFAULT_CREDENTIALS.password);
  const [isLoading, setIsLoading] = useState(false);
  const [useOTP, setUseOTP] = useState(false);

  useEffect(() => {
    checkExistingLogin();
  }, []);

  const checkExistingLogin = async () => {
    const authState = await StorageService.getAuthState();
    if (authState.isAuthenticated) {
      navigation.replace('ProductDetail');
    }
  };

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert('Error', 'Please enter both mobile number and password');
      return;
    }

    setIsLoading(true);

    const credentials: LoginCredentials = {
      recipient: mobileNumber,
      action: 'login',
      verification_type: 'password',
      authentication_type: 'email',
      credential: password,
      new_password: ''
    };

    const response = await ApiService.login(credentials);

    setIsLoading(false);

    if (response.success && response.data) {
      // Simulate user data and token (adjust based on actual API response)
      const userData = {
        id: 1,
        email: mobileNumber,
        name: 'Raj'
      };
      
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjE2OTUxLCJ0eXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3NTEyODcyMTEsImlzcyI6ImRlbnRhbGthcnQifQ.6bZkWE46QkTKRYMh-oVne39SQR2-OGixxhNxl5yIJGc';

      await StorageService.saveAuthData(userData, token);
      navigation.replace('ProductDetail');
    } else {
      Alert.alert('Login Failed', response.error || 'Please check your credentials');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Feature coming soon!');
  };

  const toggleAuthMethod = () => {
    setUseOTP(!useOTP);
    setPassword('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.time}>09:41</Text>
          <Text style={styles.title}>Dentalkart</Text>
          <Text style={styles.subtitle}>Arjling D-Art</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Log In or Sign up</Text>
          <Text style={styles.promoText}>Sign up now and get 500 1 Dentacains</Text>

          <InputField
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholder="Enter your mobile number"
            keyboardType="email-address"
          />

          {!useOTP ? (
            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          ) : (
            <InputField
              label="OTP"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter OTP"
              keyboardType="number-pad"
            />
          )}

          <TouchableOpacity onPress={toggleAuthMethod} style={styles.otpButton}>
            <Text style={styles.otpText}>Use {useOTP ? 'Password' : 'OTP'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password</Text>
          </TouchableOpacity>

          <Button
            title="Continue"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.helpText}>Need help? Connect with us 😊</Text>
          <Text style={styles.termsText}>
            By logging or signing up, you agree to our Terms & Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  time: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  promoText: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 30,
  },
  otpButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  otpText: {
    color: '#007AFF',
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default LoginScreen;