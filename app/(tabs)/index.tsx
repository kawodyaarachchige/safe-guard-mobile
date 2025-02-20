import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, Share } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';


export default function EmergencyScreen() {
  const [location, setLocation] = useState(null);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
    startLocationUpdates();
  }, []);

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function startLocationUpdates() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required for this feature.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    // Start watching position
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      (newLocation) => {
        setLocation(newLocation);
        if (locationSharing) {
          updateLocationInDatabase(newLocation);
        }
      }
    );
  }

  async function updateLocationInDatabase(location) {
    if (!user) return;

    const { error } = await supabase
      .from('user_locations')
      .upsert({
        user_id: user.id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating location:', error);
    }
  }

  async function shareLocation() {
    if (!location) return;

    try {
      const shareMessage = `My current location:\nhttps://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      await Share.share({
        message: shareMessage,
        title: 'My Location',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share location');
    }
  }

  async function triggerEmergencyAlert() {
    if (!user || !location) return;

    setIsAlertActive(true);

    try {
      // Save emergency alert to database
      const { error } = await supabase
        .from('emergency_alerts')
        .insert({
          user_id: user.id,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          status: 'active',
        });

      if (error) throw error;

      // Share location immediately
      await shareLocation();

      // Show confirmation
      Alert.alert(
        'Emergency Alert Sent',
        'Your emergency contacts have been notified with your location.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send emergency alert');
    } finally {
      setTimeout(() => setIsAlertActive(false), 3000);
    }
  }

  const toggleLocationSharing = () => {
    setLocationSharing(!locationSharing);
    if (!locationSharing && location) {
      updateLocationInDatabase(location);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        )}
      </View>

      <View style={styles.controls}>


        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, locationSharing && styles.actionButtonActive]}
            onPress={toggleLocationSharing}>
            <Ionicons
              name={locationSharing ? "location" : "location-outline"}
              size={24}
              color="white"
            />
            <Text style={styles.actionButtonText}>
              {locationSharing ? 'Stop Sharing' : 'Share Location'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={shareLocation}>
            <Ionicons name="share-social" size={24} color="white" />
            <Text style={styles.actionButtonText}>Share Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  sosButton: {
    backgroundColor: '#E53935',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosButtonActive: {
    backgroundColor: '#B71C1C',
  },
  sosText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  alertText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  actionButtonActive: {
    backgroundColor: '#1976D2',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});