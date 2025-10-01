import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { ChevronLeft, Bell, Volume2, Vibrate } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const BRAND = '#6B8E23';

interface NotificationSettings {
  notifications_enabled: boolean;
  sounds_enabled: boolean;
  vibration_enabled: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    notifications_enabled: true,
    sounds_enabled: true,
    vibration_enabled: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const navigateBack = () => {
    try {
      router.replace('/(tabs)/profile');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleSave = () => {
    setHasChanges(false);
    Alert.alert(
      'Configuración Guardada',
      'Los cambios se han guardado correctamente.',
      [{
        text: 'OK',
        onPress: navigateBack
      }]
    );
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Descartar Cambios',
        '¿Estás seguro de que quieres descartar los cambios?',
        [
          { text: 'Continuar Editando', style: 'cancel' },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: navigateBack
          },
        ]
      );
    } else {
      navigateBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <ChevronLeft size={24} color={BRAND} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.infoBox}>
            <Bell size={24} color={BRAND} />
            <Text style={styles.infoText}>
              Configura cómo deseas recibir las notificaciones y alertas de Toto.
              Estas preferencias afectan recordatorios, alertas de emergencia y mensajes.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Preferencias de Notificaciones</Text>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceInfo}>
              <Bell size={20} color={BRAND} />
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceName}>Notificaciones</Text>
                <Text style={styles.preferenceDescription}>
                  Recibir alertas y recordatorios
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications_enabled}
              onValueChange={(value) => updateSetting('notifications_enabled', value)}
              trackColor={{ false: '#D1D5DB', true: BRAND }}
              thumbColor="white"
            />
          </View>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceInfo}>
              <Volume2 size={20} color={BRAND} />
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceName}>Sonidos</Text>
                <Text style={styles.preferenceDescription}>
                  Reproducir sonidos de alerta
                </Text>
              </View>
            </View>
            <Switch
              value={settings.sounds_enabled}
              onValueChange={(value) => updateSetting('sounds_enabled', value)}
              trackColor={{ false: '#D1D5DB', true: BRAND }}
              thumbColor="white"
            />
          </View>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceInfo}>
              <Vibrate size={20} color={BRAND} />
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceName}>Vibración</Text>
                <Text style={styles.preferenceDescription}>
                  Vibrar el dispositivo en alertas
                </Text>
              </View>
            </View>
            <Switch
              value={settings.vibration_enabled}
              onValueChange={(value) => updateSetting('vibration_enabled', value)}
              trackColor={{ false: '#D1D5DB', true: BRAND }}
              thumbColor="white"
            />
          </View>

          {hasChanges && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
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
    textAlign: 'center',
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
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#86EFAC',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#15803D',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 12,
  },
  preferenceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BRAND,
  },
  cancelButtonText: {
    color: BRAND,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: BRAND,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
