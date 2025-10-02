import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import { ChevronLeft, ChevronDown, ChevronUp, Info, MessageCircle, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const BRAND = '#6B8E23';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'features';
}

interface TooltipInfo {
  title: string;
  description: string;
}

const faqData: FAQItem[] = [
  {
    question: '¿Qué es Toto?',
    answer: 'Toto es una aplicación de acompañamiento gerontológico diseñada para ayudar a personas mayores y sus cuidadores. Ofrece 6 módulos especializados: Registro, Prevención, Recordatorios, Comunicación, Asistencia en Rutinas y Entretenimiento.',
    category: 'general',
  },
  {
    question: '¿Qué es el Módulo de Registro?',
    answer: 'Es la puerta de entrada al sistema. Permite al familiar o cuidador registrar a la persona mayor, cargar información de contactos de confianza y establecer parámetros de configuración inicial. Los datos se almacenan de forma segura y vinculan con credenciales de autenticación.',
    category: 'general',
  },
  {
    question: '¿Qué es el Módulo de Prevención (Caídas)?',
    answer: 'Es el núcleo de seguridad del sistema. Funciona como un servicio en primer plano que permanece activo continuamente. Detecta sonidos compatibles con caídas, pedidos de auxilio o anomalías acústicas. Ante un evento crítico, activa confirmación por voz y si no hay respuesta, envía notificación inmediata por WhatsApp al cuidador.',
    category: 'features',
  },
  {
    question: '¿Qué es el Módulo de Recordatorios?',
    answer: 'Permite configurar recordatorios programados para medicación, citas médicas o actividades cotidianas. Los recordatorios se gestionan desde el dispositivo del cuidador y se entregan en el momento oportuno con síntesis de voz y estímulos visuales, garantizando el cumplimiento de rutinas críticas para el bienestar.',
    category: 'features',
  },
  {
    question: '¿Qué es el Módulo de Comunicación?',
    answer: 'Permite la comunicación bidireccional entre la persona mayor y sus familiares mediante WhatsApp. Asegura que las notificaciones de emergencia y mensajes cotidianos se transmitan en un canal familiar, reduciendo la curva de aprendizaje. También permite iniciar llamadas directas a contactos registrados.',
    category: 'features',
  },
  {
    question: '¿Qué es el Módulo de Asistencia en Rutinas?',
    answer: 'Provee acompañamiento cotidiano a través de interacción por voz. El adulto mayor activa el asistente diciendo "Toto" y puede emitir comandos simples. Ofrece información básica, sugerencias de hábitos saludables, recordatorios de rutinas preventivas, y puede ejecutar instrucciones prácticas como establecer alarmas o informar fecha y hora.',
    category: 'features',
  },
  {
    question: '¿Qué es el Módulo de Entretenimiento?',
    answer: 'Diseñado para promover la estimulación cognitiva y el bienestar emocional. Permite acceder a actividades recreativas como reproducción de música mediante Spotify y juegos cognitivos básicos. Las actividades son fáciles de invocar por voz o botones de acceso rápido, reduciendo la soledad no deseada.',
    category: 'features',
  },
  {
    question: '¿Cómo configuro los módulos opcionales?',
    answer: 'Los módulos de Registro, Prevención, Recordatorios y Comunicación están siempre activos por seguridad. Los módulos de Entretenimiento y Asistencia en Rutinas son opcionales y pueden activarse/desactivarse desde Configuración en tu perfil.',
    category: 'general',
  },
  {
    question: '¿Cómo agrego contactos de confianza?',
    answer: 'En la sección de Contactos, presiona el botón "+" y completa el nombre, relación y número de teléfono del contacto. Estos contactos recibirán alertas en caso de emergencias a través de WhatsApp.',
    category: 'general',
  },
  {
    question: '¿La app funciona sin conexión a internet?',
    answer: 'Algunas funciones como los recordatorios locales funcionan sin internet, pero las alertas a contactos por WhatsApp y el asistente de voz requieren conexión activa.',
    category: 'technical',
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Sí. Todos los datos se almacenan de forma segura y encriptada en Supabase. El audio para detección de caídas se procesa localmente en el dispositivo. Lee nuestra Política de Privacidad para más información.',
    category: 'technical',
  },
  {
    question: '¿Puedo editar o eliminar recordatorios?',
    answer: 'Sí. En la sección de Recordatorios, presiona sobre cualquier recordatorio para editarlo o eliminarlo usando los íconos correspondientes.',
    category: 'features',
  },
  {
    question: '¿Qué hago si la detección de caídas no funciona?',
    answer: 'Asegúrate de haber dado permiso de micrófono a la app y que el módulo de Prevención esté activo (siempre lo está por defecto). El servicio debe permanecer en primer plano. Si el problema persiste, verifica que no haya aplicaciones que interfieran con el micrófono.',
    category: 'technical',
  },
  {
    question: '¿Puedo tener múltiples cuidadores?',
    answer: 'Sí. Puedes agregar varios contactos de confianza que actuarán como cuidadores y recibirán las alertas de emergencia por WhatsApp.',
    category: 'general',
  },
];

