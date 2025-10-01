import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps } from 'react-native';

interface OtpInputProps {
    value: string;
    onChange: (text: string) => void;
    maxLength?: number;
    autoFocus?: boolean;
    error?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, maxLength = 6, autoFocus, error }) => {
    const inputs = useRef<TextInput[]>([]);

    const handleChange = (text: string, index: number) => {
        let newValue = value.split('');
        newValue[index] = text;
        const updatedValue = newValue.join('').slice(0, maxLength);
        onChange(updatedValue);

        // Move focus to next input
        if (text && index < maxLength - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {Array.from({ length: maxLength }).map((_, i) => (
                <TextInput
                    key={i}
                    ref={(ref) => (inputs.current[i] = ref!)}
                    value={value[i] || ''}
                    onChangeText={(text) => handleChange(text, i)}
                    onKeyPress={(e) => handleKeyPress(e, i)}
                    style={[styles.input, error && styles.errorInput]}
                    keyboardType="number-pad"
                    maxLength={1}
                    autoFocus={i === 0 && autoFocus}
                    textAlign="center"
                />
            ))}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: 45,
        height: 55,
        borderRadius: 8,
        fontSize: 20,
        color: '#333',
    },
    errorInput: {
        borderColor: '#BC1723',
    },
    errorText: {
        color: '#BC1723',
        fontSize: 12,
        marginTop: 5,
        position: 'absolute',
        bottom: -20,
        left: 0,
    },
});

export default OtpInput;
