import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ImageBackground,
    Image,
    StatusBar
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
    const [errors, setErrors] = useState<{
        mobileNumber?: string;
        password?: string;
        general?: string;
    }>({});

    useEffect(() => {
        checkExistingLogin();
    }, []);

    const checkExistingLogin = async () => {
        const authState = await StorageService.getAuthState();
        if (authState.isAuthenticated) {
            navigation.replace('ProductDetail');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/\S+@\S+\.\S+/.test(mobileNumber)) {
            newErrors.mobileNumber = 'Please enter a valid email address';
        }

        if (!useOTP) {
            if (!password.trim()) {
                newErrors.password = 'Password is required';
            } else if (password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
        } else {
            if (!password.trim()) {
                newErrors.password = 'OTP is required';
            } else if (!/^\d{6}$/.test(password)) {
                newErrors.password = 'OTP must be 6 digits';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const credentials: LoginCredentials = {
            recipient: mobileNumber,
            action: 'login',
            verification_type: useOTP ? 'otp' : 'password',
            authentication_type: 'email',
            credential: password,
            new_password: ''
        };

        const response = await ApiService.login(credentials);
        console.log('Login response:', response);
        setIsLoading(false);

        if (response.success && response.data) {
            const userData = {
                id: 1,
                email: mobileNumber,
                name: 'Raj'
            };

      
            await StorageService.saveAuthData(userData, response?.data?.token);
            navigation.replace('ProductDetail');
        } else {
            setErrors({
                general: response.error || 'Login failed. Please check your credentials.'
            });
        }
    };

    const handleForgotPassword = () => {
        setErrors({
            general: 'Forgot password feature coming soon!'
        });
    };

    const toggleAuthMethod = () => {
        setUseOTP(!useOTP);
        setPassword('');
        setErrors({});
    };

    const clearError = (field: keyof typeof errors) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={styles.topSection}>
                <ImageBackground
                    source={require('../Image/loginImage.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >

                </ImageBackground>
            </View>
            <View style={styles.bottomSection}>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoid}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.formContainer}>
                            <Image
                                source={require('../Image/logoandsigne.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.sectionTitle}>Log In or Sign up</Text>
                            <Text style={styles.promoText}>Sign up now and get 500 Dentacains</Text>
                            <View style={styles.inputWrapper}>
                                <InputField
                                    label="Mobile Number"
                                    value={mobileNumber}
                                    onChangeText={(text) => {
                                        setMobileNumber(text);
                                        clearError('mobileNumber');
                                        clearError('general');
                                    }}
                                    placeholder="Enter your mobile number"
                                    keyboardType="email-address"
                                />
                                {errors.mobileNumber && (
                                    <Text style={styles.errorText}>{errors.mobileNumber}</Text>
                                )}
                            </View>
                            <View style={styles.inputWrapper}>
                                {!useOTP ? (
                                    <>
                                        <InputField
                                            label="Password"
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                clearError('password');
                                                clearError('general');
                                            }}
                                            placeholder="Enter your password"
                                            secureTextEntry
                                        />
                                        {errors.password && (
                                            <Text style={styles.errorText}>{errors.password}</Text>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <InputField
                                            label="OTP"
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                clearError('password');
                                                clearError('general');
                                            }}
                                            placeholder="Enter OTP"
                                            keyboardType="number-pad"
                                        />
                                        {errors.password && (
                                            <Text style={styles.errorText}>{errors.password}</Text>
                                        )}
                                    </>
                                )}
                            </View>
                            <View style={{width: '100%', flexDirection:'row', justifyContent:'space-between'}}>
                            <TouchableOpacity onPress={toggleAuthMethod} style={styles.authToggle}>
                                <Text style={styles.authToggleText}>
                                    Use {useOTP ? 'Password' : 'OTP'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                            </TouchableOpacity>
                            </View>
                            {errors.general && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.generalErrorText}>{errors.general}</Text>
                                </View>
                            )}
                            <View style={{width: '100%'}}>
                            <Button
                                title="Continue"
                                onPress={handleLogin}
                                loading={isLoading}
                                disabled={isLoading}
                            />
                            </View>
                            <View style={styles.footer}>
                                <Text style={styles.helpText}>Need help? Connect with us</Text>
                                <Text style={styles.termsText}>
                                    By logging or signing up, you agree to our Terms & Policy
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    topSection: {
        height: '35%', 
        backgroundColor: '#f0f0f0',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    logo: {
        width: 120,
        height: 120,
    },
    bottomSection: {
        flex: 1,
        backgroundColor: '#ffffff',
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        marginTop: -20, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingTop: 20,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2483B9',
        // marginBottom: 8,
        // textAlign: 'left',
    },
    promoText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2483B9',
        marginBottom: 30,
        // fontWeight: '500',
    },
    inputWrapper: {
        // marginBottom: 20,
        width: '100%',
    },
    authToggle: {
        alignSelf: 'flex-start',
        marginBottom: 15,
        paddingVertical: 5,
    },
    authToggleText: {
        color: '#007AFF', 
        fontSize: 14,
        fontWeight: '600',
    },
    forgotPassword: {
        alignSelf: 'flex-start',
        marginBottom: 25,
        paddingVertical: 5,
    },
    forgotPasswordText: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '500',
    },
    errorContainer: {
        marginBottom: 15,
    },
    errorText: {
        color: '#BC1723',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
        fontWeight: '500',
    },
    generalErrorText: {
        color: '#BC1723',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        padding: 12,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#BC1723',
    },
    footer: {
        marginTop: 'auto',
        paddingVertical: 20,
        alignItems: 'center',
    },
    helpText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
        fontWeight: '500',
    },
    termsText: {
        fontSize: 12,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 16,
    },
});

export default LoginScreen;