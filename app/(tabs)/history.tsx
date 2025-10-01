import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, TriangleAlert as AlertTriangle, Check } from 'lucide-react-native';

const BRAND = '#6B8E23';

interface Alert {
  id: string;
  type: 'fall' | 'medication' | 'emergency';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

export default function HistoryScreen() {
  const [alerts] = React.useState<Alert[]>([
    {
      id: '1',
      type: 'fall',
      title: 'Alerta de caída detectada',
      description: 'Se detectó una posible caída en la sala de estar',
      timestamp: '2024-10-01 14:30',
      resolved: true,
    },
    {
      id: '2',
      type: 'medication',
      title: 'Medicación no tomada',
      description: 'No se registró la toma de medicación de las 12:00',
      timestamp: '2024-10-01 12:15',
      resolved: true,
    },
    {
      id: '3',
      type: 'fall',
      title: 'Alerta de caída detectada',
      description: 'Se detectó una posible caída en el dormitorio',
      timestamp: '2024-09-30 08:45',
      resolved: true,
    },
  ]);

  const getAlertIcon = (type: string) => {
    return <AlertTriangle size={24} color="#EF4444" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Historial de Alertas</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Check size={48} color="#999" />
            <Text style={styles.emptyText}>No hay alertas registradas</Text>
            <Text style={styles.emptySubtext}>
              Las alertas aparecerán aquí cuando se generen
            </Text>
          </View>
        ) : (
          <View style={styles.alertsList}>
            {alerts.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertIcon}>{getAlertIcon(alert.type)}</View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertDescription}>{alert.description}</Text>
                  <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
                  {alert.resolved && (
                    <View style={styles.resolvedBadge}>
                      <Check size={12} color="white" />
                      <Text style={styles.resolvedText}>Resuelta</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
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
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  alertsList: {
    gap: 16,
    paddingBottom: 100,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  resolvedText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
});
