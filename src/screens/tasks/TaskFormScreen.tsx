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
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as LucideIcons from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TaskStackParamList } from '../../types/navigation';
import type { TaskStatus, TaskPriority } from '../../types/task';
import { CustomInput } from '../../shared/components/CustomInput';
import { CustomButton } from '../../shared/components/CustomButton';
import { resolveLucideIcon } from '../../shared/utils/iconRegistry';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { fetchCategories } from '../../services/api';
import { COLORS, BORDER_RADIUS, SPACING } from '../../styles/theme';

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

const ICON_LIST = [
  { name: 'Briefcase', label: 'Trabalho' },
  { name: 'BookOpen', label: 'Estudos' },
  { name: 'User', label: 'Pessoal' },
  { name: 'Heart', label: 'Saúde' },
  { name: 'Gamepad2', label: 'Lazer' },
  { name: 'ShoppingCart', label: 'Compras' },
  { name: 'Home', label: 'Casa' },
  { name: 'Car', label: 'Viagem' },
  { name: 'Coffee', label: 'Café' },
  { name: 'Smartphone', label: 'Tech' },
];

export function TaskFormScreen() {
  const navigation = useNavigation<FormNav>();
  const route = useRoute<FormRoute>();
  const { tasks, addTask, updateTask, loading } = useTasks();
  const { theme } = useTheme();
  const themeColors = COLORS[theme];

  const taskId = route.params?.taskId;
  const isEditing = Boolean(taskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pendente');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [category, setCategory] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('ClipboardList');
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const CATEGORY_TO_ICON: Record<string, string> = {
    'smartphones': 'Smartphone',
    'laptops': 'Laptop',
    'fragrances': 'Sparkles',
    'skincare': 'Smile',
    'groceries': 'ShoppingCart',
    'home-decoration': 'Home',
    'furniture': 'Layout',
    'tops': 'Shirt',
    'womens-dresses': 'Shirt',
    'womens-shoes': 'Footprints',
    'mens-shirts': 'Shirt',
    'mens-shoes': 'Footprints',
    'mens-watches': 'Watch',
    'womens-watches': 'Watch',
    'womens-bags': 'ShoppingBag',
    'womens-jewellery': 'Gem',
    'sunglasses': 'Glasses',
    'automotive': 'Car',
    'motorcycle': 'Bike',
    'lighting': 'Lightbulb',
  };

  function handleSelectCategory(cat: string) {
    setCategory(cat);
    const iconName = CATEGORY_TO_ICON[cat.toLowerCase()];
    if (iconName) {
      setCategoryIcon(iconName);
    }
  }

  async function loadCategories() {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const result = await fetchCategories();
      setCategories(result);
    } catch {
      setCategoriesError('Não foi possível carregar as categorias.');
    } finally {
      setCategoriesLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (isEditing && !loading) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setCategory(task.category);
        setCategoryIcon(task.categoryIcon || 'ClipboardList');
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
        Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
        navigation.goBack();
      } else {
        await addTask(payload);
        Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
        navigation.goBack();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível salvar a tarefa.';
      Alert.alert('Erro', message);
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
          <Text style={styles.pageTitle}>{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
          
          <CustomInput
            label="Título da Tarefa"
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
            placeholder="Ex: Comprar leite"
            testID="input-title"
          />

          <CustomInput
            label="Descrição (Opcional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione detalhes sobre a tarefa..."
            multiline
            testID="input-description"
          />

          <Text style={styles.sectionLabel}>Status & Prioridade</Text>
          <View style={styles.row}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentedControl}>
              {STATUS_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.segment, status === opt.value && styles.segmentActive]}
                  onPress={() => setStatus(opt.value)}
                  testID={`status-${opt.value}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar status ${opt.label}`}
                  accessibilityState={{ selected: status === opt.value }}
                >
                  <Text style={[styles.segmentText, status === opt.value && styles.segmentTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.row}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentedControl}>
              {PRIORITY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.segment, priority === opt.value && styles.segmentActive]}
                  onPress={() => setPriority(opt.value)}
                  testID={`priority-${opt.value}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar prioridade ${opt.label}`}
                  accessibilityState={{ selected: priority === opt.value }}
                >
                  <Text style={[styles.segmentText, priority === opt.value && styles.segmentTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.sectionLabel}>Ícone & Categoria</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.iconScroll}
            contentContainerStyle={{ gap: 12, paddingRight: 24 }}
          >
            {ICON_LIST.map((item) => {
              const Icon = resolveLucideIcon(item.name);
              const isActive = categoryIcon === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => {
                    setCategoryIcon(item.name);
                    if (!category) setCategory(item.label);
                  }}
                  style={[styles.iconChip, isActive && styles.iconChipActive]}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar icone ${item.label}`}
                  accessibilityState={{ selected: isActive }}
                >
                  <Icon size={24} color={isActive ? '#FFFFFF' : themeColors.text} strokeWidth={2} />
                  <Text style={[styles.iconLabel, isActive && styles.iconLabelActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {categoriesLoading && <ActivityIndicator size="small" color={themeColors.primary} style={{ marginVertical: 12 }} />}

          {!categoriesLoading && categoriesError && (
            <View style={styles.categoriesErrorBox}>
              <Text style={styles.categoriesErrorText}>{categoriesError}</Text>
              <TouchableOpacity
                onPress={loadCategories}
                style={styles.retryButton}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Tentar carregar categorias novamente"
              >
                <LucideIcons.RefreshCw size={14} color={themeColors.primary} strokeWidth={2.6} />
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {!categoriesLoading && categories.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.categoriesScroll}
              contentContainerStyle={{ gap: 8, paddingRight: 24 }}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleSelectCategory(cat)}
                  style={[styles.chip, category === cat && styles.chipActive]}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar categoria ${cat}`}
                  accessibilityState={{ selected: category === cat }}
                >
                  <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <CustomInput
            label="Categoria Personalizada"
            value={category}
            onChangeText={setCategory}
            placeholder="Ex: Trabalho, Faculdade..."
            testID="input-category"
          />

          <View style={styles.footer}>
            <CustomButton
              title={isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
              onPress={handleSubmit}
              disabled={!isValid}
              loading={saving}
              testID="btn-submit"
            />
            <CustomButton
              title="Voltar"
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
  const themeColors = COLORS[theme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.background },
    content: { padding: SPACING.lg, paddingBottom: 140 },
    pageTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: SPACING.lg,
      letterSpacing: -0.5,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginTop: SPACING.md,
      marginBottom: SPACING.sm,
      marginLeft: 4,
    },
    row: { marginBottom: SPACING.sm },
    segmentedControl: {
      backgroundColor: themeColors.inputBg,
      padding: 4,
      borderRadius: BORDER_RADIUS.md,
      flexDirection: 'row',
      marginHorizontal: 1,
      marginVertical: 6, // Margem para sombra não cortar
    },
    segment: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: BORDER_RADIUS.sm,
      minWidth: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentActive: {
      backgroundColor: themeColors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    segmentText: {
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.textMuted,
    },
    segmentTextActive: {
      color: themeColors.primary,
      fontWeight: '800',
    },
    iconScroll: { marginVertical: SPACING.md },
    iconChip: {
      width: 80,
      height: 80,
      borderRadius: BORDER_RADIUS.lg,
      backgroundColor: themeColors.inputBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    iconChipActive: {
      backgroundColor: themeColors.primary,
      borderColor: themeColors.primary,
    },
    iconLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted,
      marginTop: 4,
    },
    iconLabelActive: {
      color: '#FFFFFF',
    },
    categoriesScroll: { marginBottom: SPACING.md, paddingVertical: 4 },
    categoriesErrorBox: {
      marginBottom: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: theme === 'dark' ? '#EF444414' : '#FFF1F2',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      gap: SPACING.sm,
    },
    categoriesErrorText: {
      fontSize: 13,
      color: themeColors.text,
      fontWeight: '600',
    },
    retryButton: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1,
      borderColor: themeColors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme === 'dark' ? '#0F766E22' : '#F0FDFA',
    },
    retryButtonText: {
      color: themeColors.primary,
      fontSize: 12,
      fontWeight: '700',
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1.5,
      borderColor: themeColors.border,
      backgroundColor: themeColors.surface,
    },
    chipActive: {
      borderColor: themeColors.primary,
      backgroundColor: theme === 'dark' ? '#0F766E33' : '#F0FDFA',
    },
    chipText: {
      fontSize: 13,
      fontWeight: '600',
      color: themeColors.textMuted,
    },
    chipTextActive: {
      color: themeColors.primary,
      fontWeight: '800',
    },
    footer: { marginTop: SPACING.lg, gap: 4 },
  });
}
