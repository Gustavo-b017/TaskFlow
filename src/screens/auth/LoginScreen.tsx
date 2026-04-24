import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { CustomInput } from '../../shared/components/CustomInput';
import { CustomButton } from '../../shared/components/CustomButton';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = 'O usuário é obrigatório';
    if (!password.trim()) newErrors.password = 'A senha é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setErrors({}); // Limpa erros prévios antes de validar
    if (!validate()) return;

    setLoading(true);
    try {
      await signIn(username, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha na autenticação';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>TaskFlow</Text>
          <Text style={styles.subtitle}>Gerencie suas tarefas com eficiência</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Usuário"
            placeholder="Digite seu usuário"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
            }}
            error={errors.username}
            autoCapitalize="none"
          />

          <CustomInput
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            secureTextEntry
          />

          <View style={styles.spacer} />

          <CustomButton 
            label="Entrar" 
            onPress={handleLogin} 
            loading={loading}
          />
          
          <Text style={styles.hint}>
            Dica: admin / 123 ou user / 123
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  spacer: {
    height: 12,
  },
  hint: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
  },
});
