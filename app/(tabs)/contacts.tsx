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

const formatBirthdate = (text: string) => {
  // Eliminar todo lo que no sea número
  const numbers = text.replace(/[^\d]/g, '');
  
  // Limitar a 8 dígitos
  const limited = numbers.slice(0, 8);
  
  // Aplicar formato DD/MM/AAAA
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
};

const validateBirthdate = (dateString: string): boolean => {
  // Verificar formato DD/MM/AAAA
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Verificar rangos básicos
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  // Verificar año razonable (menor de 120 años)
  const currentYear = new Date().getFullYear();
  if (year < currentYear - 120 || year > currentYear) return false;
  
  // Verificar días por mes
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Año bisiesto
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (isLeapYear) daysInMonth[1] = 29;
  
  if (day > daysInMonth[month - 1]) return false;
  
  return true;
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
  const [elderlyToken, setElderlyToken] = useState<string | null>(null);

  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });
  const [showRelationPicker, setShowRelationPicker] = useState(false);

  // Modal de confirmación de borrado
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Modal para crear adulto mayor
  const [showCreateElderlyModal, setShowCreateElderlyModal] = useState(false);
  const [newElderlyData, setNewElderlyData] = useState({
    name: '',
    birthdate: '',
    phone: '',
    address: '',
    medicalInfo: ''
  });

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

  // Cargar token del adulto mayor
  const loadElderlyToken = async () => {
    if (!elderly?.id) return;

    try {
      const response = await apiClient.getElderlyAccessToken(elderly.id);
      setElderlyToken(response.token);
    } catch (err: any) {
      console.error('Error loading token:', err);
      // No mostramos error al usuario, simplemente no se muestra el token
    }
  };

  // Cargar contactos cuando el elderly esté disponible
  useEffect(() => {
    if (elderly?.id) {
      loadContacts();
      loadElderlyToken();
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

    if (!validateBirthdate(editedElderly.birthdate)) {
      Alert.alert('Error', 'La fecha de nacimiento no es válida. Usa el formato DD/MM/AAAA.');
      return;
    }

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

  const handleCreateElderly = async () => {
    const { name, birthdate, phone, address, medicalInfo } = newElderlyData;

    if (!name || !birthdate || !phone || !address || !medicalInfo) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!validateBirthdate(birthdate)) {
      Alert.alert('Error', 'La fecha de nacimiento no es válida. Usa el formato DD/MM/AAAA.');
      return;
    }

    try {
      setLoading(true);
      
      // Crear el adulto mayor usando el endpoint correcto
      const createdElderly = await apiClient.createElderly({
        name,
        phone,
        address,
        birthdate,
        medicalInfo,
      });

      // Crear la relación de cuidado entre el caregiver actual y el elderly
      if (createdElderly.id) {
        await apiClient.createCareRelationship(createdElderly.id, 'Familiar');
      }

      // Recargar la información del elderly
      await refreshElderly();
      
      setShowCreateElderlyModal(false);
      setNewElderlyData({
        name: '',
        birthdate: '',
        phone: '',
        address: '',
        medicalInfo: ''
      });
      
      Alert.alert('Éxito', 'Adulto mayor creado correctamente');
    } catch (err: any) {
      console.error('Error creating elderly:', err);
      Alert.alert('Error', err?.message || 'No se pudo crear el adulto mayor');
    } finally {
      setLoading(false);
    }
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
                {elderly && (
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
                )}
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
                        onChangeText={(text) => {
                          const formatted = formatBirthdate(text);
                          setEditedElderly((p) => ({ ...p, birthdate: formatted }));
                        }}
                        placeholder="DD/MM/AAAA"
                        keyboardType="numeric"
                        maxLength={10}
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

                  {/* Token del adulto mayor */}
                  {elderlyToken && (
                    <View style={styles.tokenBox}>
                      <Text style={styles.tokenLabel}>Token:</Text>
                      <Text style={styles.tokenValue}>{elderlyToken}</Text>
                    </View>
                  )}

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
                  <Text style={styles.emptyText}>No hay información del adulto mayor</Text>
                  <Text style={styles.emptySubtext}>
                    Crea el perfil de la persona mayor que acompañarás
                  </Text>
                  <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => setShowCreateElderlyModal(true)}
                  >
                    <Text style={styles.addButtonText}>Crear Adulto Mayor</Text>
                  </TouchableOpacity>
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

              {!elderly ? (
                <View style={styles.emptyState}>
                  <User size={48} color="#999" />
                  <Text style={styles.emptyText}>Primero debes crear un adulto mayor</Text>
                  <Text style={styles.emptySubtext}>
                    Ve a la pestaña "Persona Mayor" para crear el perfil
                  </Text>
                </View>
              ) : trustedContacts.length === 0 ? (
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

              {elderly && (
                <TouchableOpacity style={styles.addButton} onPress={() => setShowContactModal(true)}>
                  <Text style={styles.addButtonText}>Agregar nuevo contacto de confianza</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Modal Crear Adulto Mayor */}
      <Modal visible={showCreateElderlyModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCreateElderlyModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Crear Adulto Mayor</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowCreateElderlyModal(false)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre Completo *</Text>
              <TextInput
                style={styles.modalInput}
                value={newElderlyData.name}
                onChangeText={(text) => setNewElderlyData((prev) => ({ ...prev, name: text }))}
                placeholder="Nombre completo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Teléfono *</Text>
              <TextInput
                style={styles.modalInput}
                value={newElderlyData.phone}
                onChangeText={(text) => setNewElderlyData((prev) => ({ ...prev, phone: text }))}
                placeholder="Número de teléfono"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha de Nacimiento *</Text>
              <TextInput
                style={styles.modalInput}
                value={newElderlyData.birthdate}
                onChangeText={(text) => {
                  const formatted = formatBirthdate(text);
                  setNewElderlyData((prev) => ({ ...prev, birthdate: formatted }));
                }}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dirección *</Text>
              <TextInput
                style={[styles.modalInput, styles.multilineInput]}
                value={newElderlyData.address}
                onChangeText={(text) => setNewElderlyData((prev) => ({ ...prev, address: text }))}
                placeholder="Dirección completa"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Información Médica *</Text>
              <TextInput
                style={[styles.modalInput, styles.multilineInput]}
                value={newElderlyData.medicalInfo}
                onChangeText={(text) => setNewElderlyData((prev) => ({ ...prev, medicalInfo: text }))}
                placeholder="Condiciones médicas, medicamentos, alergias"
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleCreateElderly}
            >
              <Text style={styles.modalSaveButtonText}>Crear Adulto Mayor</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

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

  // Token box
  tokenBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  tokenValue: {
    fontSize: 24,
    fontWeight: '700',
    color: BRAND,
    letterSpacing: 2,
    textAlign: 'center',
  },
});
