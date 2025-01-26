//Importing important libraries
import { View, Text, ScrollView, TextInput, StyleSheet, ImageBackground, Alert, TouchableOpacity, ActivityIndicator,KeyboardAvoidingView,Platform } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { useUser } from '../../storage';

//Connection to database
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

//Importing background image
import background from '../../../assets/profile/profile.jpg';

//attributes to be given to the select button
const TICKET_TYPES = [
  { label: 'Report', value: 'Report' },
  { label: 'Feature Request', value: 'Feature' },
  { label: 'Bug Report', value: 'Bug' },
];

export const CreateTicket = ({ navigation }) => {
  const { userData } = useUser();//Importing local storage
  const [tickettype, settickettype] = useState('Report');//Report by default
  const [subject, setsubject] = useState('');
  const [detail, setdetail] = useState('');
  const [loading, setloading] = useState(false);

  //Toast function using parameters
  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  };

  // To create the record when pressed on submit ticket and to validate as well
  const create_record = async () => {

    if (!subject.trim() || !detail.trim()) {
      showToast('error', 'Validation Error', 'Please fill in all fields');
      return;
    }

    if (subject.trim().length > 50) {
      showToast('error', 'Validation Error', 'Subject must not be longer than 50 characters');
      return;
    }

    if (detail.trim().length > 1000) {
      showToast('error', 'Validation Error', 'Detail must not be longer than 1000 characters');
      return;
    }

    setloading(true);
    //After all validations data is stored in a dictionary to insert into database
    try {
      const data = {
        user_id: userData.id,
        tickettype,
        subject: subject.trim(),
        details: detail.trim(),
        status: 'Open',
        created_at: new Date().toISOString(),
      };

      await pb.collection('ticket').create(data);
      showToast('success', 'Success', 'Ticket created successfully!');
      navigation.navigate('Ticket');
    } catch (error) {
      console.error("Error creating ticket:", error.data);
      showToast('error', 'Error', 'Failed to create ticket. Please try again.');
    } finally {
      setloading(false);
    }
};

  //Asking if user wants to submit the ticket
  const submit = () => {
    Alert.alert(
      "Submit Ticket",
      "Are you sure you want to submit this ticket?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Submit",
          onPress: create_record,
          style: "default"
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ImageBackground 
      source={background} 
      style={styles.background}
      blurRadius={2}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.background}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            
            <View style={styles.selector}>
              <Picker
                selectedValue={tickettype}
                onValueChange={settickettype}
                dropdownIconColor="#fff"
                style={styles.picker}
              >
                {TICKET_TYPES.map((type) => (
                  <Picker.Item 
                    key={type.value}
                    label={type.label}
                    value={type.value}
                    color="black"
                  />
                ))}
              </Picker>
            </View>

            <TextInput
              style={styles.textInput}
              onChangeText={setsubject}
              value={subject}
              placeholder='Subject'
              placeholderTextColor="#999"
              maxLength={100}
            />

            <TextInput
              style={[styles.textInput, styles.textDetail]}
              onChangeText={setdetail}
              value={detail}
              placeholder='Provide detailed information...'
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity 
              onPress={submit}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit Ticket</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selector: {
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#2a2a2a',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    height: 50,
  },
  textInput: {
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    padding: 12,
    color: '#fff',
    backgroundColor: '#2a2a2a',
    fontSize: 16,
  },
  textDetail: {
    height: 200,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#164B77',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});