import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
} from 'react-native';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, MapPin, Phone, Filter, Calendar } from 'lucide-react-native';
import { useState } from 'react';

interface HistoryEvent {
  id: string;
  type: 'emergency' | 'normal' | 'medication' | 'appointment';
  title: string;
  description: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  resolved: boolean;
}

export default function HistoryScreen() {
  const [filter, setFilter] = useState<'all' | 'emergency' | 'normal' | 'medication' | 'appointment'>('all');
  
  // Datos de ejemplo del historial de Toto
  const [historyEvents] = useState<HistoryEvent[]>([
    {
      id: '1',
      type: 'emergency',
      title: 'Caída detectada',
      description: 'Se detectó una posible caída en el baño. Contactos de emergencia notificados.',
      timestamp: '2024-01-15 14:30',
      severity: 'high',
      resolved: true
    },
    {
      id: '2',
      type: 'normal',
      title: 'Actividad normal',
      description: 'Toto se encuentra realizando actividades normales en casa.',
      timestamp: '2024-01-15 12:00',
      severity: 'low',
      resolved: true
    },
    {
      id: '3',
      type: 'medication',
      title: 'Medicación tomada',
      description: 'Aspirina 100mg tomada correctamente según horario.',
      timestamp: '2024-01-15 08:00',
      severity: 'low',
      resolved: true
    },
    {
      id: '4',
      type: 'appointment',
      title: 'Cita médica completada',
      description: 'Consulta con Dr. García - Cardiología. Todo en orden.',
      timestamp: '2024-01-14 10:30',
      severity: 'medium',
      resolved: true
    },
    {
      id: '5',
      type: 'emergency',
      title: 'Inactividad prolongada',
      description: 'No se detectó movimiento durante 3 horas. Falsa alarma - estaba durmiendo.',
      timestamp: '2024-01-13 15:45',
      severity: 'medium',
      resolved: true
    },
    {
      id: '6',
      type: 'normal',
      title: 'Salida registrada',
      description: 'Toto salió de casa para caminar por el parque.',
      timestamp: '2024-01-13 09:15',
      severity: 'low',
      resolved: true
    }
  ]);

  const getFilteredEvents = () => {
    if (filter === 'all') return historyEvents;
    return historyEvents.filter(event => event.type === filter);
  };

  const getEventIcon = (type: string, severity: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle size={24} color={severity === 'high' ? '#EF4444' : '#F59E0B'} />;
      case 'normal':
        return <CheckCircle size={24} color="#10B981" />;
      case 'medication':
        return <Clock size={24} color="#3B82F6" />;
      case 'appointment':
        return <Calendar size={24} color="#8B5CF6" />;
      default:
        return <Clock size={24} color="#6B7280" />;
    }
  };

  const getEventColor = (type: string, severity: string) => {
    switch (type) {
      case 'emergency':
        return severity === 'high' ? '#EF4444' : '#F59E0B';
      case 'normal':
        return '#10B981';
      case 'medication':
        return '#3B82F6';
      case 'appointment':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'emergency': return 'Emergencia';
      case 'normal': return 'Normal';
      case 'medication': return 'Medicación';
      case 'appointment': return 'Cita';
      default: return 'Evento';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays - 1} días`;
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderFilterButton = (filterType: typeof filter, title: string) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterType && styles.activeFilterButton]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[styles.filterButtonText, filter === filterType && styles.activeFilterButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderEventCard = (event: HistoryEvent) => (
    <View key={event.id} style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={styles.eventTypeContainer}>
          {getEventIcon(event.type, event.severity)}
          <View style={styles.eventInfo}>
            <Text style={[styles.eventType, { color: getEventColor(event.type, event.severity) }]}>
              {getEventTypeLabel(event.type)}
            </Text>
            <Text style={styles.eventTimestamp}>{formatTimestamp(event.timestamp)}</Text>
          </View>
        </View>
        <View style={[
          styles.severityIndicator,
          { backgroundColor: getEventColor(event.type, event.severity) }
        ]} />
      </View>

      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>


      <View style={styles.eventFooter}>
        <Text style={styles.eventTime}>
          {new Date(event.timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
        {event.resolved && (
          <View style={styles.resolvedBadge}>
            <CheckCircle size={14} color="#10B981" />
            <Text style={styles.resolvedText}>Resuelto</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Historial de Toto</Text>
            <Text style={styles.headerSubtitle}>Registro de actividades y eventos</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {renderFilterButton('all', 'Todos')}
          {renderFilterButton('emergency', 'Emergencias')}
          {renderFilterButton('normal', 'Normal')}
          {renderFilterButton('medication', 'Medicación')}
          {renderFilterButton('appointment', 'Citas')}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {getFilteredEvents().length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No hay eventos</Text>
            <Text style={styles.emptySubtitle}>
              No se encontraron eventos para el filtro seleccionado
            </Text>
          </View>
        ) : (
          <View style={styles.eventsContainer}>
            {getFilteredEvents().map(renderEventCard)}
          </View>
        )}
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
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: '#6B8E23',
    borderColor: '#6B8E23',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  eventsContainer: {
    padding: 24,
    gap: 16,
    paddingBottom: 24,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  eventInfo: {
    flex: 1,
  },
  eventType: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  eventTimestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  severityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resolvedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
});