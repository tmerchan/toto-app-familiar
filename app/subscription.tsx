import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import {
  ChevronLeft,
  Check,
  CreditCard,
  Smartphone,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const BRAND = '#6B8E23';

interface Module {
  id: string;
  name: string;
  description: string;
  price: number;
  isCore: boolean;
}

const BASE_PRICE = 10000;

const modules: Module[] = [
  {
    id: 'registration',
    name: 'Registro',
    description: 'Gestión de perfil e información personal',
    price: 0,
    isCore: true,
  },
  {
    id: 'prevention',
    name: 'Prevención (Caídas)',
    description: 'Detección de caídas y emergencias',
    price: 0,
    isCore: true,
  },
  {
    id: 'reminders',
    name: 'Recordatorios',
    description: 'Medicamentos, citas y actividades',
    price: 0,
    isCore: true,
  },
  {
    id: 'communication',
    name: 'Comunicación',
    description: 'WhatsApp y llamadas con contactos',
    price: 0,
    isCore: true,
  },
  {
    id: 'assistant',
    name: 'Asistencia en Rutinas',
    description: 'Asistente de voz "Toto" para ayuda diaria',
    price: 0,
    isCore: true,
  },
  {
    id: 'entertainment',
    name: 'Entretenimiento',
    description: 'Música y juegos de estimulación',
    price: 0,
    isCore: true,
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();

  const navigateBack = () => {
    try {
      router.replace('/(tabs)/profile');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleGooglePay = () => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'No Disponible',
        'Google Pay solo está disponible en dispositivos Android.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Google Pay',
      `Procesando pago de $${BASE_PRICE.toLocaleString('es-CL')} CLP con Google Pay.\n\nEsta función requiere integración con servicios de pago nativos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => {
            Alert.alert('Éxito', 'Suscripción activada correctamente', [
              { text: 'OK', onPress: navigateBack },
            ]);
          },
        },
      ]
    );
  };

  const handleCreditCard = () => {
    Alert.alert(
      'Pago con Tarjeta',
      `Procesando pago de $${BASE_PRICE.toLocaleString('es-CL')} CLP con tarjeta de crédito/débito.\n\nEsta función requiere integración con un procesador de pagos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => {
            Alert.alert('Éxito', 'Suscripción activada correctamente', [
              { text: 'OK', onPress: navigateBack },
            ]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
          <ChevronLeft size={24} color={BRAND} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suscripción</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Suscripción Completa de Toto</Text>
            <Text style={styles.infoText}>
              Accede a todos los módulos de Toto para el cuidado integral de personas mayores.
              Todos los módulos están incluidos en tu suscripción mensual.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Módulos Incluidos</Text>
          {modules.map(module => (
            <View key={module.id} style={styles.moduleCard}>
              <View style={styles.moduleInfo}>
                <View style={styles.checkIcon}>
                  <Check size={20} color={BRAND} />
                </View>
                <View style={styles.moduleText}>
                  <Text style={styles.moduleName}>{module.name}</Text>
                  <Text style={styles.moduleDescription}>
                    {module.description}
                  </Text>
                </View>
              </View>
              <View style={styles.freeTag}>
                <Text style={styles.freeText}>Incluido</Text>
              </View>
            </View>
          ))}

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabelBold}>Suscripción Mensual</Text>
              <Text style={styles.totalValueBold}>
                ${BASE_PRICE.toLocaleString('es-CL')} CLP
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>✓ Todos los 6 módulos incluidos</Text>
              <Text style={styles.benefitItem}>✓ Actualizaciones automáticas</Text>
              <Text style={styles.benefitItem}>✓ Soporte técnico prioritario</Text>
              <Text style={styles.benefitItem}>✓ Sin compromisos, cancela cuando quieras</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Método de Pago</Text>

          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={handleGooglePay}
            >
              <View style={styles.paymentIcon}>
                <Smartphone size={24} color="#4285F4" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Google Pay</Text>
                <Text style={styles.paymentDescription}>
                  Pago rápido y seguro con tu cuenta de Google
                </Text>
              </View>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handleCreditCard}
          >
            <View style={styles.paymentIcon}>
              <CreditCard size={24} color="#6B8E23" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Tarjeta de Crédito/Débito</Text>
              <Text style={styles.paymentDescription}>
                Visa, Mastercard, American Express
              </Text>
            </View>
            <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              La suscripción se renueva automáticamente cada mes. Puedes cancelar
              en cualquier momento desde tu perfil. Los módulos básicos siempre
              permanecen activos para tu seguridad.
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BRAND,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803D',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#15803D',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
  },
  moduleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  moduleCardSelected: {
    borderColor: BRAND,
    backgroundColor: '#F0FDF4',
  },
  moduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  checkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconSelected: {
    backgroundColor: BRAND,
  },
  checkIconUnselected: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  moduleText: {
    flex: 1,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  moduleDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  modulePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND,
    marginLeft: 8,
  },
  freeTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND,
  },
  freeText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND,
  },
  totalSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  totalLabelBold: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValueBold: {
    fontSize: 20,
    fontWeight: '700',
    color: BRAND,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  paymentButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  disclaimerBox: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
});
