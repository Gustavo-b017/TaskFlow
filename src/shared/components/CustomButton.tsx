import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps 
} from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  label: string;
  type?: 'primary' | 'outline';
  loading?: boolean;
}

export function CustomButton({ 
  label, 
  onPress, 
  type = 'primary', 
  loading = false, 
  disabled,
  style,
  ...rest 
}: CustomButtonProps) {
  const isPrimary = type === 'primary';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.container, 
        isPrimary ? styles.primaryContainer : styles.outlineContainer,
        (disabled || loading) && styles.disabled,
        style
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#007AFF'} />
      ) : (
        <Text style={[
          styles.label, 
          isPrimary ? styles.primaryLabel : styles.outlineLabel
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  primaryContainer: {
    backgroundColor: '#007AFF',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  outlineLabel: {
    color: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
});
