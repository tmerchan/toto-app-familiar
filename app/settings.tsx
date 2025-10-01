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
import { ChevronLeft, Shield, Bell, Volume2, Vibrate, Smartphone, MessageCircle, Music, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const BRAND = '#6B8E23';

interface ModuleSettings {
  entertainment_enabled: boolean;
  assistant_enabled: boolean;
  notifications_enabled: boolean;
  sounds_enabled: boolean;
  vibration_enabled: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<ModuleSettings>({
    entertainment_enabled: false,
    assistant_enabled: false,
    notifications_enabled: true,
    sounds_enabled: true,
    vibration_enabled: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: keyof ModuleSettings, value: boolean) => {
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
            <Shield size={24} color={BRAND} />
            <Text style={styles.infoText}>
              Los módulos de Registro, Prevención (Caídas), Recordatorios y Comunicación son esenciales y siempre están activos para garantizar tu seguridad.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Módulos Básicos (Siempre Activos)</Text>
          <View style={styles.moduleCard}>
            <View style={styles.moduleInfo}>
              <View style={styles.moduleIconContainer}>
                <Smartphone size={20} color={BRAND} />
              </View>
              <View style={styles.moduleText}>
                <Text style={styles.moduleName}>Registro</Text>
                <Text style={styles.moduleDescription}>
                  Gestión de perfil e información personal
                </Text>
              </View>
            </View>
            <View style={styles.activeIndicator}>
              <Text style={styles.activeText}>Activo</Text>
            </View>
          </View>

          <View style={styles.moduleCard}>
            <View style={styles.moduleInfo}>
              <View style={styles.moduleIconContainer}>
                <Shield size={20} color={BRAND} />
              </View>
              <View style={styles.moduleText}>
                <Text style={styles.moduleName}>Prevención (Caídas)</Text>
                <Text style={styles.moduleDescription}>
                  Detección de caídas y emergencias
                </Text>
              </View>
            </View>
            <View style={styles.activeIndicator}>
              <Text style={styles.activeText}>Activo</Text>
            </View>
          </View>

          <View style={styles.moduleCard}>
            <View style={styles.moduleInfo}>
              <View style={styles.moduleIconContainer}>
                <Bell size={20} color={BRAND} />
              </View>
              <View style={styles.moduleText}>
                <Text style={styles.moduleName}>Recordatorios</Text>
                <Text style={styles.moduleDescription}>
                  Medicamentos, citas y actividades
                </Text>
              </View>
            </View>
            <View style={styles.activeIndicator}>
              <Text style={styles.activeText}>Activo</Text>
            </View>
          </View>

          <View style={styles.moduleCard}>
            <View style={styles.moduleInfo}>
              <View style={styles.moduleIconContainer}>
                <MessageCircle size={20} color={BRAND} />
              </View>
              <View style={styles.moduleText}>
                <Text style={styles.moduleName}>Comunicación</Text>
                <Text style={styles.moduleDescription}>
                  WhatsApp y llamadas con contactos
                </Text>
              </View>
            </View>
            <View style={styles.activeIndicator}>
              <Text style={styles.activeText}>Activo</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Módulos Opcionales</Text>
          <Text style={styles.sectionDescription}>
            Puedes activar o desactivar estos módulos según tus preferencias
          </Text>

          <View style={styles.moduleCard}>
            <View style={styles.moduleInfo}>
              <View style={styles.moduleIconContainer}>
                <Music size={20} color={settings.entertainment_enabled ? BRAND : '#9CA3AF'} />
              </View>
              <View style={styles.moduleText}>
                <Text style={styles.moduleName}>Entretenimiento</Text>
                <Text style={styles.moduleDescription}>
                  Música, juegos y actividades recreativas
                </Text>
              </View>
            </View>
            <Switch
              value={settings.entertainment_enabled}
              onValueChange={(value) => updateSetting('entertainment_enabled', value)}
              trackColor={{ false: '#D1D5DB', true: BRAND }}
              thumbColor="white"
            />
          </View>

          <View style={styles.moduleCard}>
            <View style={styles.moduleInfo}>
              <View style={styles.moduleIconContainer}>
                <Mic size={20} color={settings.assistant_enabled ? BRAND : '#9CA3AF'} />
              </View>
              <View style={styles.moduleText}>
                <Text style={styles.moduleName}>Asistencia en Rutinas</Text>
                <Text style={styles.moduleDescription}>
                  Asistente de voz "Toto" para ayuda diaria
                </Text>
              </View>
            </View>
            <Switch
              value={settings.assistant_enabled}
              onValueChange={(value) => updateSetting('assistant_enabled', value)}
              trackColor={{ false: '#D1D5DB', true: BRAND }}
              thumbColor="white"
            />
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
    marginBottom: 8,
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  moduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  moduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
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
  activeIndicator: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND,
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
