import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const emergencyContacts = [
  { name: 'Police', number: '911', icon: 'shield' },
  { name: 'Ambulance', number: '911', icon: 'medical' },
  { name: 'Fire Department', number: '911', icon: 'flame' },
  { name: 'Domestic Violence Hotline', number: '1-800-799-7233', icon: 'home' },
  { name: 'Suicide Prevention Lifeline', number: '988', icon: 'heart' },
];

const safetyTips = [
  {
    title: 'Personal Safety',
    tips: [
      'Stay aware of your surroundings',
      'Walk confidently and stay in well-lit areas',
      'Keep your phone charged and accessible',
      'Share your location with trusted contacts',
    ],
  },
  {
    title: 'Home Safety',
    tips: [
      'Keep doors and windows locked',
      'Install security cameras or alarms',
      'Have an emergency escape plan',
      'Know your neighbors',
    ],
  },
];

export default function ResourcesScreen() {
  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Numbers</Text>
        {emergencyContacts.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactCard}
            onPress={() => handleCall(contact.number)}>
            <View style={styles.contactInfo}>
              <View style={styles.iconContainer}>
                <Ionicons name={contact.icon} size={24} color="#E53935" />
              </View>
              <View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
            </View>
            <Ionicons name="call" size={24} color="#4CAF50" />
          </TouchableOpacity>
        ))}
      </View>

      {safetyTips.map((category, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{category.title}</Text>
          {category.tips.map((tip, tipIndex) => (
            <View key={tipIndex} style={styles.tipCard}>
              <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contactNumber: {
    color: '#666',
    marginTop: 2,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  tipText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});