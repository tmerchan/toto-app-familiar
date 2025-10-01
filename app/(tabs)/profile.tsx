import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  User,
  CreditCard,
  Shield,
  Settings,
  CircleHelp as HelpCircle,
  LogOut,
  ChevronRight,
  Pencil as Edit,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function MyProfileScreen() {
  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Función de editar perfil próximamente');
  };

  const handlePaymentMethod = () => {
    router.push('/subscription');
  };

  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleHelp = () => {
    router.push('/help');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const renderMenuItem = (
    icon: React.ReactNode,
    title: string,
    onPress: () => void,
    iconBgColor: string = '#E3F2FD'
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <User size={40} color="#6B8E23" />
            </View>
            <TouchableOpacity style={styles.editImageButton}>
              <Edit size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>Tamara González</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {renderMenuItem(
            <User size={20} color="#6B8E23" />,
            'Perfil',
            handleEditProfile,
            '#F0FDF4'
          )}

          {renderMenuItem(
            <CreditCard size={20} color="#8B5CF6" />,
            'Suscripción y Pago',
            handlePaymentMethod,
            '#F3E8FF'
          )}

          {renderMenuItem(
            <Shield size={20} color="#10B981" />,
            'Política de Privacidad',
            handlePrivacyPolicy,
            '#F0FDF4'
          )}

          {renderMenuItem(
            <Settings size={20} color="#6B7280" />,
            'Configuración',
            handleSettings,
            '#F9FAFB'
          )}

          {renderMenuItem(
            <HelpCircle size={20} color="#F59E0B" />,
            'Ayuda',
            handleHelp,
            '#FFFBEB'
          )}

          {renderMenuItem(
            <LogOut size={20} color="#EF4444" />,
            'Cerrar Sesión',
            handleLogout,
            '#FEF2F2'
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6B8E23',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  menuContainer: {
    backgroundColor: 'white',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
});