import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
    loadContacts();
  }, []);

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function loadContacts() {
    if (!user) return;

    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Error', 'Failed to load contacts');
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  }

  async function saveContact(contact, index) {
    if (!user) return;

    const { error } = await supabase
      .from('emergency_contacts')
      .upsert({
        user_id: user.id,
        name: contact.name,
        phone: contact.phone,
        relation: contact.relation,
      });

    if (error) {
      Alert.alert('Error', 'Failed to save contact');
    } else {
      loadContacts();
    }
  }

  async function deleteContact(contactId) {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId);

    if (error) {
      Alert.alert('Error', 'Failed to delete contact');
    } else {
      loadContacts();
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', 'Failed to sign out');
    } else {
      router.replace('/auth/sign-in');
    }
  }

  const addContact = () => {
    setContacts([...contacts, { name: '', phone: '', relation: '' }]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#666" />
        <Text style={styles.headerText}>Emergency Contacts</Text>
      </View>

      <View style={styles.contactsContainer}>
        {contacts.map((contact, index) => (
          <View key={index} style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <Text style={styles.contactTitle}>Contact {index + 1}</Text>
              <TouchableOpacity onPress={() => deleteContact(contact.id)}>
                <Ionicons name="trash-outline" size={24} color="#E53935" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              value={contact.name}
              onChangeText={(text) => {
                const newContacts = [...contacts];
                newContacts[index].name = text;
                setContacts(newContacts);
              }}
              placeholder="Contact Name"
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.input}
              value={contact.phone}
              onChangeText={(text) => {
                const newContacts = [...contacts];
                newContacts[index].phone = text;
                setContacts(newContacts);
              }}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.input}
              value={contact.relation}
              onChangeText={(text) => {
                const newContacts = [...contacts];
                newContacts[index].relation = text;
                setContacts(newContacts);
              }}
              placeholder="Relationship"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.saveContactButton}
              onPress={() => saveContact(contact, index)}>
              <Text style={styles.saveContactButtonText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Emergency Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  contactsContainer: {
    padding: 20,
  },
  contactCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  saveContactButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  saveContactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  signOutButton: {
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});