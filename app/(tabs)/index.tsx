import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { MapPin, Phone, Shield, Info } from 'lucide-react-native';

import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { RootState } from '@/store';

export default function HomeScreen() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  const safetyTips = [
    {
      id: 1,
      title: 'Share Your Location',
      description: 'Always share your location with trusted contacts when traveling alone.',
      icon: <MapPin size={24} color="#FF4785" />
    },
    {
      id: 2,
      title: 'Emergency Contacts',
      description: 'Keep emergency contacts updated and easily accessible.',
      icon: <Phone size={24} color="#FF4785" />
    },
    {
      id: 3,
      title: 'Use SOS Feature',
      description: 'In emergency, use the SOS button to alert your contacts.',
      icon: <Shield size={24} color="#FF4785" />
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
        <Text style={styles.subGreeting}>Stay safe with our features</Text>
      </View>

      <TouchableOpacity 
        style={styles.sosButton}
        onPress={() => router.push('/sos')}
      >
        <Shield size={28} color="#fff" />
        <Text style={styles.sosText}>SOS EMERGENCY</Text>
      </TouchableOpacity>

      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <MapPin size={20} color="#FF4785" />
          <Text style={styles.locationTitle}>Your Current Location</Text>
        </View>
        <Text style={styles.locationText}>
          {errorMsg ? errorMsg : location ? 'Location tracking active' : 'Fetching location...'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        {safetyTips.map(tip => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipIcon}>{tip.icon}</View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Resources</Text>
        <TouchableOpacity style={styles.resourceCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
            style={styles.resourceImage} 
          />
          <View style={styles.resourceContent}>
            <Text style={styles.resourceTitle}>Self-Defense Techniques</Text>
            <Text style={styles.resourceDescription}>Learn basic self-defense moves</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resourceCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
            style={styles.resourceImage} 
          />
          <View style={styles.resourceContent}>
            <Text style={styles.resourceTitle}>Safety Guidelines</Text>
            <Text style={styles.resourceDescription}>Essential safety tips for women</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.helplineSection}>
        <View style={styles.helplineHeader}>
          <Info size={20} color="#FF4785" />
          <Text style={styles.helplineTitle}>Emergency Helplines</Text>
        </View>
        <View style={styles.helplineCard}>
          <Text style={styles.helplineNumber}>911</Text>
          <Text style={styles.helplineLabel}>Emergency Services</Text>
        </View>
        <View style={styles.helplineCard}>
          <Text style={styles.helplineNumber}>1-800-799-7233</Text>
          <Text style={styles.helplineLabel}>National Domestic Violence Hotline</Text>
        </View>
      </View>
    </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  sosButton: {
    backgroundColor: '#FF0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    margin: 20,
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
  sosText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  tipIcon: {
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
  },
  resourceCard: {
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
  resourceImage: {
    width: '100%',
    height: 150,
  },
  resourceContent: {
    padding: 15,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
  },
  helplineSection: {
    padding: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  helplineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  helplineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  helplineCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  helplineNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4785',
  },
  helplineLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});