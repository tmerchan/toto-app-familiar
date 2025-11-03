import React, { useEffect, useState } from 'react';
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
import { User, Phone, Pencil, X } from 'lucide-react-native';
import { useAuth } from '../../context/auth-context';
import { useElderly } from '../../context/elderly-context';
import { apiClient } from '../../api/client';
import type { ContactDTO } from '../../api/types';

const BRAND = '#6B8E23';
const MAX_WIDTH = 420;

interface TrustedContact {
  id: number;
  name: string;
  relationship: string;
  phone: string;
}

const sanitizePhone = (s: string) => s.replace(/[^\d+\-()\s]/g, '');
const isPhoneValid = (s: string) => {
  if (!/^[\d+\-()\s]*$/.test(s)) return false;
  const digits = s.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 20;
};

export default function ContactsScreen() {
  const { user } = useAuth();
  const { elderly, refreshElderly, isLoading: elderlyLoading, error: elderlyError } = useElderly();
  const [activeTab, setActiveTab] = useState<'elderly' | 'contacts'>('elderly');
  const [isEditing, setIsEditing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado temporal para edición del adulto mayor
  const [editedElderly, setEditedElderly] = useState({
    name: '',
    birthdate: '',
    phone: '',
    address: '',
    medicalInfo: ''
  });

  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);

  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });
  const [showRelationPicker, setShowRelationPicker] = useState(false);

  // Modal de confirmación de borrado
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cargar contactos desde el backend
  const loadContacts = async () => {
    if (!elderly?.id) return;

    try {
      setLoading(true);
      setError(null);
      const contacts = await apiClient.getContactsByElderlyId(elderly.id);
      setTrustedContacts(contacts.map(c => ({
        id: c.id!,
        name: c.name,
        relationship: c.relationship || '',
        phone: c.phone
      })));
    } catch (err: any) {
      console.error('Error loading contacts:', err);
      setError(err?.message || 'Error al cargar contactos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar contactos cuando el elderly esté disponible
  useEffect(() => {
    if (elderly?.id) {
      loadContacts();
      // Inicializar datos editables del elderly
      setEditedElderly({
        name: elderly.name || '',
        birthdate: elderly.birthdate || '',
        phone: elderly.phone || '',
        address: elderly.address || '',
        medicalInfo: elderly.medicalInfo || ''
      });
    }
  }, [elderly?.id]);

  // Guardar cambios del adulto mayor
  const handleSaveElderlyData = async () => {
    if (!elderly?.id) return;

    try {
      setLoading(true);
      await apiClient.updateUser(elderly.id, {
        name: editedElderly.name,
        birthdate: editedElderly.birthdate,
        phone: editedElderly.phone,
        address: editedElderly.address,
        medicalInfo: editedElderly.medicalInfo
      });
      await refreshElderly(); // Recargar datos del elderly
      setIsEditing(false);
      Alert.alert('Éxito', 'Información actualizada correctamente');
    } catch (err: any) {
      console.error('Error updating elderly:', err);
      Alert.alert('Error', err?.message || 'No se pudo actualizar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    Alert.alert('Cancelar cambios', '¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.', [
      { text: 'Continuar editando', style: 'cancel' },
      {
        text: 'Cancelar',
        style: 'destructive',
        onPress: () => {
          // Restaurar valores originales
          if (elderly) {
            setEditedElderly({
              name: elderly.name || '',
              birthdate: elderly.birthdate || '',
              phone: elderly.phone || '',
              address: elderly.address || '',
              medicalInfo: elderly.medicalInfo || ''
            });
          }
          setIsEditing(false);
        },
      },
    ]);
  };

  // Contactos - Ahora con API
  const handleAddContact = async () => {
    if (!elderly?.id) return;

    const name = newContact.name.trim();
    const relationship = newContact.relationship.trim();
    const phone = sanitizePhone(newContact.phone.trim());

    if (!name || !phone || !relationship) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    if (!isPhoneValid(phone)) {
      Alert.alert('Teléfono inválido', 'Usa solo números, + - ( ) y un mínimo de 6 dígitos.');
      return;
    }

    try {
      setLoading(true);
      const contactDTO: ContactDTO = {
        elderlyId: elderly.id,
        name,
        relationship,
        phone,
      };

      const created = await apiClient.createContact(contactDTO);
      setTrustedContacts((prev) => [...prev, {
        id: created.id!,
        name: created.name,
        relationship: created.relationship || '',
        phone: created.phone
      }]);

      setNewContact({ name: '', relationship: '', phone: '' });
      setShowContactModal(false);
      Alert.alert('Éxito', 'Contacto agregado correctamente');
    } catch (err: any) {
      console.error('Error adding contact:', err);
      Alert.alert('Error', err?.message || 'No se pudo agregar el contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditContact = (contact: TrustedContact) => {
    setEditingContact(contact);
    setNewContact({ name: contact.name, relationship: contact.relationship, phone: contact.phone });
    setShowContactModal(true);
  };

  const handleUpdateContact = async () => {
    if (!editingContact || !elderly?.id) return;

    const name = newContact.name.trim();
    const relationship = newContact.relationship.trim();
    const phone = sanitizePhone(newContact.phone.trim());

    if (!name || !phone || !relationship) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    if (!isPhoneValid(phone)) {
      Alert.alert('Teléfono inválido', 'Usa solo números, + - ( ) y un mínimo de 6 dígitos.');
      return;
    }

    try {
      setLoading(true);
      const contactDTO: ContactDTO = {
        elderlyId: elderly.id,
        name,
        relationship,
        phone,
      };

      const updated = await apiClient.updateContact(editingContact.id, contactDTO);
      setTrustedContacts((prev) =>
        prev.map((c) => (c.id === editingContact.id ? {
          id: updated.id!,
          name: updated.name,
          relationship: updated.relationship || '',
          phone: updated.phone
        } : c))
      );

      setNewContact({ name: '', relationship: '', phone: '' });
      setEditingContact(null);
      setShowContactModal(false);
      Alert.alert('Éxito', 'Contacto actualizado correctamente');
    } catch (err: any) {
      console.error('Error updating contact:', err);
      Alert.alert('Error', err?.message || 'No se pudo actualizar el contacto');
    } finally {
      setLoading(false);
    }
  };

  const askDeleteContact = (contactId: number) => {
    setConfirmDeleteId(contactId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      setLoading(true);
      await apiClient.deleteContact(confirmDeleteId);
      setTrustedContacts((prev) => prev.filter((c) => c.id !== confirmDeleteId));
      setConfirmDeleteId(null);
      setShowDeleteModal(false);
      Alert.alert('Éxito', 'Contacto eliminado correctamente');
    } catch (err: any) {
      console.error('Error deleting contact:', err);
      Alert.alert('Error', err?.message || 'No se pudo eliminar el contacto');
    } finally {
      setLoading(false);
    }
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

      {/* Contenido */}
      {activeTab === 'elderly' ? (
        // 👉 Esta pestaña sí usa ScrollView (no hay listas virtualizadas acá)
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sectionCentered}>
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.sectionTitle}>Información de la Persona Mayor</Text>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => {
                    if (isEditing) {
                      handleCancelEdit();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  <Pencil size={20} color={BRAND} />
                </TouchableOpacity>
              </View>

              {elderly ? (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Nombre:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={editedElderly.name}
                        onChangeText={(text) => setEditedElderly((p) => ({ ...p, name: text }))}
                        placeholder="Nombre completo"
                      />
                    ) : (
                      <Text style={styles.value}>{elderly.name || 'No disponible'}</Text>
                    )}
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Fecha de Nacimiento:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={editedElderly.birthdate}
                        onChangeText={(text) => setEditedElderly((p) => ({ ...p, birthdate: text }))}
                        placeholder="DD/MM/AAAA"
                      />
                    ) : (
                      <Text style={styles.value}>{elderly.birthdate || 'No disponible'}</Text>
                    )}
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Teléfono:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.input}
                        value={editedElderly.phone}
                        onChangeText={(text) =>
                          setEditedElderly((p) => ({ ...p, phone: sanitizePhone(text) }))
                        }
                        placeholder="Número de teléfono"
                        keyboardType="phone-pad"
                      />
                    ) : (
                      <Text style={styles.value}>{elderly.phone || 'No disponible'}</Text>
                    )}
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Dirección:</Text>
                    {isEditing ? (
                      <TextInput
                        style={[styles.input, styles.multilineInput]}
                        value={editedElderly.address}
                        onChangeText={(text) => setEditedElderly((p) => ({ ...p, address: text }))}
                        placeholder="Dirección completa"
                        multiline
                      />
                    ) : (
                      <Text style={styles.value}>{elderly.address || 'No disponible'}</Text>
                    )}
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Información Médica:</Text>
                    {isEditing ? (
                      <TextInput
                        style={[styles.input, styles.multilineInput]}
                        value={editedElderly.medicalInfo}
                        onChangeText={(text) => setEditedElderly((p) => ({ ...p, medicalInfo: text }))}
                        placeholder="Condiciones médicas, medicamentos, alergias"
                        multiline
                      />
                    ) : (
                      <Text style={styles.value}>{elderly.medicalInfo || 'No disponible'}</Text>
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
                </>
              ) : (
                <View style={styles.emptyState}>
                  <User size={48} color="#999" />
                  <Text style={styles.emptyText}>No hay información disponible</Text>
                  <Text style={styles.emptySubtext}>
                    Aún no se ha cargado la información de la persona mayor
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        // 👉 Esta pestaña NO debe estar dentro de un ScrollView
        <View style={[styles.content, { alignItems: 'center' }]}>
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
                  keyExtractor={(item) => item.id.toString()}
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
                        <TouchableOpacity style={styles.deleteButton} onPress={() => askDeleteContact(item.id)}>
                          <X size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={<View style={{ height: 8 }} />}
                />
              )}

              <TouchableOpacity style={styles.addButton} onPress={() => setShowContactModal(true)}>
                <Text style={styles.addButtonText}>Agregar nuevo contacto de confianza</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal Agregar/Editar contacto */}
      <Modal visible={showContactModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
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
              <Text style={styles.inputLabel}>Relación *</Text>
              <TouchableOpacity
                style={styles.modalInput}
                onPress={() => setShowRelationPicker(true)}
                activeOpacity={0.7}
              >
                <Text style={newContact.relationship ? styles.pickerButtonText : styles.pickerPlaceholder}>
                  {newContact.relationship || 'Selecciona una relación'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Teléfono *</Text>
              <TextInput
                style={styles.modalInput}
                value={newContact.phone}
                onChangeText={(text) =>
                  setNewContact((prev) => ({ ...prev, phone: sanitizePhone(text) }))
                }
                placeholder="Número de teléfono"
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={editingContact ? handleUpdateContact : handleAddContact}
            >
              <Text style={styles.modalSaveButtonText}>{editingContact ? 'Actualizar' : 'Guardar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmar borrado */}
      <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Eliminar contacto</Text>
            <Text style={styles.confirmText}>¿Seguro que querés eliminar este contacto?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.confirmCancel} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.confirmCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDelete} onPress={confirmDelete}>
                <Text style={styles.confirmDeleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal selector de relación */}
      <Modal visible={showRelationPicker} transparent animationType="slide" onRequestClose={() => setShowRelationPicker(false)}>
        <View style={styles.relationBackdrop}>
          <View style={styles.relationCard}>
            <Text style={styles.relationTitle}>Seleccionar relación</Text>
            {[
              'Hijo/Hija',
              'Cónyuge',
              'Médico',
              'Vecino',
              'Amigo',
              'Cuidador',
              'Otro',
            ].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.relationOption}
                onPress={() => {
                  setNewContact((prev) => ({ ...prev, relationship: opt }));
                  setShowRelationPicker(false);
                }}
              >
                <Text style={styles.relationOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.relationCancel} onPress={() => setShowRelationPicker(false)}>
              <Text style={styles.relationCancelText}>Cancelar</Text>
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
  title: { fontSize: 28, fontFamily: 'PlayfairDisplay-Bold', color: '#333', textAlign: 'center' },

  tabContainer: { flexDirection: 'row', backgroundColor: 'white', paddingHorizontal: 20 },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: BRAND },
  tabText: { fontSize: 16, color: '#666', fontWeight: '400', textAlign: 'center' },
  activeTabText: { color: BRAND, fontWeight: '400', textAlign: 'center' },

  content: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },

  sectionCentered: { width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },

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

  buttonRowCentered: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16 },
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

  // Modal página (add/editar)
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
  pickerButtonText: { fontSize: 16, color: '#111' },
  pickerPlaceholder: { fontSize: 16, color: '#9CA3AF' },
  modalSaveButton: {
    backgroundColor: BRAND,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalSaveButtonText: { color: 'white', fontSize: 16, fontWeight: '400', textAlign: 'center' },

  // Modal confirmación
  confirmBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  confirmCard: { width: '100%', maxWidth: 360, backgroundColor: 'white', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  confirmTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  confirmText: { fontSize: 14, color: '#374151', marginBottom: 18 },
  confirmActions: { flexDirection: 'row', gap: 10 },
  confirmCancel: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  confirmCancelText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  confirmDelete: { flex: 1, backgroundColor: '#EF4444', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  confirmDeleteText: { fontSize: 16, fontWeight: '600', color: 'white' },

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
  // Relation picker modal
  relationBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  relationCard: { backgroundColor: 'white', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  relationTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 8 },
  relationOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  relationOptionText: { fontSize: 16, color: '#111' },
  relationCancel: { marginTop: 8, paddingVertical: 12, alignItems: 'center' },
  relationCancelText: { fontSize: 16, color: '#6B7280' },
});
