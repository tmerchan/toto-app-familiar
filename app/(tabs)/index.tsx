import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Phone, Bell, TriangleAlert as AlertTriangle, Check, User } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [hasFallAlert, setHasFallAlert] = useState(false);

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
    router.push('/reminders');
  };

  const navigateToHistory = () => {
    router.push('/history');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Hola, Tamara</Text>
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
            onPress={() => setHasFallAlert(!hasFallAlert)}
          >
            {hasFallAlert ? (
              <>
                <User size={16} color="white" />
                <Text style={styles.statusText}>Juan Pablo se ha caído</Text>
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
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Phone size={28} color="white" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Comunícate directamente con tu ser querido a través de WhatsApp</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={navigateToReminders}>
            <View style={styles.actionIcon}>
              <Bell size={28} color="white" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Configura recordatorios de medicación, citas y eventos</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={navigateToHistory}>
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
    backgroundColor: '#F5F5F5',
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