import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useTreatment } from '../../hooks/useTreatment';
import { fetchMotivationalQuote } from '../../services/api';
import { CustomButton } from '../../shared/components/CustomButton';

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { treatment } = useTreatment();
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadQuote(); }, []);

  async function loadQuote() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMotivationalQuote();
      setQuote(result);
    } catch {
      setError('Não foi possível carregar a frase.');
    } finally {
      setLoading(false);
    }
  }

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <Text style={styles.greeting}>
          Olá{treatment ? `, ${treatment}` : ''} {user?.name}! 👋
        </Text>

        <Text style={styles.sectionTitle}>Frase do dia</Text>
        {loading && <ActivityIndicator color={theme === 'dark' ? '#FFFFFF' : '#000000'} />}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>{error}</Text>
            <CustomButton title="Tentar novamente" onPress={loadQuote} variant="primary" />
          </View>
        )}
        {quote && <Text style={styles.quote}>"{quote}"</Text>}
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F2F2F7',
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    greeting: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#E5E5EA' : '#3A3A3C',
      marginBottom: 16,
    },
    errorContainer: {
      marginTop: 8,
      alignItems: 'center',
    },
    error: {
      color: '#EF4444',
      marginBottom: 16,
      textAlign: 'center',
    },
    quote: {
      fontSize: 20,
      fontStyle: 'italic',
      color: isDark ? '#D1D5DB' : '#4B5563',
      textAlign: 'center',
      marginTop: 24,
      lineHeight: 28,
    },
  });
}
