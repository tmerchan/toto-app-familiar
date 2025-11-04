import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Phone, Bell, TriangleAlert as AlertTriangle, Check, User } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useAuth } from '../../context/auth-context';
import { useElderly } from '../../context/elderly-context';
import { apiClient } from '../../api/client';

function SoftBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 100 200" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="g1" cx="85%" cy="8%" r="60%">
            <Stop offset="0%" stopColor="#7ea666" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#7ea666" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="g2" cx="0%" cy="28%" r="55%">
            <Stop offset="0%" stopColor="#f2efeb" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#f2efeb" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="g3" cx="70%" cy="85%" r="50%">
            <Stop offset="0%" stopColor="#f2efeb" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#f2efeb" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g1)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g2)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g3)" />
      </Svg>
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { elderly } = useElderly();
  const [hasFallAlert, setHasFallAlert] = useState(false);
  const [fallEventId, setFallEventId] = useState<number | null>(null);
  const [loadingFallStatus, setLoadingFallStatus] = useState(false);

  // Check for unresolved fall events
  useEffect(() => {
    if (elderly?.id) {
      checkForUnresolvedFalls();
    }
  }, [elderly]);

  // Refresh fall status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (elderly?.id) {
        checkForUnresolvedFalls();
      }
    }, [elderly])
  );

  const checkForUnresolvedFalls = async () => {
    if (!elderly?.id) return;

    try {
      setLoadingFallStatus(true);
      // Get events from the last 24 hours
      const endDate = new Date();
      const startDate = new Date();
      startDate.setHours(startDate.getHours() - 24);

      const startStr = startDate.toISOString();
      const endStr = endDate.toISOString();

      const events = await apiClient.getHistoryByUserId(elderly.id, startStr, endStr);
      
      // Look for FALL_DETECTED events that haven't been followed by FALL_RESOLVED
      const fallEvents = events.filter(e => 
        e.eventType === 'FALL_DETECTED' || e.eventType === 'FALL_RESOLVED'
      ).sort((a, b) => {
        // Sort by timestamp descending (most recent first)
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });

      // Check if the most recent fall event is FALL_DETECTED (unresolved)
      if (fallEvents.length > 0 && fallEvents[0].eventType === 'FALL_DETECTED') {
        setHasFallAlert(true);
        setFallEventId(fallEvents[0].id || null);
      } else {
        setHasFallAlert(false);
        setFallEventId(null);
      }
    } catch (error) {
      console.error('Error checking for falls:', error);
    } finally {
      setLoadingFallStatus(false);
    }
  };

  const handleFallAlertPress = () => {
    if (!hasFallAlert) return;

    Alert.alert(
      'Confirmar Revisión',
      `¿Ya revisaste la situación de ${elderlyName}? Esto marcará la alerta como resuelta.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, ya revisé', 
          onPress: async () => {
            try {
              // Create a FALL_RESOLVED event
              await apiClient.createHistoryEvent({
                userId: elderly?.id!,
                eventType: 'FALL_RESOLVED',
                details: `El familiar ${user?.name || 'Usuario'} revisó y confirmó que la situación está bajo control.`
              });
              
              setHasFallAlert(false);
              setFallEventId(null);
              
              Alert.alert('Listo', 'La alerta ha sido marcada como resuelta.');
            } catch (error) {
              console.error('Error resolving fall:', error);
              Alert.alert('Error', 'No se pudo marcar la alerta como resuelta.');
            }
          }
        }
      ]
    );
  };

  const getCurrentDate = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const now = new Date();
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    return `${dayName}, ${day} de ${month}`;
  };

  const navigateToReminders = () => {
    if (!elderly) {
      Alert.alert(
        'Adulto Mayor No Registrado',
        'Primero debes registrar a un adulto mayor para poder configurar recordatorios.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Registrar Ahora', 
            onPress: () => router.push('/(tabs)/contacts')
          }
        ]
      );
      return;
    }
    router.push('/reminders');
  };

  const navigateToHistory = () => {
    if (!elderly) {
      Alert.alert(
        'Adulto Mayor No Registrado',
        'Primero debes registrar a un adulto mayor para poder revisar el historial de alertas.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Registrar Ahora', 
            onPress: () => router.push('/(tabs)/contacts')
          }
        ]
      );
      return;
    }
    router.push('/history');
  };

  const openWhatsApp = async () => {
    if (!elderly) {
      Alert.alert(
        'Adulto Mayor No Registrado',
        'Primero debes registrar a un adulto mayor para poder comunicarte por WhatsApp.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Registrar Ahora', 
            onPress: () => router.push('/(tabs)/contacts')
          }
        ]
      );
      return;
    }

    if (!elderly?.phone) {
      Alert.alert('Error', 'No hay número de teléfono disponible para el adulto mayor');
      return;
    }

    // Clean phone number - remove spaces, dashes, parentheses
    const cleanPhone = elderly.phone.replace(/[\s\-()]/g, '');
    
    // WhatsApp URL format: whatsapp://send?phone=PHONE_NUMBER
    // For international numbers, include country code without + or 00
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}`;

    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'No se pudo abrir WhatsApp. Asegúrate de tener la aplicación instalada.');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Alert.alert('Error', 'No se pudo abrir WhatsApp');
    }
  };

  // Extract first name from user.name
  const firstName = user?.name.split(' ')[0] || 'Usuario';
  const elderlyName = elderly?.name || 'la persona mayor';

  return (
    <View style={styles.container}>
      <SoftBackground />

      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Hola, {firstName}</Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              hasFallAlert ? styles.alertButton : styles.okButton
            ]}
            onPress={handleFallAlertPress}
            disabled={!hasFallAlert || loadingFallStatus}
          >
            {loadingFallStatus ? (
              <ActivityIndicator size="small" color="white" />
            ) : hasFallAlert ? (
              <>
                <AlertTriangle size={16} color="white" />
                <Text style={styles.statusText}>Puede que {elderlyName} se haya caído</Text>
              </>
            ) : (
              <>
                <Check size={16} color="white" />
                <Text style={styles.statusText}>Todo en orden</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#f2efeb' }]}
            onPress={openWhatsApp}
          >
            <View style={styles.actionIcon}>
              <Phone size={28} color="white" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Comunícate directamente con tu ser querido a través de WhatsApp</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#f2efeb' }]} onPress={navigateToReminders}>
            <View style={styles.actionIcon}>
              <Bell size={28} color="white" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Configura recordatorios de medicación, citas y eventos</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#f2efeb' }]} onPress={navigateToHistory}>
            <View style={styles.actionIcon}>
              <AlertTriangle size={28} color="white" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Revisa el historial de alertas</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#1F2937',
    marginRight: 8,
  },
  waveEmoji: {
    fontSize: 32,
  },
  statusContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  alertButton: {
    backgroundColor: '#EF4444',
  },
  okButton: {
    backgroundColor: '#10B981',
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 100,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6B8E23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
});