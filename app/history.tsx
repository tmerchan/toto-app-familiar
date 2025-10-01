import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeft, AlertTriangle, HelpCircle, Pill, Check, X } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';

type AlertType = 'fall' | 'help' | 'medication_taken' | 'medication_missed';

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  date: string;
  time: string;
  elderName: string;
}

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<AlertType | 'all'>('all');
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'fall',
      title: 'Caída detectada',
      description: 'Se detectó una caída en el baño',
      date: '15/03/2024',
      time: '14:30',
      elderName: 'Juan Pablo'
    },
    {
      id: '2',
      type: 'help',
      title: 'Pedido de auxilio',
      description: 'Solicitó ayuda mediante el botón de emergencia',
      date: '14/03/2024',
      time: '09:15',
      elderName: 'Juan Pablo'
    },
    {
      id: '3',
      type: 'medication_taken',
      title: 'Medicación tomada',
      description: 'Aspirina - 100mg',
      date: '14/03/2024',
      time: '08:00',
      elderName: 'Juan Pablo'
    },
    {
      id: '4',
      type: 'medication_missed',
      title: 'Medicación no tomada',
      description: 'Omeprazol - 20mg',
      date: '13/03/2024',
      time: '20:00',
      elderName: 'Juan Pablo'
    },
    {
      id: '5',
      type: 'fall',
      title: 'Caída detectada',
      description: 'Se detectó una caída en la sala',
      date: '12/03/2024',
      time: '16:45',
      elderName: 'Juan Pablo'
    },
    {
      id: '6',
      type: 'medication_taken',
      title: 'Medicación tomada',
      description: 'Atorvastatina - 10mg',
      date: '12/03/2024',
      time: '08:00',
      elderName: 'Juan Pablo'
    }
  ]);

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

        {getFilteredAlerts().length === 0 ? (
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
