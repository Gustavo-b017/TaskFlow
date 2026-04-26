import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import { ThemeProvider, ThemeContext } from '../ThemeContext';
import { useTheme } from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys';

jest.unmock('../../hooks/useTheme');

// A mock component to consume the context
const MockConsumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <Text testID="theme-value">{theme}</Text>
      <TouchableOpacity testID="toggle-button" onPress={toggleTheme}>
        <Text>Toggle Theme</Text>
      </TouchableOpacity>
    </>
  );
};

const MockOutsideConsumer = () => {
  useTheme();
  return <Text>Should throw</Text>;
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide default theme as light', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <MockConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-value').props.children).toBe('light');
    });
  });

  it('should load theme from AsyncStorage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <MockConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-value').props.children).toBe('dark');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME);
    });
  });

  it('should fallback to light if AsyncStorage returns invalid theme', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid-theme');

    const { getByTestId } = render(
      <ThemeProvider>
        <MockConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-value').props.children).toBe('light');
    });
  });

  it('should toggle theme and save to AsyncStorage', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <MockConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-value').props.children).toBe('light');
    });

    fireEvent.press(getByTestId('toggle-button'));

    await waitFor(() => {
      expect(getByTestId('theme-value').props.children).toBe('dark');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME, 'dark');
    });
  });

  it('should throw an error when useTheme is used outside of ThemeProvider', () => {
    // Suppress console.error for the expected error boundary catch
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<MockOutsideConsumer />)).toThrow(
      'useTheme deve ser usado dentro de ThemeProvider'
    );
    
    spy.mockRestore();
  });
});
