import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image
} from 'react-native';
import {
  User, CreditCard, Shield, Settings, CircleHelp as HelpCircle, LogOut, ChevronRight, Pencil as Edit
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useProfile } from '../../context/profile-context';

export default function MyProfileScreen() {
  const { profile } = useProfile();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleEditProfile = () => router.push('/user-profile');
  const handlePaymentMethod = () => router.push('/subscription');
  const handlePrivacyPolicy = () => router.push('/privacy-policy');
  const handleSettings = () => router.push('/settings');
  const handleHelp = () => router.push('/help');

  const renderMenuItem = (icon: React.ReactNode, title: string, onPress: () => void, iconBgColor: string = '#E3F2FD') => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: iconBgColor }]}>{icon}</View>
      <Text style={styles.menuTitle}>{title}</Text>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Mi Perfil</Text></View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.profileImageReal} />
            ) : (
              <View style={styles.profileImage}>
                <User size={40} color="#6B8E23" />
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {renderMenuItem(<User size={20} color="#6B8E23" />, 'Perfil', handleEditProfile, '#F0FDF4')}
          {renderMenuItem(<CreditCard size={20} color="#8B5CF6" />, 'Suscripción y Pago', handlePaymentMethod, '#F3E8FF')}
          {renderMenuItem(<Shield size={20} color="#10B981" />, 'Términos y Condiciones', handlePrivacyPolicy, '#F0FDF4')}
          {renderMenuItem(<Settings size={20} color="#6B7280" />, 'Configuración', handleSettings, '#F9FAFB')}
          {renderMenuItem(<HelpCircle size={20} color="#F59E0B" />, 'Ayuda', handleHelp, '#FFFBEB')}
          {renderMenuItem(<LogOut size={20} color="#EF4444" />, 'Cerrar Sesión', () => setLogoutOpen(true), '#FEF2F2')}
        </View>
      </ScrollView>

      {/* Modal Logout */}
      <Modal visible={logoutOpen} transparent animationType="fade" onRequestClose={() => setLogoutOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalText}>¿Estás seguro de que quieres cerrar sesión?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setLogoutOpen(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={() => {
                  setLogoutOpen(false);
                  router.replace('/(auth)/login');
                }}
              >
                <Text style={styles.modalConfirmText}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#F5F5F5' },
  header:{ paddingTop:60, paddingHorizontal:24, paddingBottom:20, backgroundColor:'white', borderBottomWidth:1, borderBottomColor:'#E5E7EB', alignItems:'center' },
  headerTitle:{ fontSize:28, fontFamily:'PlayfairDisplay-Bold', color:'#1F2937', textAlign:'center' },
  scrollView:{ flex:1 },
  profileSection:{ backgroundColor:'white', alignItems:'center', paddingVertical:40, marginBottom:20 },
  profileImageContainer:{ position:'relative', marginBottom:16 },
  profileImage:{ width:100, height:100, borderRadius:50, backgroundColor:'#F0FDF4', justifyContent:'center', alignItems:'center', borderWidth:3, borderColor:'#E5E7EB' },
  profileImageReal:{ width:100, height:100, borderRadius:50, borderWidth:3, borderColor:'#E5E7EB' },
  profileName:{ fontSize:24, fontWeight:'700', color:'#1F2937' },
  menuContainer:{ backgroundColor:'white' },
  menuItem:{ flexDirection:'row', alignItems:'center', paddingHorizontal:24, paddingVertical:16, borderBottomWidth:1, borderBottomColor:'#F3F4F6' },
  menuIcon:{ width:40, height:40, borderRadius:20, justifyContent:'center', alignItems:'center', marginRight:16 },
  menuTitle:{ flex:1, fontSize:16, fontWeight:'500', color:'#1F2937' },
  // Modal styles
  modalBackdrop:{ flex:1, backgroundColor:'rgba(0,0,0,0.35)', justifyContent:'center', alignItems:'center', padding:24 },
  modalCard:{ width:'100%', backgroundColor:'white', borderRadius:16, padding:20, borderWidth:1, borderColor:'#E5E7EB' },
  modalTitle:{ fontSize:18, fontWeight:'700', color:'#1F2937', marginBottom:6 },
  modalText:{ fontSize:14, color:'#374151', marginBottom:18 },
  modalActions:{ flexDirection:'row', gap:10 },
  modalCancel:{ flex:1, backgroundColor:'#F3F4F6', borderRadius:12, paddingVertical:14, alignItems:'center' },
  modalCancelText:{ fontSize:16, fontWeight:'600', color:'#6B7280' },
  modalConfirm:{ flex:1, backgroundColor:'#6B8E23', borderRadius:12, paddingVertical:14, alignItems:'center' },
  modalConfirmText:{ fontSize:16, fontWeight:'600', color:'white' },
});
