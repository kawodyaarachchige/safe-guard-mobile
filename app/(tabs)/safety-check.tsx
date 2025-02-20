import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SafetyCheckScreen() {
  const [duration, setDuration] = useState('30');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Function to trigger an emergency alert
  const triggerEmergencyAlert = () => {
    // Replace this with actual logic to notify emergency contacts
    Alert.alert(
      'Emergency Alert',
      'Your safety check timer has expired! An alert has been sent to your emergency contacts.',
      [{ text: 'OK', onPress: () => console.log('Alert acknowledged') }]
    );
    console.log('Emergency alert triggered!');
  };

  // Effect to handle the timer countdown
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerActive(false);
            triggerEmergencyAlert(); // Trigger the alert when the timer reaches zero
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive, timeLeft]);

  // Function to start the safety check timer
  const startSafetyCheck = () => {
    const minutes = parseInt(duration);
    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number of minutes.');
      return;
    }
    setTimeLeft(minutes * 60);
    setIsTimerActive(true);
  };

  // Function to cancel the safety check timer
  const cancelSafetyCheck = () => {
    setIsTimerActive(false);
    setTimeLeft(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Function to format the time in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {!isTimerActive ? (
        <View style={styles.setupContainer}>
          <Text style={styles.title}>Set Safety Timer</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
              placeholder="Minutes"
              maxLength={3}
            />
            <Text style={styles.inputLabel}>minutes</Text>
          </View>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startSafetyCheck}>
            <Text style={styles.buttonText}>Start Timer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>remaining</Text>
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelSafetyCheck}>
            <Text style={styles.cancelText}>Cancel Timer</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#666" />
        <Text style={styles.infoText}>
          If you don't confirm your safety before the timer expires, we'll automatically alert your emergency contacts.
        </Text>
      </View>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 24,
    width: 120,
    textAlign: 'center',
    marginRight: 10,
  },
  inputLabel: {
    fontSize: 20,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    color: '#666',
    lineHeight: 20,
  },
});