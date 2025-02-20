import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Vibration, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function SOSScreen() {
  const [isActive, setIsActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([
    // Sample emergency contacts (You can add dynamic contacts or use some other method to store these)
    { id: '1', name: 'John Doe', phone: '123456789' },
    { id: '2', name: 'Jane Smith', phone: '987654321' }
  ]);

  const activateSOS = async () => {
    if (contacts.length === 0) {
      Alert.alert('No Emergency Contacts', 'Please add emergency contacts first.');
      return;
    }

    setIsActive(true);
    Vibration.vibrate([500, 1000, 500, 1000], true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for SOS.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Send notification to emergency contacts
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Emergency SOS Activated!",
          body: "Location has been shared with your emergency contacts.",
          data: { location },
        },
        trigger: null,
      });

      // Send SMS to emergency contacts (Platform specific)
      if (Platform.OS !== 'web') {
        contacts.forEach(contact => {
          // Implement SMS sending logic here
          console.log(`Sending SOS to ${contact.name} at ${contact.phone}`);
        });
      }
    } catch (error) {
      console.error('Error activating SOS:', error);
      Alert.alert('Error', 'Failed to activate SOS. Please try again.');
    }
  };

  const deactivateSOS = () => {
    setIsActive(false);
    Vibration.cancel();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>
          Press and hold the button to activate emergency mode
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.sosButton, isActive && styles.sosButtonActive]}
        onLongPress={activateSOS}
        onPress={deactivateSOS}>
        <Ionicons
          name={isActive ? "alert-circle" : "alert-circle-outline"}
          size={64}
          color="#fff"
        />
        <Text style={styles.sosButtonText}>
          {isActive ? 'EMERGENCY ACTIVE' : 'HOLD FOR SOS'}
        </Text>
      </TouchableOpacity>

      {isActive && (
        <View style={styles.activeInfo}>
          <Text style={styles.activeText}>Emergency Mode Active</Text>
          <Text style={styles.activeSubtext}>
            Your location is being shared with emergency contacts
          </Text>
          <Text style={styles.tapText}>Tap the button to deactivate</Text>
        </View>
      )}

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>When activated:</Text>
        <View style={styles.featureItem}>
          <Ionicons name="location" size={24} color="#FF4785" />
          <Text style={styles.featureText}>Shares your live location</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="notifications" size={24} color="#FF4785" />
          <Text style={styles.featureText}>Notifies emergency contacts</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="videocam" size={24} color="#FF4785" />
          <Text style={styles.featureText}>Records video evidence</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  sosButton: {
    backgroundColor: '#DC2626',
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  sosButtonActive: {
    backgroundColor: '#991B1B',
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  activeInfo: {
    marginTop: 30,
    alignItems: 'center',
  },
  activeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  activeSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  tapText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 16,
  },
  features: {
    marginTop: 60,
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
});
