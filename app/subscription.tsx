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

const BASE_PRICE = 8000;

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
    price: 3000,
    isCore: false,
  },
  {
    id: 'entertainment',
    name: 'Entretenimiento',
    description: 'Música y juegos de estimulación',
    price: 2000,
    isCore: false,
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedModules, setSelectedModules] = useState<string[]>(
    modules.filter(m => m.isCore).map(m => m.id)
  );

  const navigateBack = () => {
    try {
      router.replace('/(tabs)/profile');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const toggleModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module?.isCore) return;

    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(id => id !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };

  const calculateTotal = () => {
    const additionalCost = modules
      .filter(m => !m.isCore && selectedModules.includes(m.id))
      .reduce((total, m) => total + m.price, 0);
    return BASE_PRICE + additionalCost;
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

    const total = calculateTotal();
    Alert.alert(
      'Google Pay',
      `Procesando pago de $${total.toLocaleString('es-CL')} CLP con Google Pay.\n\nEsta función requiere integración con servicios de pago nativos.`,
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
    const total = calculateTotal();
    Alert.alert(
      'Pago con Tarjeta',
      `Procesando pago de $${total.toLocaleString('es-CL')} CLP con tarjeta de crédito/débito.\n\nEsta función requiere integración con un procesador de pagos.`,
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
            <Text style={styles.infoTitle}>Plan Personalizado de Toto</Text>
            <Text style={styles.infoText}>
              La suscripción base incluye los 4 módulos esenciales para el cuidado y seguridad.
              Puedes agregar módulos adicionales según tus necesidades.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Módulos Incluidos en la Base</Text>
          {modules
            .filter(m => m.isCore)
            .map(module => (
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

          <Text style={styles.sectionTitle}>Módulos Adicionales</Text>
          <Text style={styles.sectionDescription}>
            Selecciona los módulos adicionales que deseas agregar a tu plan
          </Text>
          {modules
            .filter(m => !m.isCore)
            .map(module => (
              <TouchableOpacity
                key={module.id}
                style={[
                  styles.moduleCard,
                  selectedModules.includes(module.id) && styles.moduleCardSelected,
                ]}
                onPress={() => toggleModule(module.id)}
              >
                <View style={styles.moduleInfo}>
                  <View
                    style={[
                      styles.checkIcon,
                      selectedModules.includes(module.id)
                        ? styles.checkIconSelected
                        : styles.checkIconUnselected,
                    ]}
                  >
                    {selectedModules.includes(module.id) && (
                      <Check size={20} color="white" />
                    )}
                  </View>
                  <View style={styles.moduleText}>
                    <Text style={styles.moduleName}>{module.name}</Text>
                    <Text style={styles.moduleDescription}>
                      {module.description}
                    </Text>
                  </View>
                </View>
                <Text style={styles.modulePrice}>
                  +${module.price.toLocaleString('es-CL')}
                </Text>
              </TouchableOpacity>
            ))}

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Plan Base</Text>
              <Text style={styles.totalValue}>
                ${BASE_PRICE.toLocaleString('es-CL')} CLP
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Módulos Adicionales</Text>
              <Text style={styles.totalValue}>
                ${(calculateTotal() - BASE_PRICE).toLocaleString('es-CL')} CLP
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabelBold}>Total Mensual</Text>
              <Text style={styles.totalValueBold}>
                ${calculateTotal().toLocaleString('es-CL')} CLP
              </Text>
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
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
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
});
