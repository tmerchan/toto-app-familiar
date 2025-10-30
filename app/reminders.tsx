import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Plus, Pill, Calendar as CalendarIcon, Clock, Pencil, Trash2, Save, X, Bell, ChevronLeft } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../context/auth-context';
import { apiClient } from '../api/client';
import { ReminderDTO } from '../api/types';

const onlyDigits = (s: string) => s.replace(/\D/g, '');

const formatDate = (s: string) => {
  const d = onlyDigits(s).slice(0, 8);
  const dd = d.slice(0, 2);
  const mm = d.slice(2, 4);
  const yyyy = d.slice(4, 8);
  let out = dd;
  if (mm) out += '/' + mm;
  if (yyyy) out += '/' + yyyy;
  return out;
};

const isValidDate = (s: string) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return false;
  const dd = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const yyyy = parseInt(m[3], 10);
  if (yyyy < 1900 || yyyy > 2100) return false;
  if (mm < 1 || mm > 12) return false;
  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  return dd >= 1 && dd <= daysInMonth;
};

const formatTime = (s: string) => {
  const d = onlyDigits(s).slice(0, 6); // HH MM SS
  const hh = d.slice(0, 2);
  const mm = d.slice(2, 4);
  const ss = d.slice(4, 6);
  let out = hh;
  if (mm) out += ':' + mm;
  if (ss) out += ':' + ss;
  return out;
};

const isValidTime = (s: string) => {
  return /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(s);
};

// Local interface for UI purposes
interface Reminder {
  id: number;
  type: 'medication' | 'appointment' | 'event';
  title: string;
  description: string;
  date: string; // DD/MM/AAAA
  time: string; // HH:MM o HH:MM:SS
  isActive: boolean;
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  leadTimeMinutes?: number;
  dosage?: string;
  doctor?: string;
  location?: string;
}

// Helper to convert ReminderDTO to local Reminder format
const fromDTO = (dto: ReminderDTO): Reminder => {
  const reminderDate = new Date(dto.reminderTime);
  const dd = String(reminderDate.getDate()).padStart(2, '0');
  const mm = String(reminderDate.getMonth() + 1).padStart(2, '0');
  const yyyy = reminderDate.getFullYear();
  const hh = String(reminderDate.getHours()).padStart(2, '0');
  const min = String(reminderDate.getMinutes()).padStart(2, '0');
  
  // Parse description for extra fields (format: type|key:value|key:value|...)
  const parts = (dto.description || '').split('|');
  const type = (parts[0] || 'medication') as 'medication' | 'appointment' | 'event';
  
  let dosage: string | undefined;
  let doctor: string | undefined;
  let location: string | undefined;
  let leadTimeMinutes: number | undefined;
  let description = '';
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('dosage:')) {
      dosage = part.substring(7);
    } else if (part.startsWith('doctor:')) {
      doctor = part.substring(7);
    } else if (part.startsWith('location:')) {
      location = part.substring(9);
    } else if (part.startsWith('leadTime:')) {
      leadTimeMinutes = parseInt(part.substring(9), 10);
    } else {
      description = part;
    }
  }
  
  return {
    id: dto.id || 0,
    type,
    title: dto.title,
    description,
    date: `${dd}/${mm}/${yyyy}`,
    time: `${hh}:${min}`,
    isActive: dto.active ?? true,
    frequency: dto.repeatPattern === 'DAILY' ? 'daily' :
               dto.repeatPattern === 'WEEKLY' ? 'weekly' :
               dto.repeatPattern === 'MONTHLY' ? 'monthly' :
               dto.repeatPattern === 'NONE' ? 'once' : 'once',
    dosage,
    doctor,
    location,
    leadTimeMinutes
  };
};

