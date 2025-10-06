import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image
} from 'react-native';
import { ChevronLeft, User, Mail, Phone, MapPin, Calendar, Pencil as Edit2, Save } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../context/profile-context';

export default function UserProfileScreen() {
  const { profile, updateProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    birthdate: profile.birthdate,
    photoUri: profile.photoUri ?? null,
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.9, mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setEditedData((p) => ({ ...p, photoUri: res.assets[0].uri }));
    }
  };

  const handleSave = () => {
    updateProfile(editedData);
    setIsEditing(false);
    Alert.alert('Éxito', 'Perfil actualizado correctamente');
  };

  const handleCancel = () => {
    setEditedData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      birthdate: profile.birthdate,
      photoUri: profile.photoUri ?? null,
    });
    setIsEditing(false);
  };

  const renderField = (
    icon: React.ReactNode,
    label: string,
    value: string,
    field: keyof typeof editedData,
    editable: boolean = true
  ) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldIcon}>{icon}</View>
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {isEditing && editable ? (
        <TextInput
          style={styles.fieldInput}
          value={String(editedData[field] ?? '')}
          onChangeText={(text) => setEditedData({ ...editedData, [field]: text })}
          placeholder={label}
        />
      ) : (
        <Text style={styles.fieldValue}>{String(editedData[field] ?? '')}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => { isEditing ? handleSave() : setIsEditing(true); }}
        >
          {isEditing ? <Save size={24} color="#6B8E23" /> : <Edit2 size={24} color="#6B8E23" />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            {editedData.photoUri ? (
              <Image source={{ uri: editedData.photoUri }} style={styles.profileImageReal} />
            ) : (
              <View style={styles.profileImage}>
                <User size={60} color="#6B8E23" />
              </View>
            )}
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                <Edit2 size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>{editedData.name}</Text>
          <Text style={styles.profileRole}>Familiar cuidador</Text>
        </View>

        <View style={styles.fieldsContainer}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          {renderField(<User size={20} color="#6B8E23" />, 'Nombre completo', editedData.name, 'name')}
          {renderField(<Mail size={20} color="#6B8E23" />, 'Correo electrónico', editedData.email, 'email')}
          {renderField(<Phone size={20} color="#6B8E23" />, 'Teléfono', editedData.phone, 'phone')}
          {renderField(<MapPin size={20} color="#6B8E23" />, 'Dirección', editedData.address, 'address')}
          {renderField(<Calendar size={20} color="#6B8E23" />, 'Fecha de nacimiento', editedData.birthdate, 'birthdate')}
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#F5F5F5' },
  header:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingTop:60, paddingHorizontal:24, paddingBottom:20, backgroundColor:'white', borderBottomWidth:1, borderBottomColor:'#E5E7EB' },
  backButton:{ width:44, height:44, borderRadius:22, justifyContent:'center', alignItems:'center' },
  headerTitle:{ fontSize:24, fontFamily:'PlayfairDisplay-Bold', color:'#1F2937' },
  editButton:{ width:44, height:44, borderRadius:22, justifyContent:'center', alignItems:'center' },
  scrollView:{ flex:1 },

  profileImageSection:{ backgroundColor:'white', alignItems:'center', paddingVertical:40, marginBottom:20 },
  profileImageContainer:{ position:'relative', marginBottom:16 },
  profileImage:{ width:120, height:120, borderRadius:60, backgroundColor:'#F0FDF4', justifyContent:'center', alignItems:'center', borderWidth:4, borderColor:'#E5E7EB' },
  profileImageReal:{ width:120, height:120, borderRadius:60, borderWidth:4, borderColor:'#E5E7EB' },
  changePhotoButton:{ position:'absolute', bottom:0, right:0, width:36, height:36, borderRadius:18, backgroundColor:'#6B8E23', justifyContent:'center', alignItems:'center', borderWidth:3, borderColor:'white' },
  profileName:{ fontSize:24, fontWeight:'700', color:'#1F2937', marginBottom:4 },
  profileRole:{ fontSize:14, color:'#6B7280' },

  fieldsContainer:{ backgroundColor:'white', paddingVertical:24, paddingHorizontal:24, marginBottom:20 },
  sectionTitle:{ fontSize:18, fontWeight:'700', color:'#1F2937', marginBottom:20 },
  fieldContainer:{ marginBottom:24 },
  fieldHeader:{ flexDirection:'row', alignItems:'center', marginBottom:8 },
  fieldIcon:{ marginRight:8 },
  fieldLabel:{ fontSize:14, fontWeight:'600', color:'#6B7280' },
  fieldValue:{ fontSize:16, color:'#1F2937', paddingVertical:12, paddingHorizontal:16, backgroundColor:'#F9FAFB', borderRadius:8, borderWidth:1, borderColor:'#E5E7EB' },
  fieldInput:{ fontSize:16, color:'#1F2937', paddingVertical:12, paddingHorizontal:16, backgroundColor:'white', borderRadius:8, borderWidth:2, borderColor:'#6B8E23' },

  actionButtons:{ flexDirection:'row', paddingHorizontal:24, gap:12, marginBottom:20 },
  cancelButton:{ flex:1, backgroundColor:'#F3F4F6', borderRadius:12, paddingVertical:16, alignItems:'center', justifyContent:'center' },
  cancelButtonText:{ fontSize:16, fontWeight:'600', color:'#6B7280' },
  saveButton:{ flex:1, backgroundColor:'#6B8E23', borderRadius:12, paddingVertical:16, alignItems:'center', justifyContent:'center' },
  saveButtonText:{ fontSize:16, fontWeight:'600', color:'white' },
  bottomSpacing:{ height:40 },
});
