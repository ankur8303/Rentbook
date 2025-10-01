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
import OtpSection from '../components/OtpSection';

type RootStackParamList = {
    Login: undefined;
    ProductDetail: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [mobileNumber, setMobileNumber] = useState(DEFAULT_CREDENTIALS.mobile || '');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [errors, setErrors] = useState<{
        mobileNumber?: string;
        otp?: string;
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

    // Validate mobile number (10-digit numeric)
    const validateMobileNumber = (): boolean => {
        const newErrors: typeof errors = {};

        if (!mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate OTP (hardcoded 123456 for testing)
    const validateOtp = (): boolean => {
        const newErrors: typeof errors = {};

        if (!otp.trim()) {
            newErrors.otp = 'OTP is required';
        } else if (!/^\d{6}$/.test(otp)) {
            newErrors.otp = 'OTP must be 6 digits';
        } else if (otp !== '123456') {
            newErrors.otp = 'Invalid OTP. Please try again.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        setErrors({});

        if (!validateMobileNumber()) return;

        setIsLoading(true);
        try {
            // Simulate API call to send OTP
            await new Promise(resolve => setTimeout(resolve, 1000));

            setShowOtpScreen(true);
            setErrors({
                general: 'OTP sent to your mobile number. Use 123456 for testing.'
            });
        } catch (error) {
            setErrors({ general: 'Failed to send OTP. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

//     const handleLogin = async () => {
//         setErrors({});

//         if (!validateOtp()) return;

//         setIsLoading(true);

//         const credentials: LoginCredentials = {
//             recipient: mobileNumber,
//             action: 'login',
//             verification_type: 'otp',
//             authentication_type: 'mobile',
//             credential: otp,
//             new_password: ''
//         };
// console.log('Login credentials:', credentials);
//         const response = await ApiService.login(credentials);
//         console.log('Login response:', response);
//         setIsLoading(false);

//         if (response.success && response.data) {
//             const userData = {
//                 id: 1,
//                 mobile: mobileNumber,
//                 name: 'Raj'
//             };

      
//             await StorageService.saveAuthData(userData, response?.data?.token);
//             navigation.replace('ProductDetail');
//         } else {
//             setErrors({
//                 general: response.error || 'Login failed. Please check your credentials.'
//             });
//         }
//     };
const handleLogin = async () => {
    setErrors({});

    if (!validateOtp()) return;

    setIsLoading(true);

    try {
        // Simulate login delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Static user data for demo purposes
        const userData = {
            id: 1,
            mobile: mobileNumber,
            name: 'Raj',
        };

        // Simulate saving auth state
        await StorageService.saveAuthData(userData, 'static-token-123456');

        // Navigate to next screen
        navigation.replace('LandlordPropert');
    } catch (error) {
        setErrors({
            general: 'Login failed. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
};

    const handleBackToMobile = () => {
        setShowOtpScreen(false);
        setOtp('');
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
                    source={require('../Image/homebroker.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />
            </View>

            <KeyboardAvoidingView
                style={styles.bottomSection}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.formContainer}>
                        {!showOtpScreen ? (
                            // Mobile Number Screen
                            <>
                                <View style={styles.inputWrapper}>
                                    <InputField
                                        label="Mobile Number"
                                        value={mobileNumber}
                                        onChangeText={(text) => {
                                            setMobileNumber(text);
                                            clearError('mobileNumber');
                                            clearError('general');
                                        }}
                                        // placeholder="Enter your mobile number"
                                        keyboardType="phone-pad"
                                        autoFocus
                                    />
                                    {errors.mobileNumber && (
                                        <Text style={styles.errorText}>{errors.mobileNumber}</Text>
                                    )}
                                </View>

                                {errors.general && (
                                    <View style={styles.errorContainer}>
                                        <Text style={styles.generalErrorText}>{errors.general}</Text>
                                    </View>
                                )}

                                <Button
                                    title="Send OTP"
                                    onPress={handleSendOtp}
                                    loading={isLoading}
                                    disabled={isLoading || !mobileNumber.trim()}
                                />
                            </>
                        ) : (
                            <OtpSection
                                mobileNumber={mobileNumber}
                                otp={otp}
                                setOtp={setOtp}
                                onBack={handleBackToMobile}
                                onVerify={handleLogin}
                                isLoading={isLoading}
                                error={errors.otp || errors.general}
                                onResend={handleSendOtp}
                            />

                        )}

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
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    topSection: { height: '35%', backgroundColor: '#f0f0f0' },
    backgroundImage: { width: '100%', height: '100%' },
    logo: { width: 120, height: 120 },
    bottomSection: { flex: 1, backgroundColor: '#ffffff', marginTop: -20 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingTop: 20 },
    formContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: '#2483B9' },
    promoText: { fontSize: 14, fontWeight: '500', color: '#2483B9', marginBottom: 30 },
    inputWrapper: { marginBottom: 20, width: '100%' },
    errorContainer: { marginBottom: 15, width: '100%' },
    errorText: { color: '#BC1723', fontSize: 12, marginTop: 5, marginLeft: 5, fontWeight: '500' },
    generalErrorText: {
        color: '#BC1723',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        padding: 12,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#BC1723'
    },
    footer: { marginTop: 'auto', paddingVertical: 20, alignItems: 'center' },
    helpText: { fontSize: 14, color: '#666666', marginBottom: 8, fontWeight: '500' },
    termsText: { fontSize: 12, color: '#999999', textAlign: 'center', lineHeight: 16 },
    otpHeader: { width: '100%', marginBottom: 20 },
    backButton: { alignSelf: 'flex-start', marginBottom: 10 },
    backButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
    otpTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 5 },
    otpSubtitle: { fontSize: 14, color: '#666', marginBottom: 10 },
    resendOtp: { alignSelf: 'flex-start', marginBottom: 25 },
    resendOtpText: { color: '#666666', fontSize: 14 },
    resendLink: { color: '#007AFF', fontWeight: '600' },
});

export default LoginScreen;
