import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TaskStackParamList } from '../../types/navigation';
import type { TaskStatus, TaskPriority } from '../../types/task';
import { CustomInput } from '../../shared/components/CustomInput';
import { CustomButton } from '../../shared/components/CustomButton';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';

type FormNav = NativeStackNavigationProp<TaskStackParamList, 'TaskForm'>;
type FormRoute = RouteProp<TaskStackParamList, 'TaskForm'>;

const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: 'Pendente', value: 'pendente' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Concluída', value: 'concluida' },
];

const PRIORITY_OPTIONS: { label: string; value: TaskPriority }[] = [
  { label: 'Baixa', value: 'baixa' },
  { label: 'Média', value: 'media' },
  { label: 'Alta', value: 'alta' },
];

export function TaskFormScreen() {
  const navigation = useNavigation<FormNav>();
  const route = useRoute<FormRoute>();
  const { tasks, addTask, updateTask, loading } = useTasks();
  const { theme } = useTheme();

  const taskId = route.params?.taskId;
  const isEditing = Boolean(taskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pendente');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [category, setCategory] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && !loading) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setCategory(task.category);
        setCategoryIcon(task.categoryIcon);
      }
    }
  }, [isEditing, taskId, tasks, loading]);

  const isValid = title.trim().length > 0;

  async function handleSubmit() {
    if (!title.trim()) {
      setErrors({ title: 'Título é obrigatório' });
      return;
    }
    setSaving(true);
    try {
      const payload = { title, description, status, priority, category, categoryIcon };
      if (isEditing && taskId) {
        await updateTask(taskId, payload);
      } else {
        await addTask(payload);
      }
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <CustomInput
            label="Título *"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (!text.trim()) {
                setErrors({ title: 'Título é obrigatório' });
              } else {
                setErrors({});
              }
            }}
            error={errors.title}
            placeholder="Digite o título da tarefa"
            testID="input-title"
          />

          <CustomInput
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="Descrição opcional"
            multiline
            testID="input-description"
          />

          <Text style={styles.sectionLabel}>Status *</Text>
          <View style={styles.optionsRow}>
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.chip, status === opt.value && styles.chipSelected]}
                onPress={() => setStatus(opt.value)}
                testID={`status-${opt.value}`}
              >
                <Text style={[styles.chipText, status === opt.value && styles.chipTextSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Prioridade *</Text>
          <View style={styles.optionsRow}>
            {PRIORITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.chip, priority === opt.value && styles.chipSelected]}
                onPress={() => setPriority(opt.value)}
                testID={`priority-${opt.value}`}
              >
                <Text style={[styles.chipText, priority === opt.value && styles.chipTextSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomInput
            label="Categoria"
            value={category}
            onChangeText={setCategory}
            placeholder="Ex: Trabalho, Estudos..."
            testID="input-category"
          />

          <CustomInput
            label="Ícone da Categoria"
            value={categoryIcon}
            onChangeText={setCategoryIcon}
            placeholder="Ex: 💼, 📚..."
            testID="input-category-icon"
          />

          <View style={styles.footer}>
            <CustomButton
              title={isEditing ? 'Salvar alterações' : 'Criar tarefa'}
              onPress={handleSubmit}
              disabled={!isValid}
              loading={saving}
              testID="btn-submit"
            />
            <CustomButton
              title="Cancelar"
              variant="secondary"
              onPress={() => navigation.goBack()}
              testID="btn-cancel"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? '#121212' : '#F2F2F7' },
    content: { padding: 24, paddingBottom: 40 },
    sectionLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#F9FAFB' : '#333333',
      marginTop: 16,
      marginBottom: 8,
    },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#CCCCCC',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    },
    chipSelected: { borderColor: '#3B82F6', backgroundColor: '#3B82F6' },
    chipText: { fontSize: 14, color: isDark ? '#D1D5DB' : '#333333' },
    chipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
    footer: { marginTop: 32, gap: 8 },
  });
}
