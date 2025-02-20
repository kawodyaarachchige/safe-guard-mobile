import { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    locationSharing: true,
    notifications: true,
    autoAlert: true,
    voiceActivation: false,
    darkMode: false,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const sections = [
    {
      title: 'Safety Features',
      items: [
        {
          key: 'locationSharing',
          label: 'Location Sharing',
          description: 'Share your location with emergency contacts',
          icon: 'location',
        },
        {
          key: 'autoAlert',
          label: 'Automatic Alerts',
          description: 'Send alerts when safety check expires',
          icon: 'alert-circle',
        },
        {
          key: 'voiceActivation',
          label: 'Voice Activation',
          description: 'Trigger SOS with voice command',
          icon: 'mic',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          key: 'notifications',
          label: 'Push Notifications',
          description: 'Receive safety alerts and reminders',
          icon: 'notifications',
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch to dark theme',
          icon: 'moon',
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.key} style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name={item.icon} size={24} color="#2196F3" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
              <Switch
                value={settings[item.key]}
                onValueChange={() => toggleSetting(item.key)}
                trackColor={{ false: '#767577', true: '#81c784' }}
                thumbColor={settings[item.key] ? '#4caf50' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.accountButton}>
        <Text style={styles.accountButtonText}>Manage Account</Text>
      </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  accountButton: {
    margin: 20,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  accountButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});