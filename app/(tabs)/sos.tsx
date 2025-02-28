import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Send, MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';

import MapView, { Marker } from 'react-native-maps';
import Animated, { useSharedValue, withSpring, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { RootState } from '@/store';
import { sendAlert } from '@/store/slices/alertSlice';

export default function SOSScreen() {
  const dispatch = useDispatch();
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Start location tracking
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get initial location
      const initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation);

      // Subscribe to location updates
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    };

    startLocationTracking();

    // Cleanup subscription on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (isSOSActive) {
      // Pulsating animation for SOS button
      scale.value = withRepeat(
        withTiming(1.2, { duration: 1000 }),
        -1,
        true
      );
      opacity.value = withRepeat(
        withTiming(0.7, { duration: 1000 }),
        -1,
        true
      );

      // Countdown timer
      let timer: NodeJS.Timeout;
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        sendSOSAlert();
      }
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      scale.value = withSpring(1);
      opacity.value = withSpring(1);
      setCountdown(5);
    }
  }, [isSOSActive, countdown]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const toggleSOS = () => {
    if (!isSOSActive) {
      setIsSOSActive(true);
      Alert.alert(
        "SOS Activated",
        `Emergency alert will be sent in ${countdown} seconds. Tap again to cancel.`,
        [{ text: "OK" }]
      );
    } else {
      setIsSOSActive(false);
      Alert.alert(
        "SOS Cancelled",
        "Emergency alert has been cancelled.",
        [{ text: "OK" }]
      );
    }
  };

  const sendSOSAlert = () => {
    if (contacts.length === 0) {
      Alert.alert(
        "No Emergency Contacts",
        "Please add emergency contacts in the Contacts tab.",
        [{ text: "OK" }]
      );
      setIsSOSActive(false);
      return;
    }

    const locationStr = location
      ? `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`
      : 'Location not available';

    const alertData = {
      id: Date.now().toString(),
      type: 'SOS',
      message: 'EMERGENCY: I need help immediately!',
      location: locationStr,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    dispatch(sendAlert(alertData));

    Alert.alert(
      "SOS Alert Sent",
      "Emergency alert has been sent to all your emergency contacts.",
      [{ text: "OK" }]
    );

    setIsSOSActive(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {Platform.OS !== 'web' && location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <MapPin size={40} color="#FF4785" />
            <Text style={styles.mapPlaceholderText}>
              {errorMsg || 'Map not available on web platform'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Emergency SOS</Text>
        <Text style={styles.infoText}>
          Press and hold the SOS button in case of emergency. This will send your current location and an alert message to all your emergency contacts.
        </Text>

        {isSOSActive && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>
              Sending alert in {countdown} seconds...
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsSOSActive(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <Animated.View style={[styles.sosButtonContainer, animatedStyles]}>
          <TouchableOpacity
            style={[
              styles.sosButton,
              isSOSActive && styles.sosButtonActive
            ]}
            onPress={toggleSOS}
            activeOpacity={0.7}
          >
            <Shield size={40} color="#fff" />
            <Text style={styles.sosButtonText}>
              {isSOSActive ? 'CANCEL SOS' : 'SOS'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.contactsInfo}>
          <Text style={styles.contactsTitle}>Emergency Contacts</Text>
          {contacts.length > 0 ? (
            <Text style={styles.contactsText}>
              {contacts.length} contacts will be notified
            </Text>
          ) : (
            <Text style={styles.contactsWarning}>
              No emergency contacts added. Please add contacts in the Contacts tab.
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.sendLocationButton}>
          <Send size={20} color="#fff" />
          <Text style={styles.sendLocationText}>Share My Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mapContainer: {
    height: '40%',
    width: '100%',
    backgroundColor: '#e9ecef',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  mapPlaceholderText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  sosButtonContainer: {
    marginVertical: 20,
  },
  sosButton: {
    backgroundColor: '#FF0000',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  sosButtonActive: {
    backgroundColor: '#cc0000',
  },
  sosButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  countdownText: {
    fontSize: 18,
    color: '#FF0000',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  contactsInfo: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactsText: {
    fontSize: 16,
    color: '#666',
  },
  contactsWarning: {
    fontSize: 16,
    color: '#FF4785',
    textAlign: 'center',
  },
  sendLocationButton: {
    flexDirection: 'row',
    backgroundColor: '#FF4785',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sendLocationText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});