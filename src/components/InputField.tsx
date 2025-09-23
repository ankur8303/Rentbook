import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  rightIcon,
  onRightIconPress
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconContainer}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  iconContainer: {
    padding: 10,
  },
});

export default InputField;