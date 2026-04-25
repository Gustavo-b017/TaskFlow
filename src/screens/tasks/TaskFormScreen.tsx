import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TaskStackParamList } from '../../types/navigation';
import type { TaskStatus, TaskPriority } from '../../types/task';
import { CustomInput } from '../../shared/components/CustomInput';
import { CustomButton } from '../../shared/components/CustomButton';
import { useTasks } from '../../hooks/useTasks';

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
  const { tasks, addTask, updateTask } = useTasks();

  const taskId = route.params?.taskId;
  const isEditing = Boolean(taskId);
  const existingTask = isEditing && taskId ? tasks.find((t) => t.id === taskId) : null;

  const [title, setTitle] = useState(existingTask?.title ?? '');
  const [description, setDescription] = useState(existingTask?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(existingTask?.status ?? 'pendente');
  const [priority, setPriority] = useState<TaskPriority>(existingTask?.priority ?? 'media');
  const [category, setCategory] = useState(existingTask?.category ?? '');
  const [categoryIcon, setCategoryIcon] = useState(existingTask?.categoryIcon ?? '');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isValid = title.trim().length > 0;

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!value.trim()) {
      setTitleError('Título é obrigatório');
    } else {
      setTitleError(null);
    }
  }

  async function handleSubmit() {
    if (!isValid) return;
    setSubmitting(true);
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
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <CustomInput
          label="Título *"
          value={title}
          onChangeText={handleTitleChange}
          error={titleError}
          placeholder="Digite o título da tarefa"
          testID="input-title"
        />

        <CustomInput
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição opcional"
          multiline
          numberOfLines={3}
          style={styles.multiline}
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
            label={isEditing ? 'Salvar alterações' : 'Criar tarefa'}
            onPress={handleSubmit}
            disabled={!isValid}
            loading={submitting}
            testID="btn-submit"
          />
          <CustomButton
            label="Cancelar"
            type="outline"
            onPress={() => navigation.goBack()}
            testID="btn-cancel"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 24, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginTop: 8,
    marginBottom: 8,
  },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: { borderColor: '#007AFF', backgroundColor: '#007AFF' },
  chipText: { fontSize: 14, color: '#333333' },
  chipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  multiline: { height: 80, textAlignVertical: 'top', paddingTop: 12 },
  footer: { marginTop: 24, gap: 8 },
});
