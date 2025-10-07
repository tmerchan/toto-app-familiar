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
  ShieldAlert,
  Pill,
  Bell,
  Music2,
  Workflow,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const BRAND = '#6B8E23';

type PlanId = 'base' | 'premium' | 'full';
type PremiumChoice = 'assistant' | 'entertainment';

interface Plan {
  id: PlanId;
  name: string;
  tag?: string;
  priceUsd: number;
  features: { icon: JSX.Element; text: string }[];
  support: string;
}

const plans: Plan[] = [
  {
    id: 'base',
    name: 'Plan Base',
    priceUsd: 15,
    support: 'Soporte remoto en horario comercial',
    features: [
      { icon: <ShieldAlert size={16} color="#065F46" />, text: 'Prevención y detección de caídas' },
      { icon: <Bell size={16} color="#065F46" />, text: 'Recordatorios (medicación, citas, actividades)' },
      { icon: <Pill size={16} color="#065F46" />, text: 'Registro e información esencial' },
      { icon: <Bell size={16} color="#065F46" />, text: 'Comunicación básica con contactos' },
    ],
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    priceUsd: 18,
    support: 'Soporte prioritario',
    features: [
      { icon: <ShieldAlert size={16} color="#92400E" />, text: 'Todo lo del Plan Base' },
      { icon: <Bell size={16} color="#92400E" />, text: 'Un módulo extra a elección' },
      { icon: <Workflow size={16} color="#92400E" />, text: 'Asistencia en rutinas (opcional)' },
      { icon: <Music2 size={16} color="#92400E" />, text: 'Entretenimiento (opcional)' },
    ],
  },
  {
    id: 'full',
    name: 'Plan Full',
    tag: 'Más elegido',
    priceUsd: 21,
    support: 'Soporte 24/7 con respuesta humana en emergencias',
    features: [
      { icon: <ShieldAlert size={16} color="#1D4ED8" />, text: 'Todo lo del Plan Premium' },
      { icon: <Workflow size={16} color="#1D4ED8" />, text: 'Asistencia en rutinas (incluida)' },
      { icon: <Music2 size={16} color="#1D4ED8" />, text: 'Entretenimiento (incluido)' },
    ],
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('base');
  const [premiumChoice, setPremiumChoice] = useState<PremiumChoice>('assistant');

  const navigateBack = () => {
    try {
      router.replace('/(tabs)/profile');
    } catch {}
  };

  const totalUsd = plans.find((p) => p.id === selectedPlan)?.priceUsd ?? 0;

  const selectedPlanLabel = () => {
    const baseName = plans.find((p) => p.id === selectedPlan)?.name || '';
    return baseName;
  };

  const handleGooglePay = () => {
    if (Platform.OS !== 'android') {
      Alert.alert('No disponible', 'Google Pay solo está disponible en Android.');
      return;
    }
    Alert.alert(
      'Google Pay',
      `Procesando pago de USD ${totalUsd.toFixed(2)}.\nPlan: ${selectedPlanLabel()}\n\n(Integración pendiente con el servicio de pagos)`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => Alert.alert('Éxito', 'Suscripción activada', [{ text: 'OK', onPress: navigateBack }]),
        },
      ]
    );
  };

  const handleCreditCard = () => {
    Alert.alert(
      'Pago con tarjeta',
      `Procesando pago de USD ${totalUsd.toFixed(2)}.\nPlan: ${selectedPlanLabel()}\n\n(Integración pendiente con procesador de pagos)`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => Alert.alert('Éxito', 'Suscripción activada', [{ text: 'OK', onPress: navigateBack }]),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suscripción</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
      >
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Modelo de suscripción</Text>
          <Text style={styles.infoText}>
            Elegí el plan mensual que mejor se adapte a tus necesidades. Los planes escalan en funcionalidades y nivel
            de soporte.
          </Text>
        </View>

        <View style={styles.cardsGrid}>
          {plans.map((plan) => {
            const isActive = selectedPlan === plan.id;
            const isPremium = plan.id === 'premium';

            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, isActive && styles.planCardActive]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.9}
              >
                <View style={styles.planHeaderRow}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.tag && <Text style={styles.planTag}>{plan.tag}</Text>}
                </View>

                <Text style={styles.priceLine}>
                  <Text style={styles.priceNumber}>USD {plan.priceUsd.toFixed(2)}</Text>
                  <Text style={styles.priceSuffix}> / mes</Text>
                </Text>

                <Text style={styles.supportText}>{plan.support}</Text>

                <View style={styles.featuresList}>
                  {plan.features.map((f, idx) => (
                    <View key={`${plan.id}-f-${idx}`} style={styles.featureItem}>
                      <View style={styles.featureIcon}>{f.icon}</View>
                      <Text style={styles.featureText}>{f.text}</Text>
                    </View>
                  ))}
                </View>

                {/* Selector de módulo SOLO visible cuando Premium está activo */}
                {isPremium && isActive && (
                  <View style={styles.choiceBox}>
                    <Text style={styles.choiceTitle}>Elegí tu módulo avanzado incluido</Text>
                    <View style={styles.choiceRow}>
                      <TouchableOpacity
                        style={[
                          styles.choiceBtn,
                          premiumChoice === 'assistant' && styles.choiceBtnActive,
                        ]}
                        onPress={() => setPremiumChoice('assistant')}
                      >
                        <Workflow size={16} color={premiumChoice === 'assistant' ? 'white' : '#374151'} />
                        <Text
                          style={[
                            styles.choiceBtnText,
                            premiumChoice === 'assistant' && styles.choiceBtnTextActive,
                          ]}
                        >
                          Asistencia en rutinas
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.choiceBtn,
                          premiumChoice === 'entertainment' && styles.choiceBtnActive,
                        ]}
                        onPress={() => setPremiumChoice('entertainment')}
                      >
                        <Music2 size={16} color={premiumChoice === 'entertainment' ? 'white' : '#374151'} />
                        <Text
                          style={[
                            styles.choiceBtnText,
                            premiumChoice === 'entertainment' && styles.choiceBtnTextActive,
                          ]}
                        >
                          Entretenimiento
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.choiceHint}>
                      Podrás cambiar tu elección desde el perfil en cualquier momento.
                    </Text>
                  </View>
                )}

                <View style={styles.selectRow}>
                  <View style={[styles.radio, isActive && styles.radioActive]}>
                    {isActive && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.selectLabel, isActive && styles.selectLabelActive]}>
                    {isActive ? 'Seleccionado' : 'Seleccionar'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Plan seleccionado</Text>
            <Text style={styles.totalValue}>{selectedPlanLabel()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelBold}>Total mensual</Text>
            <Text style={styles.totalValueBold}>USD {totalUsd.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.payTitle}>Método de pago</Text>

        {Platform.OS === 'android' && (
          <TouchableOpacity style={styles.paymentButton} onPress={handleGooglePay}>
            <View style={styles.paymentIcon}>
              <Smartphone size={22} color="#4285F4" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Google Pay</Text>
              <Text style={styles.paymentDescription}>Pago rápido y seguro con tu cuenta de Google</Text>
            </View>
            <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.paymentButton} onPress={handleCreditCard}>
          <View style={styles.paymentIcon}>
            <CreditCard size={22} color="#6B8E23" />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Tarjeta de crédito/débito</Text>
            <Text style={styles.paymentDescription}>Visa, Mastercard, American Express</Text>
          </View>
          <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            La suscripción se renueva automáticamente cada mes. Podés cancelar en cualquier momento desde tu perfil. El
            soporte varía según el plan contratado.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================== ESTILOS ================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

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
  backButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', color: '#1F2937' },
  placeholder: { width: 44 },

  scrollView: { flex: 1 },

  infoBox: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#065F46', marginBottom: 6 },
  infoText: { fontSize: 14, color: '#065F46', lineHeight: 20 },

  cardsGrid: { gap: 14 },

  planCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  planCardActive: { borderColor: BRAND, backgroundColor: '#F7FFF0' },

  planHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontSize: 16, fontWeight: '700', color: '#1F2937', flex: 1, paddingRight: 8 },
  planTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  priceLine: { marginTop: 6, marginBottom: 6 },
  priceNumber: { fontSize: 22, fontWeight: '800', color: '#111827' },
  priceSuffix: { fontSize: 14, color: '#6B7280' },

  supportText: { fontSize: 13, color: '#374151', marginBottom: 8 },

  featuresList: { gap: 8, marginTop: 6, marginBottom: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  featureText: { fontSize: 13.5, color: '#1F2937', flexShrink: 1 },

  /* Selector Premium */
  choiceBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginTop: 6,
    marginBottom: 10,
  },
  choiceTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 8 },
  choiceRow: { flexDirection: 'row', gap: 8 },
  choiceBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceBtnActive: {
    backgroundColor: BRAND,
    borderColor: BRAND,
  },
  choiceBtnText: { fontSize: 12.5, fontWeight: '700', color: '#374151' },
  choiceBtnTextActive: { color: 'white' },
  choiceHint: { marginTop: 8, fontSize: 12, color: '#6B7280' },

  selectRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  radioActive: { borderColor: BRAND },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: BRAND },
  selectLabel: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  selectLabelActive: { color: '#2F4F1F' },

  totalBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  totalLabel: { fontSize: 14, color: '#6B7280' },
  totalValue: { fontSize: 14, color: '#111827', fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  totalLabelBold: { fontSize: 16, color: '#111827', fontWeight: '800' },
  totalValueBold: { fontSize: 18, color: BRAND, fontWeight: '800' },

  payTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginTop: 20, marginBottom: 10 },

  paymentButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: { flex: 1 },
  paymentName: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  paymentDescription: { fontSize: 12.5, color: '#6B7280', marginTop: 2 },

  disclaimerBox: {
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  disclaimerText: { fontSize: 12.5, color: '#92400E', lineHeight: 18 },
});
