import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Trash2, CreditCard as Edit, User, Phone, Save, X } from 'lucide-react-native';
import { RootState } from '@/store';
import { addContact, deleteContact, updateContact } from '@/store/slices/contactSlice';


export default function ContactsScreen() {
  const dispatch = useDispatch();
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  const resetForm = () => {
    setName('');
    setPhone('');
    setRelationship('');
    setIsAddingContact(false);
    setEditingContactId(null);
  };

  const handleAddContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      name,
      phone,
      relationship: relationship || 'Not specified',
      isEmergencyContact: true
    };

    dispatch(addContact(newContact));
    resetForm();
  };

  const handleUpdateContact = () => {
    if (!editingContactId) return;
    
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    const updatedContact = {
      id: editingContactId,
      name,
      phone,
      relationship: relationship || 'Not specified',
      isEmergencyContact: true
    };

    dispatch(updateContact(updatedContact));
    resetForm();
  };

  const handleEditContact = (contact: any) => {
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    setEditingContactId(contact.id);
  };

  const handleDeleteContact = (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => dispatch(deleteContact(id)),
          style: 'destructive',
        },
      ]
    );
  };

  const renderContactItem = ({ item }: { item: any }) => {
    if (editingContactId === item.id) {
      return (
        <View style={styles.editContactContainer}>
          <Text style={styles.editContactTitle}>Edit Contact</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Relationship</Text>
            <TextInput
              style={styles.input}
              value={relationship}
              onChangeText={setRelationship}
              placeholder="Relationship (e.g., Family, Friend)"
            />
          </View>
          
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity 
              style={[styles.editButton, styles.cancelButton]} 
              onPress={resetForm}
            >
              <X size={20} color="#fff" />
              <Text style={styles.editButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editButton, styles.saveButton]} 
              onPress={handleUpdateContact}
            >
              <Save size={20} color="#fff" />
              <Text style={styles.editButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.contactItem}>
        <View style={styles.contactAvatar}>
          <User size={24} color="#FF4785" />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <View style={styles.contactDetails}>
            <Phone size={16} color="#666" />
            <Text style={styles.contactPhone}>{item.phone}</Text>
          </View>
          <Text style={styles.contactRelationship}>{item.relationship}</Text>
        </View>
        <View style={styles.contactActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleEditContact(item)}
          >
            <Edit size={20} color="#FF4785" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleDeleteContact(item.id)}
          >
            <Trash2 size={20} color="#FF4785" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <Text style={styles.headerSubtitle}>
          These contacts will be notified in case of emergency
        </Text>
      </View>

      {isAddingContact ? (
        <View style={styles.addContactContainer}>
          <Text style={styles.addContactTitle}>Add New Contact</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Relationship</Text>
            <TextInput
              style={styles.input}
              value={relationship}
              onChangeText={setRelationship}
              placeholder="Relationship (e.g., Family, Friend)"
            />
          </View>
          
          <View style={styles.addButtonsContainer}>
            <TouchableOpacity 
              style={[styles.addButton, styles.cancelButton]} 
              onPress={resetForm}
            >
              <X size={20} color="#fff" />
              <Text style={styles.addButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.addButton, styles.saveButton]} 
              onPress={handleAddContact}
            >
              <Save size={20} color="#fff" />
              <Text style={styles.addButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.addContactButton}
          onPress={() => setIsAddingContact(true)}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.addContactButtonText}>Add Emergency Contact</Text>
        </TouchableOpacity>
      )}

      {contacts.length === 0 && !isAddingContact ? (
        <View style={styles.emptyContainer}>
          <User size={60} color="#ccc" />
          <Text style={styles.emptyText}>No emergency contacts added yet</Text>
          <Text style={styles.emptySubtext}>
            Add contacts who should be notified in case of emergency
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contactsList}
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
  addContactButton: {
    flexDirection: 'row',
    backgroundColor: '#FF4785',
    padding: 15,
    borderRadius: 10,
    margin: 20,
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
  addContactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
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
  contactsList: {
    padding: 20,
  },
  contactItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  contactRelationship: {
    fontSize: 14,
    color: '#999',
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  addContactContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addContactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
  addButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  saveButton: {
    backgroundColor: '#FF4785',
  },
  editContactContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editContactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});