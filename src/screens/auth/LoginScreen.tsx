import React, { useState } from 'react';
import { 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Text, 
  StyleSheet, 
  Platform,
  View
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { CustomButton } from '../../shared/components/CustomButton';
import { CustomInput } from '../../shared/components/CustomInput';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signIn(username, password);
      // Redirecionamento automático via AuthContext no App.tsx
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Usuário ou senha inválidos.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>TaskFlow</Text>
          <Text style={styles.subtitle}>Gerencie suas tarefas com facilidade</Text>
        </View>

        <View style={styles.form}>
          <CustomInput 
            label="Usuário" 
            value={username} 
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <CustomInput 
            label="Senha" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <CustomButton 
            label="Entrar" 
            onPress={handleLogin} 
            loading={loading} 
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
  form: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
});
