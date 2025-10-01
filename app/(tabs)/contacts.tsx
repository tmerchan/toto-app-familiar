import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { User, Phone, Plus, Pencil, X } from 'lucide-react-native';

const BRAND = '#6B8E23';
const MAX_WIDTH = 420; // ancho cómodo para centrar contenido

interface ElderlyPerson {
  name: string;
  birthDate: string;
  phone: string;
  address: string;
  medicalInfo: string;
  emergencyContact: string;
}

interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export default function ContactsScreen() {
  const [activeTab, setActiveTab] = React.useState<'elderly' | 'contacts'>('elderly');
  const [isEditing, setIsEditing] = React.useState(false);
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<TrustedContact | null>(null);

  // (Opcional) loading mientras se cargan cosas; aquí sin carga remota
  const [loading] = React.useState(false);
  const [error] = React.useState<string | null>(null);

  const [elderlyData, setElderlyData] = React.useState<ElderlyPerson>({
    name: 'Juan Pablo González',
    birthDate: '15/03/1945',
    phone: '+1 234 567 8900',
    address: 'Calle Principal 123, Ciudad Central',
    medicalInfo: 'Hipertensión arterial, toma Losartán 50mg diario. Alérgico a la penicilina.',
    emergencyContact: 'Tamara González - Hija',
  });

  const [trustedContacts, setTrustedContacts] = React.useState<TrustedContact[]>([
    { id: '1', name: 'Tamara González', relationship: 'Hija', phone: '+1 234 567 8901' },
    { id: '2', name: 'Dr. García', relationship: 'Médico', phone: '+1 234 567 8902' },
  ]);

  const [newContact, setNewContact] = React.useState({
    name: '',
    relationship: '',
    phone: '',
  });

  const handleSaveElderlyData = () => {
    setIsEditing(false);
    Alert.alert('Éxito', 'Información guardada correctamente');
  };

  const handleCancelEdit = () => {
    Alert.alert('Cancelar cambios', '¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.', [
      { text: 'Continuar editando', style: 'cancel' },
      { text: 'Cancelar', style: 'destructive', onPress: () => setIsEditing(false) },
    ]);
  };

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Error', 'El nombre y teléfono son obligatorios');
      return;
    }
    const contact: TrustedContact = {
      id: Date.now().toString(),
      name: newContact.name.trim(),
      relationship: newContact.relationship.trim(),
      phone: newContact.phone.trim(),
    };
    setTrustedContacts((prev) => [...prev, contact]);
    setNewContact({ name: '', relationship: '', phone: '' });
    setShowContactModal(false);
    Alert.alert('Éxito', 'Contacto agregado correctamente');
  };

  const handleEditContact = (contact: TrustedContact) => {
    setEditingContact(contact);
    setNewContact({ name: contact.name, relationship: contact.relationship, phone: contact.phone });
    setShowContactModal(true);
  };

  const handleUpdateContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Error', 'El nombre y teléfono son obligatorios');
      return;
    }
    if (!editingContact) return;
    setTrustedContacts((prev) =>
      prev.map((c) =>
        c.id === editingContact.id
          ? { ...c, name: newContact.name.trim(), relationship: newContact.relationship.trim(), phone: newContact.phone.trim() }
          : c
      )
    );
    setNewContact({ name: '', relationship: '', phone: '' });
    setEditingContact(null);
    setShowContactModal(false);
    Alert.alert('Éxito', 'Contacto actualizado correctamente');
  };

  const handleDeleteContact = (contactId: string) => {
    Alert.alert('Eliminar contacto', '¿Estás seguro de que quieres eliminar este contacto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          setTrustedContacts((prev) => prev.filter((c) => c.id !== contactId));
          Alert.alert('Éxito', 'Contacto eliminado correctamente');
        },
      },
    ]);
  };

  const closeModal = () => {
    setShowContactModal(false);
    setEditingContact(null);
    setNewContact({ name: '', relationship: '', phone: '' });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BRAND} />
        <Text style={styles.loadingText}>Cargando contactos…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Contactos</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'elderly' && styles.activeTab]}
          onPress={() => setActiveTab('elderly')}
        >
          <Text style={[styles.tabText, activeTab === 'elderly' && styles.activeTabText]}>Persona Mayor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contacts' && styles.activeTab]}
          onPress={() => setActiveTab('contacts')}
        >
          <Text style={[styles.tabText, activeTab === 'contacts' && styles.activeTabText]}>
            Contactos de Confianza
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido centrado */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'elderly' ? (
          <View style={styles.sectionCentered}>
            <View style={styles.infoCard}>
              {/* Cabecera dentro de la tarjeta con lápiz */}
              <View style={styles.cardHeaderRow}>
                <Text style={styles.sectionTitle}>Información de la Persona Mayor</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={() => setIsEditing(!isEditing)}>
                  <Pencil size={20} color={BRAND} />
                </TouchableOpacity>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Nombre:</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={elderlyData.name}
                    onChangeText={(text) => setElderlyData((p) => ({ ...p, name: text }))}
                    placeholder="Nombre completo"
                  />
                ) : (
                  <Text style={styles.value}>{elderlyData.name}</Text>
                )}
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Fecha de Nacimiento:</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={elderlyData.birthDate}
                    onChangeText={(text) => setElderlyData((p) => ({ ...p, birthDate: text }))}
                    placeholder="DD/MM/AAAA"
                  />
                ) : (
                  <Text style={styles.value}>{elderlyData.birthDate}</Text>
                )}
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Teléfono:</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={elderlyData.phone}
                    onChangeText={(text) => setElderlyData((p) => ({ ...p, phone: text }))}
                    placeholder="Número de teléfono"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.value}>{elderlyData.phone}</Text>
                )}
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Dirección:</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={elderlyData.address}
                    onChangeText={(text) => setElderlyData((p) => ({ ...p, address: text }))}
                    placeholder="Dirección completa"
                    multiline
                  />
                ) : (
                  <Text style={styles.value}>{elderlyData.address}</Text>
                )}
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Información Médica:</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={elderlyData.medicalInfo}
                    onChangeText={(text) => setElderlyData((p) => ({ ...p, medicalInfo: text }))}
                    placeholder="Condiciones médicas, medicamentos, alergias"
                    multiline
                  />
                ) : (
                  <Text style={styles.value}>{elderlyData.medicalInfo}</Text>
                )}
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Contacto de Emergencia:</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={elderlyData.emergencyContact}
                    onChangeText={(text) => setElderlyData((p) => ({ ...p, emergencyContact: text }))}
                    placeholder="Nombre y relación"
                  />
                ) : (
                  <Text style={styles.value}>{elderlyData.emergencyContact}</Text>
                )}
              </View>

              {isEditing && (
                <View style={styles.buttonRowCentered}>
                  <TouchableOpacity style={styles.btnSecondary} onPress={handleCancelEdit}>
                    <Text style={styles.btnSecondaryText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveElderlyData}>
                    <Text style={styles.btnPrimaryText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.sectionCentered}>
            <View style={styles.infoCard}>
              <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 8 }]}>
                Contactos de Confianza
              </Text>

              {trustedContacts.length === 0 ? (
                <View style={styles.emptyState}>
                  <User size={48} color="#999" />
                  <Text style={styles.emptyText}>No hay contactos de confianza</Text>
                  <Text style={styles.emptySubtext}>
                    Agrega contactos que puedan ayudar en caso de emergencia
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={trustedContacts}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingVertical: 4 }}
                  renderItem={({ item }) => (
                    <View style={styles.contactCard}>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{item.name}</Text>
                        <Text style={styles.contactRelation}>{item.relationship}</Text>
                        <View style={styles.contactDetails}>
                          <View style={styles.contactDetail}>
                            <Phone size={16} color="#666" />
                            <Text style={styles.contactDetailText}>{item.phone}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.contactActions}>
                        <TouchableOpacity style={styles.editContactButton} onPress={() => handleEditContact(item)}>
                          <Pencil size={18} color={BRAND} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteContact(item.id)}>
                          <X size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              )}

              <TouchableOpacity style={styles.addButton} onPress={() => setShowContactModal(true)}>
                <Text style={styles.addButtonText}>Agregar nuevo contacto de confianza</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal para agregar/editar contacto */}
      <Modal visible={showContactModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre *</Text>
              <TextInput
                style={styles.modalInput}
                value={newContact.name}
                onChangeText={(text) => setNewContact((prev) => ({ ...prev, name: text }))}
                placeholder="Nombre completo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Relación</Text>
              <TextInput
                style={styles.modalInput}
                value={newContact.relationship}
                onChangeText={(text) => setNewContact((prev) => ({ ...prev, relationship: text }))}
                placeholder="Ej: Hijo, Médico, Vecino"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Teléfono *</Text>
              <TextInput
                style={styles.modalInput}
                value={newContact.phone}
                onChangeText={(text) => setNewContact((prev) => ({ ...prev, phone: text }))}
                placeholder="Número de teléfono"
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity style={styles.modalSaveButton} onPress={editingContact ? handleUpdateContact : handleAddContact}>
              <Text style={styles.modalSaveButtonText}>{editingContact ? 'Actualizar' : 'Guardar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {error && Platform.OS !== 'web' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },

  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: { fontSize: 28, fontWeight: '700', color: '#333', textAlign: 'center' },

  tabContainer: { flexDirection: 'row', backgroundColor: 'white', paddingHorizontal: 20 },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: BRAND },
  tabText: { fontSize: 16, color: '#666', fontWeight: '400' },
  activeTabText: { color: BRAND, fontWeight: '400' },

  content: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },

  sectionCentered: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
  },

  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconBtn: { padding: 6, borderRadius: 8, backgroundColor: '#F3F4F6' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333' },

  infoRow: { marginTop: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  value: { fontSize: 16, color: '#333', lineHeight: 22 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: { minHeight: 80, textAlignVertical: 'top' },

  buttonRowCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  btnSecondary: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: { fontSize: 16, fontWeight: '400', color: '#666', textAlign: 'center' },
  btnPrimary: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: BRAND,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '400', color: 'white', textAlign: 'center' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  emptyText: { fontSize: 18, fontWeight: '400', color: '#666', marginTop: 16, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20 },

  contactCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 2 },
  contactRelation: { fontSize: 13, color: '#666', marginBottom: 6 },
  contactDetails: { gap: 4 },
  contactDetail: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contactDetailText: { fontSize: 14, color: '#666' },

  contactActions: { flexDirection: 'row', gap: 8, marginLeft: 8 },
  editContactButton: { padding: 8 },
  deleteButton: { backgroundColor: '#EF4444', padding: 8, borderRadius: 6 },

  addButton: {
    backgroundColor: BRAND,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
    alignSelf: 'center',
  },
  addButtonText: { color: 'white', fontSize: 15, fontWeight: '400', textAlign: 'center' },

  // Modal centrado
  modalContainer: { flex: 1, backgroundColor: 'white' },
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
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  closeButton: { padding: 4 },
  modalContent: { flex: 1, padding: 20, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 6 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalSaveButton: {
    backgroundColor: BRAND,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalSaveButtonText: { color: 'white', fontSize: 16, fontWeight: '400', textAlign: 'center' },

  // Error
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: { color: '#c62828', fontSize: 14, textAlign: 'center' },
});