// Helper to convert local Reminder to ReminderDTO
const toDTO = (reminder: Partial<Reminder>, elderlyId: number): Omit<ReminderDTO, 'id' | 'createdAt' | 'updatedAt'> => {
  // Combine date (DD/MM/YYYY) and time (HH:MM) into ISO 8601
  const dateParts = (reminder.date || '').split('/');
  const timeParts = (reminder.time || '').split(':');
  const isoString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}:00`;
  
  // Encode extra data into description field
  const descParts: string[] = [reminder.type || 'medication'];
  if (reminder.dosage) descParts.push(`dosage:${reminder.dosage}`);
  if (reminder.doctor) descParts.push(`doctor:${reminder.doctor}`);
  if (reminder.location) descParts.push(`location:${reminder.location}`);
  if (reminder.leadTimeMinutes) descParts.push(`leadTime:${reminder.leadTimeMinutes}`);
  if (reminder.description) descParts.push(reminder.description);
  
  return {
    elderlyId,
    title: reminder.title || '',
    description: descParts.join('|'),
    reminderTime: isoString,
    repeatPattern: reminder.frequency === 'daily' ? 'DAILY' :
                   reminder.frequency === 'weekly' ? 'WEEKLY' :
                   reminder.frequency === 'monthly' ? 'MONTHLY' : 'NONE',
    active: reminder.isActive ?? true
  };
};

export default function RemindersScreen() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'medication' | 'appointment' | 'event'>('all');
  const [formData, setFormData] = useState<Partial<Reminder>>({
    type: 'medication',
    title: '',
    description: '',
    date: '',
    time: '',
    isActive: true,
    frequency: 'daily',
    leadTimeMinutes: undefined,
    dosage: '',
    doctor: '',
    location: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load reminders from API
  const loadReminders = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await apiClient.getRemindersByElderlyId(user.id, false);
      setReminders(data.map(fromDTO));
    } catch (error: any) {
      console.error('Error loading reminders:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar los recordatorios');
    } finally {
      setLoading(false);
    }
  };

  // Load reminders when component mounts or user changes
  useEffect(() => {
    loadReminders();
  }, [user]);

  const setField = (key: keyof Reminder, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[key as string];
      return copy;
    });
  };

  const resetForm = () => {
    setFormData({
      type: 'medication',
      title: '',
      description: '',
      date: '',
      time: '',
      isActive: true,
      frequency: 'daily',
      leadTimeMinutes: undefined,
      dosage: '',
      doctor: '',
      location: ''
    });
    setEditingReminder(null);
    setErrors({});
  };

  const openModal = (reminder?: Reminder) => {
    if (reminder) {
      setFormData(reminder);
      setEditingReminder(reminder);
      setErrors({});
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const saveReminder = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = 'El título es obligatorio.';
    if (!formData.date) newErrors.date = 'La fecha es obligatoria.';
    if (!formData.time) newErrors.time = 'La hora es obligatoria.';

    if (formData.date && !isValidDate(formData.date)) {
      newErrors.date = 'La fecha no es válida. Usa el formato DD/MM/AAAA.';
    }

    if (formData.time && !isValidTime(formData.time)) {
      newErrors.time = 'La hora no es válida. Usa HH:MM o HH:MM:SS (min/seg 00–59).';
    }

    if ((formData.type === 'appointment' || formData.type === 'event') && formData.leadTimeMinutes != null) {
      if (Number.isNaN(formData.leadTimeMinutes) || formData.leadTimeMinutes < 0) {
        newErrors.leadTimeMinutes = 'La anticipación debe ser un número de minutos (0 o más).';
      }
    }

    if (formData.type === 'event' && formData.frequency && !['once', 'yearly'].includes(formData.frequency)) {
      newErrors.frequency = 'Para eventos, solo se admite "Una vez" o "Anual".';
    }

    if (formData.type === 'appointment' && formData.frequency) {
      newErrors.frequency = 'Las citas no tienen frecuencia de repetición.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    const reminderData: Reminder = {
      id: editingReminder?.id || Date.now(),
      type: formData.type || 'medication',
      title: formData.title?.trim() || '',
      description: formData.description || '',
      date: formData.date || '',
      time: formData.time || '',
      isActive: formData.isActive ?? true,
      frequency:
        formData.type === 'medication'
          ? (formData.frequency || 'daily')
          : formData.type === 'event'
            ? (formData.frequency || 'once')
            : undefined,
      leadTimeMinutes:
        formData.type === 'appointment' || formData.type === 'event'
          ? (formData.leadTimeMinutes ?? undefined)
          : undefined,
      dosage: formData.dosage,
      doctor: formData.doctor,
      location: formData.location
    };

    try {
      setLoading(true);
      if (editingReminder) {
        // Update existing reminder
        const dto = toDTO(reminderData, user.id);
        await apiClient.updateReminder(editingReminder.id, { ...dto, id: editingReminder.id });
        Alert.alert('Éxito', 'Recordatorio actualizado correctamente');
      } else {
        // Create new reminder
        const dto = toDTO(reminderData, user.id);
        await apiClient.createReminder(dto);
        Alert.alert('Éxito', 'Recordatorio creado correctamente');
      }
      await loadReminders(); // Reload from server
      closeModal();
    } catch (error: any) {
      console.error('Error saving reminder:', error);
      Alert.alert('Error', error.message || 'No se pudo guardar el recordatorio');
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (id: number) => {
    Alert.alert(
      'Eliminar Recordatorio',
      '¿Estás seguro de que quieres eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.deleteReminder(id);
              Alert.alert('Éxito', 'Recordatorio eliminado');
              await loadReminders();
            } catch (error: any) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar el recordatorio');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const toggleReminderStatus = async (id: number) => {
    try {
      setLoading(true);
      await apiClient.toggleReminderActive(id);
      await loadReminders();
    } catch (error: any) {
      console.error('Error toggling reminder:', error);
      Alert.alert('Error', error.message || 'No se pudo cambiar el estado del recordatorio');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReminders = () => {
    if (activeTab === 'all') return reminders;
    return reminders.filter(r => r.type === activeTab);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill size={20} color="#10B981" />;
      case 'appointment': return <CalendarIcon size={20} color="#3B82F6" />;
      case 'event': return <Clock size={20} color="#F59E0B" />;
      default: return <Bell size={20} color="#6B7280" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return '#10B981';
      case 'appointment': return '#3B82F6';
      case 'event': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'medication': return 'Medicación';
      case 'appointment': return 'Cita';
      case 'event': return 'Evento';
      default: return 'Recordatorio';
    }
  };

  const renderTabButton = (
    tab: typeof activeTab,
    title: string,
    extraStyle?: object
  ) => (
    <TouchableOpacity
      style={[styles.tabButton, extraStyle, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderReminderCard = (reminder: Reminder) => (
    <View key={reminder.id} style={[styles.reminderCard, !reminder.isActive && styles.inactiveCard]}>
      <View style={styles.reminderHeader}>
        <View style={styles.reminderTypeContainer}>
          {getTypeIcon(reminder.type)}
          <Text style={[styles.reminderType, { color: getTypeColor(reminder.type) }]}>
            {getTypeLabel(reminder.type)}
          </Text>
        </View>
        <View style={styles.reminderActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleReminderStatus(reminder.id)}
          >
            <Bell size={16} color={reminder.isActive ? '#10B981' : '#9CA3AF'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openModal(reminder)}
          >
            <Pencil size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteReminder(reminder.id)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.reminderTitle}>{reminder.title}</Text>
      {reminder.description && (
        <Text style={styles.reminderDescription}>{reminder.description}</Text>
      )}

      <View style={styles.reminderDetails}>
        <Text style={styles.reminderDateTime}>
          📅 {reminder.date} • ⏰ {reminder.time}
        </Text>

        {reminder.frequency && (
          <Text style={styles.reminderFrequency}>
            🔄 {
              reminder.frequency === 'daily' ? 'Diario' :
              reminder.frequency === 'weekly' ? 'Semanal' :
              reminder.frequency === 'monthly' ? 'Mensual' :
              reminder.frequency === 'yearly' ? 'Anual' : 'Una vez'
            }
          </Text>
        )}

        {(reminder.type === 'appointment' || reminder.type === 'event') && typeof reminder.leadTimeMinutes === 'number' && (
          <Text style={styles.reminderExtra}>⏳ Anticipación: {reminder.leadTimeMinutes} min</Text>
        )}
      </View>

      {reminder.type === 'medication' && reminder.dosage && (
        <Text style={styles.reminderExtra}>💊 Dosis: {reminder.dosage}</Text>
      )}
      {reminder.type === 'appointment' && reminder.doctor && (
        <Text style={styles.reminderExtra}>👨‍⚕️ Doctor: {reminder.doctor}</Text>
      )}
      {(reminder.type === 'appointment' || reminder.type === 'event') && reminder.location && (
        <Text style={styles.reminderExtra}>📍 Lugar: {reminder.location}</Text>
      )}
    </View>
  );

  const renderFormField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    multiline = false,
    keyboardType: any = 'default',
    errorKey?: keyof Reminder
  ) => {
    const errMsg = errorKey ? errors[errorKey as string] : undefined;
    const isError = !!errMsg;
    return (
      <View style={styles.formField}>
        <Text style={styles.formLabel}>{label}</Text>
        <TextInput
          style={[
            styles.formInput,
            multiline && styles.textArea,
            isError && styles.errorInput
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          keyboardType={keyboardType}
          maxLength={
            label.startsWith('Fecha') ? 10 :
            label.startsWith('Hora') ? 8 : undefined
          }
        />
        {isError && <Text style={styles.errorText}>{errMsg}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recordatorios</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {renderTabButton('all', 'Todos')}
          {renderTabButton('medication', 'Medicación', { minWidth: 150 })} 
          {renderTabButton('appointment', 'Citas')}
          {renderTabButton('event', 'Eventos')}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {loading && reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.emptySubtitle}>Cargando recordatorios...</Text>
          </View>
        ) : getFilteredReminders().length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No hay recordatorios</Text>
            <Text style={styles.emptySubtitle}>
              Presiona el botón + para crear tu primer recordatorio
            </Text>
          </View>
        ) : (
          <View style={styles.remindersContainer}>
            {getFilteredReminders().map(renderReminderCard)}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingReminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Tipo de recordatorio</Text>
              <View style={styles.typeSelector}>
                {(['medication', 'appointment', 'event'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      formData.type === type && styles.activeTypeButton,
                      { borderColor: getTypeColor(type) }
                    ]}
                    onPress={() => {
                      if (type === 'medication') {
                        setFormData({
                          ...formData,
                          type,
                          frequency: 'daily',
                          leadTimeMinutes: undefined
                        });
                      } else if (type === 'event') {
                        setFormData({
                          ...formData,
                          type,
                          frequency: 'once',
                        });
                      } else {
                        setFormData({
                          ...formData,
                          type,
                          frequency: undefined,
                        });
                      }
                      setErrors(prev => {
                        const copy = { ...prev };
                        delete copy.frequency;
                        delete copy.leadTimeMinutes;
                        return copy;
                      });
                    }}
                  >
                    {getTypeIcon(type)}
                    <Text
                      style={[
                        styles.typeButtonText,
                        formData.type === type && { color: getTypeColor(type) }
                      ]}
                      numberOfLines={2}
                    >
                      {getTypeLabel(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {renderFormField(
              'Título *',
              formData.title || '',
              (text) => setField('title', text),
              'Ej: Tomar aspirina, Cita con cardiólogo',
              false,
              'default',
              'title'
            )}

            {renderFormField(
              'Descripción',
              formData.description || '',
              (text) => setField('description', text),
              'Detalles adicionales...',
              true
            )}

            {renderFormField(
              'Fecha *',
              formData.date || '',
              (text) => setField('date', formatDate(text)),
              'DD/MM/AAAA',
              false,
              'numeric',
              'date'
            )}

            {renderFormField(
              'Hora *',
              formData.time || '',
              (text) => setField('time', formatTime(text)),
              'HH:MM o HH:MM:SS',
              false,
              'numeric',
              'time'
            )}

            {formData.type === 'medication' && (
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Frecuencia</Text>
                <View style={styles.frequencySelector}>
                  {(['once', 'daily', 'weekly', 'monthly'] as const).map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        formData.frequency === freq && styles.activeFrequencyButton
                      ]}
                      onPress={() => setField('frequency', freq)}
                    >
                      <Text
                        style={[
                          styles.frequencyButtonText,
                          formData.frequency === freq && styles.activeFrequencyButtonText
                        ]}
                        numberOfLines={2}
                      >
                        {freq === 'once' ? 'Una vez' :
                         freq === 'daily' ? 'Diario' :
                         freq === 'weekly' ? 'Semanal' : 'Mensual'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.frequency && <Text style={styles.errorText}>{errors.frequency}</Text>}
              </View>
            )}

            {/* ====== FRECUENCIA (Eventos) ====== */}
            {formData.type === 'event' && (
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Repetición (evento)</Text>
                <View style={styles.frequencySelector}>
                  {(['once', 'yearly'] as const).map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        formData.frequency === freq && styles.activeFrequencyButton
                      ]}
                      onPress={() => setField('frequency', freq)}
                    >
                      <Text
                        style={[
                          styles.frequencyButtonText,
                          formData.frequency === freq && styles.activeFrequencyButtonText
                        ]}
                        numberOfLines={2}
                      >
                        {freq === 'once' ? 'Una vez' : 'Anual'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.frequency && <Text style={styles.errorText}>{errors.frequency}</Text>}
              </View>
            )}

            {(formData.type === 'appointment' || formData.type === 'event') && renderFormField(
              'Anticipación (minutos)',
              formData.leadTimeMinutes != null ? String(formData.leadTimeMinutes) : '',
              (text) => {
                const digits = text.replace(/\D/g, '');
                setField('leadTimeMinutes', digits === '' ? undefined : Math.min(1440, parseInt(digits, 10)));
              },
              'Ej: 15, 30, 60',
              false,
              'numeric',
              'leadTimeMinutes'
            )}

            {formData.type === 'medication' && renderFormField(
              'Dosis',
              formData.dosage || '',
              (text) => setField('dosage', text),
              'Ej: 1 pastilla, 5ml'
            )}

            {formData.type === 'appointment' && renderFormField(
              'Doctor/Especialista',
              formData.doctor || '',
              (text) => setField('doctor', text),
              'Ej: Dr. García, Cardiólogo'
            )}

            {(formData.type === 'appointment' || formData.type === 'event') && renderFormField(
              'Lugar',
              formData.location || '',
              (text) => setField('location', text),
              'Ej: Hospital Central, Sala 205'
            )}

            <View style={styles.formField}>
              <View style={styles.switchContainer}>
                <Text style={styles.formLabel}>Recordatorio activo</Text>
                <Switch
                  value={!!formData.isActive}
                  onValueChange={(value) => setField('isActive', value)}
                  trackColor={{ false: '#E5E7EB', true: '#6B8E23' }}
                  thumbColor={formData.isActive ? '#FFFFFF' : '#9CA3AF'}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
              <Text style={styles.saveButtonText}>
                {editingReminder ? 'Actualizar' : 'Guardar'} Recordatorio
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#6B8E23',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
    minWidth: 110,
  },
  activeTabButton: {
    backgroundColor: '#6B8E23',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabButtonText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  remindersContainer: {
    padding: 24,
    gap: 16,
  },
  reminderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inactiveCard: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  reminderDetails: {
    marginBottom: 8,
  },
  reminderDateTime: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  reminderFrequency: {
    fontSize: 14,
    color: '#6B8E23',
  },
  reminderExtra: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  /* ===== Modal ===== */
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },

  /* ===== Form ===== */
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  errorInput: {
    borderColor: '#EF4444',
  },
  errorText: {
    marginTop: 6,
    color: '#EF4444',
    fontSize: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    flexGrow: 1,
    flexBasis: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    gap: 8,
  },
  activeTypeButton: {
    backgroundColor: '#F9FAFB',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
  },

  frequencySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  frequencyButton: {
    flexGrow: 1,
    flexBasis: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFrequencyButton: {
    backgroundColor: '#6B8E23',
  },
  frequencyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  activeFrequencyButtonText: {
    color: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#6B8E23',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tabWrapper: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsRow: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
});
