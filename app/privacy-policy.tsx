import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const BRAND = '#6B8E23';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const navigateBack = () => {
    try {
      router.replace('/(tabs)/profile');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleAccept = () => {
    setAccepted(true);
    Alert.alert(
      'Términos Aceptados',
      'Has aceptado los términos y condiciones.',
      [
        { text: 'OK', onPress: navigateBack }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={navigateBack}
        >
          <ChevronLeft size={24} color={BRAND} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Última actualización: 30/09/2025</Text>

          <Text style={styles.mainTitle}>Términos y Condiciones de Uso (TyC)</Text>

          <Text style={styles.sectionTitle}>Objeto del servicio</Text>
          <Text style={styles.paragraph}>
            Toto es una aplicación de acompañamiento gerontológico destinada a personas mayores y sus familiares/cuidadores.
          </Text>
          <Text style={styles.paragraph}>
            Brinda funcionalidades de recordatorios, asistencia por voz, entretenimiento, comunicación y detección de emergencias (caídas y pedidos de auxilio).
          </Text>
          <Text style={styles.paragraph}>
            No constituye un servicio médico ni reemplaza la atención profesional de salud.
          </Text>

          <Text style={styles.sectionTitle}>Condiciones de uso</Text>
          <Text style={styles.paragraph}>
            El usuario se compromete a usar la aplicación únicamente con fines personales y familiares.
          </Text>
          <Text style={styles.paragraph}>
            Queda prohibido el uso fraudulento, ilegal o contrario a la buena fe.
          </Text>
          <Text style={styles.paragraph}>
            Los familiares/cuidadores deben garantizar que cuentan con el consentimiento informado de la persona mayor registrada.
          </Text>

          <Text style={styles.sectionTitle}>Limitaciones y descargo de responsabilidad</Text>
          <Text style={styles.paragraph}>
            Toto no garantiza la detección del 100% de caídas o emergencias, ya que depende de factores técnicos (micrófono, ruido ambiental, conectividad, etc.).
          </Text>
          <Text style={styles.paragraph}>
            La aplicación no asume responsabilidad por daños derivados de fallos técnicos, errores de reconocimiento de voz o interrupciones de servicio.
          </Text>
          <Text style={styles.paragraph}>
            Toto no reemplaza la asistencia médica de emergencia ni servicios profesionales de salud.
          </Text>

          <Text style={styles.sectionTitle}>Registro y autenticación</Text>
          <Text style={styles.paragraph}>
            El registro de usuarios se realiza mediante Firebase Authentication, que gestiona las credenciales y contraseñas de manera segura.
          </Text>
          <Text style={styles.paragraph}>
            Los cuidadores deben registrar información veraz y mantenerla actualizada.
          </Text>

          <Text style={styles.sectionTitle}>Propiedad intelectual</Text>
          <Text style={styles.paragraph}>
            Los desarrolladores conservan los derechos sobre el software, diseño, marcas y contenidos de Toto.
          </Text>
          <Text style={styles.paragraph}>
            El usuario obtiene una licencia limitada, no exclusiva y revocable para usar la aplicación.
          </Text>

          <Text style={styles.sectionTitle}>Modificaciones</Text>
          <Text style={styles.paragraph}>
            Toto se reserva el derecho de modificar funcionalidades, TyC y condiciones del servicio, notificando a los usuarios.
          </Text>

          <Text style={styles.mainTitle}>Política de Privacidad</Text>

          <Text style={styles.sectionTitle}>Datos recopilados</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Datos de registro:</Text> nombre, edad, contactos de confianza, credenciales de acceso.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Datos de uso:</Text> recordatorios, mensajes enviados/recibidos, historial de alertas.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Datos técnicos:</Text> logs de actividad, métricas de rendimiento y errores (Datadog).
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Audio procesado:</Text> fragmentos de voz y sonidos, procesados localmente en el dispositivo para detección de caídas y comandos de voz (no se almacenan en servidores).
          </Text>

          <Text style={styles.sectionTitle}>Uso de los datos</Text>
          <Text style={styles.paragraph}>
            Brindar las funcionalidades de la aplicación (recordatorios, comunicación, emergencias).
          </Text>
          <Text style={styles.paragraph}>
            Mejorar la experiencia del usuario, detectar fallos y optimizar el sistema.
          </Text>
          <Text style={styles.paragraph}>
            No se usan datos para fines comerciales ni se venden a terceros.
          </Text>

          <Text style={styles.sectionTitle}>Almacenamiento y seguridad</Text>
          <Text style={styles.paragraph}>
            Los datos se almacenan en PostgreSQL (Railway) bajo estándares de seguridad.
          </Text>
          <Text style={styles.paragraph}>
            Las credenciales se gestionan con Firebase Authentication.
          </Text>
          <Text style={styles.paragraph}>
            Todo intercambio con el backend se realiza mediante protocolos seguros (HTTPS).
          </Text>

          <Text style={styles.sectionTitle}>Acceso y control</Text>
          <Text style={styles.paragraph}>
            El adulto mayor y su familiar pueden solicitar la rectificación o eliminación de sus datos.
          </Text>
          <Text style={styles.paragraph}>
            El consentimiento puede revocarse en cualquier momento, lo que implica la baja del servicio.
          </Text>

          <Text style={styles.sectionTitle}>Servicios de terceros</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>OpenAI API (ChatGPT):</Text> procesamiento de lenguaje natural para respuestas conversacionales.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>WhatsApp Business API:</Text> comunicación entre persona mayor y red de apoyo.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Spotify API:</Text> reproducción de música.
          </Text>
          <Text style={styles.paragraph}>
            Cada servicio aplica sus propias políticas de privacidad.
          </Text>

          <Text style={styles.sectionTitle}>Retención de datos</Text>
          <Text style={styles.paragraph}>
            Los datos personales y de uso se mantienen activos mientras dure la cuenta del usuario.
          </Text>
          <Text style={styles.paragraph}>
            Ante la baja, se eliminan de manera definitiva en un plazo razonable.
          </Text>

          <TouchableOpacity
            style={[styles.acceptButton, accepted && styles.acceptButtonDisabled]}
            onPress={handleAccept}
            disabled={accepted}
          >
            {accepted && <Check size={20} color="white" style={styles.checkIcon} />}
            <Text style={styles.acceptButtonText}>
              {accepted ? 'Términos Aceptados' : 'Aceptar Términos y Condiciones'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  lastUpdated: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BRAND,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: BRAND,
    marginTop: 16,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: '#374151',
  },
  acceptButton: {
    backgroundColor: BRAND,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  checkIcon: {
    marginRight: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});