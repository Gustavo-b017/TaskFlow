import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TextInputProps 
} from 'react-native';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string | null;
}

export function CustomInput({ 
  label, 
  error, 
  style, 
  ...rest 
}: CustomInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style
        ]}
        placeholderTextColor="#999999"
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});
