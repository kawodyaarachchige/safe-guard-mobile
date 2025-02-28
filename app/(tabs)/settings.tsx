import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Settings as SettingsIcon, User, Bell, Shield, LogOut, ChevronRight, Save } from 'lucide-react-native';

import { useRouter } from 'expo-router';
import { RootState } from '@/store';
import { updateSettings } from '@/store/slices/settingsSlice';
import { logout, updateUser } from '@/store/slices/userSlice';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const settings = useSelector((state: RootState) => state.settings);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleToggleSetting = (setting: string, value: boolean) => {
    dispatch(updateSettings({ [setting]: value }));
  };

  const handleSaveProfile = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    dispatch(updateUser({
      name,
      email,
      phone
    }));

    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(logout());
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>
          Manage your profile and app preferences
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={20} color="#FF4785" />
          <Text style={styles.sectionTitle}>Profile</Text>
        </View>

        {isEditingProfile ? (
          <View style={styles.profileEditContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Your Email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Your Phone Number"
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Save size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setName(user?.name || '');
                setEmail(user?.email || '');
                setPhone(user?.phone || '');
                setIsEditingProfile(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              {user?.email && <Text style={styles.profileDetail}>{user.email}</Text>}
              {user?.phone && <Text style={styles.profileDetail}>{user.phone}</Text>}
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setIsEditingProfile(true)}
            >
              <Text style={styles.editProfileButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color="#FF4785" />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={settings.pushNotifications}
            onValueChange={(value) => handleToggleSetting('pushNotifications', value)}
            trackColor={{ false: '#d1d1d1', true: '#FF4785' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Sound Alerts</Text>
          <Switch
            value={settings.soundAlerts}
            onValueChange={(value) => handleToggleSetting('soundAlerts', value)}
            trackColor={{ false: '#d1d1d1', true: '#FF4785' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Vibration</Text>
          <Switch
            value={settings.vibration}
            onValueChange={(value) => handleToggleSetting('vibration', value)}
            trackColor={{ false: '#d1d1d1', true: '#FF4785' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color="#FF4785" />
          <Text style={styles.sectionTitle}>Safety Settings</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Location Tracking</Text>
          <Switch
            value={settings.locationTracking}
            onValueChange={(value) => handleToggleSetting('locationTracking', value)}
            trackColor={{ false: '#d1d1d1', true: '#FF4785' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto SOS</Text>
          <Switch
            value={settings.autoSOS}
            onValueChange={(value) => handleToggleSetting('autoSOS', value)}
            trackColor={{ false: '#d1d1d1', true: '#FF4785' }}
            thumbColor="#fff"
          />
        </View>

        <TouchableOpacity style={styles.settingItemButton}>
          <Text style={styles.settingLabel}>SOS Message Template</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SettingsIcon size={20} color="#FF4785" />
          <Text style={styles.sectionTitle}>App Settings</Text>
        </View>

        <TouchableOpacity style={styles.settingItemButton}>
          <Text style={styles.settingLabel}>Language</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>English</Text>
            <ChevronRight size={20} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItemButton}>
          <Text style={styles.settingLabel}>Theme</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>Light</Text>
            <ChevronRight size={20} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItemButton}>
          <Text style={styles.settingLabel}>About</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItemButton}>
          <Text style={styles.settingLabel}>Privacy Policy</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    marginTop: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  editProfileButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  profileEditContainer: {
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#FF4785',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    color: '#999',
    fontSize: 14,
  },
});