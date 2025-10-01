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
import { router } from 'expo-router';
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
    answer: 'Toto es una aplicación de acompañamiento gerontológico diseñada para ayudar a personas mayores y sus cuidadores. Ofrece recordatorios de medicamentos, asistencia por voz, detección de emergencias y comunicación con familiares.',
    category: 'general',
  },
  {
    question: '¿Cómo configuro recordatorios de medicamentos?',
    answer: 'Ve a la sección de Recordatorios en el menú principal, presiona el botón "+" y completa la información del medicamento incluyendo nombre, dosis, horario y frecuencia.',
    category: 'features',
  },
  {
    question: '¿Cómo funciona la detección de caídas?',
    answer: 'Toto usa el micrófono del dispositivo para detectar sonidos característicos de caídas. Al detectar uno, envía alertas automáticas a los contactos de confianza. Esta función debe estar activada en los ajustes.',
    category: 'features',
  },
  {
    question: '¿Cómo agrego contactos de confianza?',
    answer: 'En la sección de Contactos, presiona el botón "+" y completa el nombre, relación y número de teléfono del contacto. Estos contactos recibirán alertas en caso de emergencias.',
    category: 'general',
  },
  {
    question: '¿La app funciona sin conexión a internet?',
    answer: 'Algunas funciones como los recordatorios locales funcionan sin internet, pero las alertas a contactos y el asistente de voz requieren conexión activa.',
    category: 'technical',
  },
  {
    question: '¿Cómo uso el asistente de voz?',
    answer: 'Di "Hola Toto" o presiona el botón del micrófono. Puedes pedirle información, que te cuente chistes, o que reproduzca música. El asistente usa comandos de voz simples.',
    category: 'features',
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Sí. Todos los datos se almacenan de forma segura y encriptada. El audio se procesa localmente en el dispositivo y no se guarda en servidores externos. Lee nuestra Política de Privacidad para más información.',
    category: 'technical',
  },
  {
    question: '¿Puedo editar o eliminar recordatorios?',
    answer: 'Sí. En la sección de Recordatorios, presiona sobre cualquier recordatorio para editarlo o eliminarlo usando los íconos correspondientes.',
    category: 'features',
  },
  {
    question: '¿Qué hago si la app no detecta mi voz?',
    answer: 'Asegúrate de haber dado permiso de micrófono a la app. Habla de forma clara y cerca del dispositivo. Verifica que no haya ruido ambiente excesivo. Si el problema persiste, reinicia la aplicación.',
    category: 'technical',
  },
  {
    question: '¿Puedo tener múltiples cuidadores?',
    answer: 'Sí. Puedes agregar varios contactos de confianza que actuarán como cuidadores y recibirán las alertas de emergencia.',
    category: 'general',
  },
];

const tooltips: Record<string, TooltipInfo> = {
  reminders: {
    title: 'Recordatorios',
    description: 'Configura alertas para medicamentos y actividades. La app te notificará en los horarios programados.',
  },
  contacts: {
    title: 'Contactos de Confianza',
    description: 'Personas que recibirán alertas automáticas en caso de emergencia. Pueden ser familiares, amigos o profesionales de salud.',
  },
  emergency: {
    title: 'Detección de Emergencias',
    description: 'Sistema automático que detecta caídas y palabras de auxilio, enviando alertas inmediatas a tus contactos.',
  },
  voice: {
    title: 'Asistente de Voz',
    description: 'Di "Hola Toto" para activarlo. Puede responder preguntas, contar chistes, reproducir música y más.',
  },
};

export default function HelpScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedTooltip, setSelectedTooltip] = useState<TooltipInfo | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={BRAND} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Ayuda Contextual</Text>
          <Text style={styles.description}>
            Presiona los botones para obtener información rápida sobre cada función:
          </Text>

          <View style={styles.tooltipGrid}>
            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('reminders')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Recordatorios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('contacts')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Contactos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('emergency')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Emergencias</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tooltipCard}
              onPress={() => showTooltip('voice')}
            >
              <Info size={24} color={BRAND} />
              <Text style={styles.tooltipTitle}>Voz</Text>
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