const tooltips: Record<string, TooltipInfo> = {
  registration: {
    title: 'Módulo de Registro',
    description: 'Gestiona perfiles de personas mayores, contactos de confianza y parámetros de configuración. Es la base del sistema.',
  },
  prevention: {
    title: 'Módulo de Prevención',
    description: 'Servicio activo continuo que detecta caídas y pedidos de auxilio mediante análisis de sonido, enviando alertas inmediatas por WhatsApp.',
  },
  reminders: {
    title: 'Módulo de Recordatorios',
    description: 'Configura alertas para medicamentos, citas médicas y actividades. Notifica con voz y visuales en horarios programados.',
  },
  communication: {
    title: 'Módulo de Comunicación',
    description: 'Comunicación bidireccional con familiares vía WhatsApp. Incluye mensajes, alertas de emergencia y llamadas directas.',
  },
  assistant: {
    title: 'Módulo de Asistencia en Rutinas',
    description: 'Asistente de voz activado con "Toto". Provee información, sugerencias de salud, establece alarmas e informa fecha/hora.',
  },
  entertainment: {
    title: 'Módulo de Entretenimiento',
    description: 'Estimulación cognitiva con música de Spotify y juegos. Fácil de usar por voz o botones, reduce la soledad.',
  },
};

export default function HelpScreen() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedTooltip, setSelectedTooltip] = useState<TooltipInfo | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const navigateBack = () => {
    try {
      router.replace('/(tabs)/profile');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const showTooltip = (key: string) => {
    setSelectedTooltip(tooltips[key]);
  };

  const filteredFAQs = filterCategory === 'all'
    ? faqData
    : faqData.filter(faq => faq.category === filterCategory);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Los 6 Módulos de Toto</Text>
          <Text style={styles.description}>
            Presiona cada módulo para conocer su función y cómo ayuda en el cuidado:
          </Text>

          <View style={styles.tooltipGrid}>
            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('registration')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Registro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('prevention')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Prevención</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('reminders')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Recordatorios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('communication')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Comunicación</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('assistant')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Asistencia</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('entertainment')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Entretenimiento</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>

          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filterCategory === 'all' && styles.filterButtonActive]}
              onPress={() => setFilterCategory('all')}
            >
              <Text style={[styles.filterText, filterCategory === 'all' && styles.filterTextActive]}>
                Todas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterCategory === 'general' && styles.filterButtonActive]}
              onPress={() => setFilterCategory('general')}
            >
              <Text style={[styles.filterText, filterCategory === 'general' && styles.filterTextActive]}>
                General
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterCategory === 'features' && styles.filterButtonActive]}
              onPress={() => setFilterCategory('features')}
            >
              <Text style={[styles.filterText, filterCategory === 'features' && styles.filterTextActive]}>
                Funciones
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterCategory === 'technical' && styles.filterButtonActive]}
              onPress={() => setFilterCategory('technical')}
            >
              <Text style={[styles.filterText, filterCategory === 'technical' && styles.filterTextActive]}>
                Técnico
              </Text>
            </TouchableOpacity>
          </View>

          {filteredFAQs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(index)}
              >
                <Text style={styles.questionText}>{faq.question}</Text>
                {expandedFAQ === index ? (
                  <ChevronUp size={20} color={BRAND} />
                ) : (
                  <ChevronDown size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>¿Necesitas más ayuda?</Text>
            <Text style={styles.description}>
              Si no encontraste la respuesta que buscabas, contáctanos:
            </Text>

            <TouchableOpacity style={styles.contactButton}>
              <MessageCircle size={20} color="white" />
              <Text style={styles.contactButtonText}>Chat en Vivo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.contactButton, styles.contactButtonSecondary]}>
              <Phone size={20} color={BRAND} />
              <Text style={[styles.contactButtonText, styles.contactButtonTextSecondary]}>
                Llamar al Soporte
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={selectedTooltip !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTooltip(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedTooltip(null)}
        >
          <View style={styles.tooltipModal}>
            <Text style={styles.tooltipModalTitle}>{selectedTooltip?.title}</Text>
            <Text style={styles.tooltipModalDescription}>{selectedTooltip?.description}</Text>
            <TouchableOpacity
              style={styles.tooltipCloseButton}
              onPress={() => setSelectedTooltip(null)}
            >
              <Text style={styles.tooltipCloseText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  tooltipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tooltipCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tooltipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: BRAND,
    borderColor: BRAND,
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#F9FAFB',
  },
  answerText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  contactSection: {
    marginTop: 32,
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  contactButtonSecondary: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: BRAND,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contactButtonTextSecondary: {
    color: BRAND,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tooltipModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  tooltipModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BRAND,
    marginBottom: 12,
  },
  tooltipModalDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 20,
  },
  tooltipCloseButton: {
    backgroundColor: BRAND,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  tooltipCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
