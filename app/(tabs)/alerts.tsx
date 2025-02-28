import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, TriangleAlert as AlertTriangle, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react-native';
import { RootState } from '@/store';
import { deleteAlert, updateAlertStatus } from '@/store/slices/alertSlice';

export default function AlertsScreen() {
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.alerts.alerts);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const toggleExpandAlert = (id: string) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  const handleMarkAsResolved = (id: string) => {
    dispatch(updateAlertStatus({ id, status: 'resolved' }));
  };

  const handleDeleteAlert = (id: string) => {
    dispatch(deleteAlert(id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Create a sorted copy of the alerts array instead of modifying the original
  const sortedAlerts = Array.isArray(alerts)
    ? [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];

  const renderAlertItem = ({ item }: { item: any }) => {
    const isExpanded = expandedAlertId === item.id;

    return (
      <View style={[
        styles.alertItem,
        item.status === 'resolved' && styles.alertItemResolved
      ]}>
        <TouchableOpacity
          style={styles.alertHeader}
          onPress={() => toggleExpandAlert(item.id)}
        >
          <View style={styles.alertIconContainer}>
            {item.type === 'SOS' ? (
              <AlertTriangle size={24} color="#FF0000" />
            ) : (
              <Bell size={24} color="#FF4785" />
            )}
          </View>

          <View style={styles.alertInfo}>
            <Text style={styles.alertType}>{item.type}</Text>
            <Text style={styles.alertTimestamp}>{formatDate(item.timestamp)}</Text>
          </View>

          <View style={styles.alertStatus}>
            {item.status === 'resolved' ? (
              <View style={styles.statusBadgeResolved}>
                <Text style={styles.statusTextResolved}>Resolved</Text>
              </View>
            ) : (
              <View style={styles.statusBadgeActive}>
                <Text style={styles.statusTextActive}>Active</Text>
              </View>
            )}
            {isExpanded ? (
              <ChevronUp size={20} color="#666" />
            ) : (
              <ChevronDown size={20} color="#666" />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.alertDetails}>
            <Text style={styles.alertMessage}>{item.message}</Text>

            {item.location && (
              <View style={styles.locationContainer}>
                <Text style={styles.locationLabel}>Location:</Text>
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
            )}

            <View style={styles.alertActions}>
              {item.status !== 'resolved' && (
                <TouchableOpacity
                  style={styles.resolveButton}
                  onPress={() => handleMarkAsResolved(item.id)}
                >
                  <Check size={18} color="#fff" />
                  <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteAlert(item.id)}
              >
                <Trash2 size={18} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alert History</Text>
        <Text style={styles.headerSubtitle}>
          View and manage your emergency alerts
        </Text>
      </View>

      {!Array.isArray(alerts) ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Error: Alerts data is invalid.</Text>
        </View>
      ) : alerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={60} color="#ccc" />
          <Text style={styles.emptyText}>No alerts yet</Text>
          <Text style={styles.emptySubtext}>
            Your emergency alerts will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedAlerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.alertsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FF4785',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  alertsList: {
    padding: 20,
  },
  alertItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  alertItemResolved: {
    opacity: 0.7,
  },
  alertHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertInfo: {
    flex: 1,
  },
  alertType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertTimestamp: {
    fontSize: 14,
    color: '#666',
  },
  alertStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadgeActive: {
    backgroundColor: '#FF4785',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  statusTextActive: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadgeResolved: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  statusTextResolved: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertDetails: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  alertMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 0.48,
  },
  resolveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 0.48,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});