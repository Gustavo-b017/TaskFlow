import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView,
  StatusBar
} from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { CustomInput } from '../../shared/components/CustomInput';
import { CustomButton } from '../../shared/components/CustomButton';
import { useTheme } from '../../hooks/useTheme';
import { COLORS, BORDER_RADIUS, SPACING } from '../../styles/theme';
import type { AuthStackParamList } from '../../types/navigation';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<LoginNavProp>();
  const themeColors = COLORS[theme];
  
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
    setErrors({});
    if (!validate()) return;

    setLoading(true);
    try {
      await signIn(username, password);
      // Redirecionamento condicional pós-login (será processado na próxima renderização do roteador, 
      // mas garantimos o estado inicial correto aqui caso o roteador não remonte)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha na autenticação';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LucideIcons.CheckCircle2 size={48} color={themeColors.primary} strokeWidth={3} />
            </View>
            <Text style={styles.logo}>TaskFlow</Text>
            <Text style={styles.subtitle}>Sua produtividade elevada ao máximo</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Usuário"
              placeholder="Ex: admin"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
              }}
              error={errors.username}
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
              title="Acessar Conta" 
              onPress={handleLogin} 
              loading={loading}
            />
            
            <View style={styles.hintContainer}>
              <LucideIcons.Info size={14} color={themeColors.textMuted} />
              <Text style={styles.hint}>
                Dica: admin / 123 ou user / 123
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: SPACING.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: SPACING.xl,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: themeColors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
      borderWidth: 1.5,
      borderColor: themeColors.border,
    },
    logo: {
      fontSize: 36,
      fontWeight: '800',
      color: themeColors.text,
      letterSpacing: -1.5,
    },
    subtitle: {
      fontSize: 16,
      color: themeColors.textMuted,
      marginTop: 4,
      fontWeight: '500',
    },
    form: {
      backgroundColor: themeColors.surface,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1.5,
      borderColor: themeColors.border,
    },
    spacer: {
      height: 8,
    },
    hintContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: SPACING.lg,
    },
    hint: {
      fontSize: 13,
      color: themeColors.textMuted,
      fontWeight: '600',
    },
  });
}