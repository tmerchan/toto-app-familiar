import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Clock, Pill, Calendar as CalendarIcon, X } from 'lucide-react-native';

const BRAND = '#6B8E23';

interface Reminder {
  id: string;
  type: 'medication' | 'appointment' | 'event';
  title: string;
  description: string;
  time: string;
  date: string;
}

export default function CalendarScreen() {
  const [reminders, setReminders] = React.useState<Reminder[]>([
    {
      id: '1',
      type: 'medication',
      title: 'Losartán 50mg',
      description: 'Tomar con el desayuno',
      time: '08:00',
      date: '2024-10-01',
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Consulta con Dr. García',
      description: 'Chequeo de rutina',
      time: '15:00',
      date: '2024-10-05',
    },
  ]);

  const [showModal, setShowModal] = React.useState(false);
  const [editingReminder, setEditingReminder] = React.useState<Reminder | null>(null);
  const [newReminder, setNewReminder] = React.useState({
    type: 'medication' as 'medication' | 'appointment' | 'event',
    title: '',
    description: '',
    time: '',
    date: '',
  });

  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.time.trim() || !newReminder.date.trim()) {
      Alert.alert('Error', 'El título, hora y fecha son obligatorios');
      return;
    }
    const reminder: Reminder = {
      id: Date.now().toString(),
      type: newReminder.type,
      title: newReminder.title.trim(),
      description: newReminder.description.trim(),
      time: newReminder.time.trim(),
      date: newReminder.date.trim(),
    };
    setReminders((prev) => [...prev, reminder]);
    setNewReminder({ type: 'medication', title: '', description: '', time: '', date: '' });
    setShowModal(false);
    Alert.alert('Éxito', 'Recordatorio agregado correctamente');
  };

  const handleDeleteReminder = (reminderId: string) => {
    Alert.alert('Eliminar recordatorio', '¿Estás seguro de que quieres eliminar este recordatorio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          setReminders((prev) => prev.filter((r) => r.id !== reminderId));
          Alert.alert('Éxito', 'Recordatorio eliminado correctamente');
        },
      },
    ]);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReminder(null);
    setNewReminder({ type: 'medication', title: '', description: '', time: '', date: '' });
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill size={24} color={BRAND} />;
      case 'appointment':
        return <CalendarIcon size={24} color={BRAND} />;
      default:
        return <Clock size={24} color={BRAND} />;
    }
  };

  const getReminderTypeLabel = (type: string) => {
    switch (type) {
      case 'medication':
        return 'Medicación';
      case 'appointment':
        return 'Cita médica';
      default:
        return 'Evento';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Recordatorios</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <Plus size={24} color={BRAND} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <CalendarIcon size={48} color="#999" />
            <Text style={styles.emptyText}>No hay recordatorios</Text>
            <Text style={styles.emptySubtext}>
              Agrega recordatorios para medicación, citas y eventos
            </Text>
          </View>
        ) : (
          <View style={styles.remindersList}>
            {reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderIcon}>{getReminderIcon(reminder.type)}</View>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderType}>{getReminderTypeLabel(reminder.type)}</Text>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  {reminder.description && (
                    <Text style={styles.reminderDescription}>{reminder.description}</Text>
                  )}
                  <View style={styles.reminderDetails}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.reminderTime}>
                      {reminder.time} - {reminder.date}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteReminder(reminder.id)}
                >
                  <X size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Recordatorio</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo *</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newReminder.type === 'medication' && styles.typeButtonActive,
                  ]}
                  onPress={() => setNewReminder((prev) => ({ ...prev, type: 'medication' }))}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newReminder.type === 'medication' && styles.typeButtonTextActive,
                    ]}
                  >
                    Medicación
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newReminder.type === 'appointment' && styles.typeButtonActive,
                  ]}
                  onPress={() => setNewReminder((prev) => ({ ...prev, type: 'appointment' }))}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newReminder.type === 'appointment' && styles.typeButtonTextActive,
                    ]}
                  >
                    Cita
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, newReminder.type === 'event' && styles.typeButtonActive]}
                  onPress={() => setNewReminder((prev) => ({ ...prev, type: 'event' }))}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newReminder.type === 'event' && styles.typeButtonTextActive,
                    ]}
                  >
                    Evento
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título *</Text>
              <TextInput
                style={styles.modalInput}
                value={newReminder.title}
                onChangeText={(text) => setNewReminder((prev) => ({ ...prev, title: text }))}
                placeholder="Ej: Tomar aspirina"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                style={[styles.modalInput, styles.multilineInput]}
                value={newReminder.description}
                onChangeText={(text) => setNewReminder((prev) => ({ ...prev, description: text }))}
                placeholder="Detalles adicionales"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hora *</Text>
              <TextInput
                style={styles.modalInput}
                value={newReminder.time}
                onChangeText={(text) => setNewReminder((prev) => ({ ...prev, time: text }))}
                placeholder="HH:MM (ej: 14:30)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha *</Text>
              <TextInput
                style={styles.modalInput}
                value={newReminder.date}
                onChangeText={(text) => setNewReminder((prev) => ({ ...prev, date: text }))}
                placeholder="AAAA-MM-DD (ej: 2024-10-15)"
              />
            </View>

            <TouchableOpacity style={styles.modalSaveButton} onPress={handleAddReminder}>
              <Text style={styles.modalSaveButtonText}>Guardar</Text>
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
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  remindersList: {
    gap: 16,
    paddingBottom: 100,
  },
  reminderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderContent: {
    flex: 1,
  },
  reminderType: {
    fontSize: 12,
    color: BRAND,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reminderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderTime: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: BRAND,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  modalSaveButton: {
    backgroundColor: BRAND,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalSaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
