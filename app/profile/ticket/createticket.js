import { View, Text, ScrollView, TextInput, StyleSheet, ImageBackground, Alert } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';

import background from '../../../assets/profile/profile.jpg';

export const CreateTicket = ({navigation}) => {
  const [tickettype, settickettype] = useState('report');
  const [subject, setsubject] = useState('');
  const [detail, setdetail] = useState('');

  const submit = () => {
    Alert.alert(
      "Submit",
      "Do you want to submit the Ticket?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Submit",
          onPress: () => navigation.navigate('Ticket'),
        },
      ]
    );
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.selector}>
            <Picker selectedValue={tickettype} onValueChange={(value) => settickettype(value)}>
              <Picker.Item label='Report' value="report" />
              <Picker.Item label='Support' value="support" />
            </Picker>
          </View>
          <TextInput
            multiline={true}
            style={styles.textInput}
            onChangeText={(value) => setsubject(value)}
            placeholder='Subject'
            placeholderTextColor="#999"
          />
          <TextInput
            multiline={true}
            style={[styles.textInput, styles.textDetail]}
            onChangeText={(value) => setdetail(value)}
            placeholder='Details'
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={submit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  selector: {
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    height: 50,
    justifyContent: 'center',
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    height: 70,
    padding: 10,
    paddingLeft: 20,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  textDetail: {
    height: 200,
  },
  button: {
    backgroundColor: '#4087e1',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateTicket;
