import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import OtpInput from './OtpInput';
import Button from '../components/Button';

interface Props {
    mobileNumber: string;
    otp: string;
    setOtp: (value: string) => void;
    onBack: () => void;
    onVerify: () => void;
    isLoading: boolean;
    error?: string;
    onResend?: () => void;
}

const OtpSection: React.FC<Props> = ({
    mobileNumber,
    otp,
    setOtp,
    onBack,
    onVerify,
    isLoading,
    error,
    onResend,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>OTP sent to {mobileNumber}</Text>
            </View>

            <OtpInput value={otp} onChange={setOtp} error={error} autoFocus maxLength={6} />

            <TouchableOpacity style={styles.resendContainer} onPress={onResend}>
                <Text style={styles.resendText}>
                    Didn't receive OTP? <Text style={styles.resendLink}>Resend</Text>
                </Text>
            </TouchableOpacity>

            <Button title="Verify & Login" onPress={onVerify} loading={isLoading} disabled={otp.length !== 6 || isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    header: { marginBottom: 20 },
    backButton: { color: '#007AFF', fontSize: 16, fontWeight: '600', marginBottom: 10 },
    title: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 10 },
    resendContainer: { alignSelf: 'flex-start', marginBottom: 25 },
    resendText: { color: '#666666', fontSize: 14 },
    resendLink: { color: '#007AFF', fontWeight: '600' },
});

export default OtpSection;
