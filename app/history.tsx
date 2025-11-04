import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert as RNAlert,
} from 'react-native';
import { ChevronLeft, TriangleAlert as AlertTriangle, CircleHelp as HelpCircle, Pill, Check, X } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../context/auth-context';
import { apiClient } from '../api/client';
import { HistoryEventDTO } from '../api/types';

type AlertType = 'fall' | 'help' | 'medication_taken' | 'medication_missed';

interface Alert {
  id: number;
  type: AlertType;
  title: string;
  description: string;
  date: string;
  time: string;
  elderName: string;
}

// Helper to convert HistoryEventDTO to local Alert format
const fromDTO = (dto: HistoryEventDTO): Alert => {
  const timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();
  const dd = String(timestamp.getDate()).padStart(2, '0');
  const mm = String(timestamp.getMonth() + 1).padStart(2, '0');
  const yyyy = timestamp.getFullYear();
  const hh = String(timestamp.getHours()).padStart(2, '0');
  const min = String(timestamp.getMinutes()).padStart(2, '0');

  // Map eventType to AlertType
  let type: AlertType = 'help';
  let title = dto.eventType;

  if (dto.eventType.toLowerCase().includes('fall') || dto.eventType.toLowerCase().includes('caída')) {
    type = 'fall';
    title = 'Caída detectada';
  } else if (dto.eventType.toLowerCase().includes('help') || dto.eventType.toLowerCase().includes('auxilio')) {
    type = 'help';
    title = 'Pedido de auxilio';
  } else if (dto.eventType.toLowerCase().includes('medication_taken') || dto.eventType.toLowerCase().includes('tomada')) {
    type = 'medication_taken';
    title = 'Medicación tomada';
  } else if (dto.eventType.toLowerCase().includes('medication_missed') || dto.eventType.toLowerCase().includes('no tomada')) {
    type = 'medication_missed';
    title = 'Medicación no tomada';
  }

  return {
    id: dto.id || 0,
    type,
    title,
    description: dto.details || '',
    date: `${dd}/${mm}/${yyyy}`,
    time: `${hh}:${min}`,
    elderName: 'Usuario'
  };
};

export default function HistoryScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<AlertType | 'all'>('all');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load history from API
  const loadHistory = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Get events from the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const startStr = startDate.toISOString();
      const endStr = endDate.toISOString();

      const data = await apiClient.getHistoryByUserId(user.id, startStr, endStr);
      setAlerts(data.map(fromDTO));
    } catch (error: any) {
      console.error('Error loading history:', error);
      RNAlert.alert('Error', error.message || 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  // Load history when component mounts or user changes
  useEffect(() => {
    loadHistory();
  }, [user]);

  const getFilteredAlerts = () => {
    if (activeFilter === 'all') return alerts;
    return alerts.filter(a => a.type === activeFilter);
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'fall':
        return <AlertTriangle size={24} color="#EF4444" />;
      case 'help':
        return <HelpCircle size={24} color="#F59E0B" />;
      case 'medication_taken':
        return <Check size={24} color="#10B981" />;
      case 'medication_missed':
        return <X size={24} color="#EF4444" />;
    }
  };

  const getAlertColor = (type: AlertType) => {
    switch (type) {
      case 'fall':
        return '#EF4444';
      case 'help':
        return '#F59E0B';
      case 'medication_taken':
        return '#10B981';
      case 'medication_missed':
        return '#EF4444';
    }
  };

  const getAlertBgColor = (type: AlertType) => {
    switch (type) {
      case 'fall':
        return '#FEE2E2';
      case 'help':
        return '#FEF3C7';
      case 'medication_taken':
        return '#D1FAE5';
      case 'medication_missed':
        return '#FEE2E2';
    }
  };

  const renderFilterButton = (filter: typeof activeFilter, label: string, icon: React.ReactNode) => (
    <TouchableOpacity
      style={[styles.filterButton, activeFilter === filter && styles.activeFilterButton]}
      onPress={() => setActiveFilter(filter)}
    >
      {icon}
      <Text style={[styles.filterButtonText, activeFilter === filter && styles.activeFilterButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderAlertCard = (alert: Alert) => (
    <View key={alert.id} style={[styles.alertCard, { borderLeftColor: getAlertColor(alert.type) }]}>
      <View style={[styles.alertIconContainer, { backgroundColor: getAlertBgColor(alert.type) }]}>
        {getAlertIcon(alert.type)}
      </View>
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertElderName}>{alert.elderName}</Text>
        </View>
        <Text style={styles.alertDescription}>{alert.description}</Text>
        <Text style={styles.alertDateTime}>
          📅 {alert.date} • ⏰ {alert.time}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de alertas</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersContainer}>
          {renderFilterButton('all', 'Todas', <Pill size={16} color={activeFilter === 'all' ? 'white' : '#6B7280'} />)}
          {renderFilterButton('fall', 'Caídas', <AlertTriangle size={16} color={activeFilter === 'fall' ? 'white' : '#6B7280'} />)}
          {renderFilterButton('help', 'Auxilio', <HelpCircle size={16} color={activeFilter === 'help' ? 'white' : '#6B7280'} />)}
          {renderFilterButton('medication_taken', 'Tomada', <Check size={16} color={activeFilter === 'medication_taken' ? 'white' : '#6B7280'} />)}
          {renderFilterButton('medication_missed', 'No tomada', <X size={16} color={activeFilter === 'medication_missed' ? 'white' : '#6B7280'} />)}
        </View>

        {loading && alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.emptySubtitle}>Cargando historial...</Text>
          </View>
        ) : getFilteredAlerts().length === 0 ? (
          <View style={styles.emptyState}>
            <AlertTriangle size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No hay alertas</Text>
            <Text style={styles.emptySubtitle}>
              No se encontraron alertas con los filtros seleccionados
            </Text>
          </View>
        ) : (
          <View style={styles.alertsContainer}>
            {getFilteredAlerts().map(renderAlertCard)}
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
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 24,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  activeFilterButton: {
    backgroundColor: '#6B8E23',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: 'white',
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
  alertsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  alertElderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  alertDateTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
