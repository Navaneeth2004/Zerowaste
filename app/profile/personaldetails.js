import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import BackgroundImage from '../../assets/profile/profile.jpg';
import ProfileImage from '../../assets/test/dog.png';

export const Personaldetails = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [edit, setedit] = useState(false);

  const toggleEdit = () => {
    setedit(!edit);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        !edit ? (
          <TouchableOpacity onPress={toggleEdit}>
            <FontAwesome name="edit" size={30} color="black" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={toggleEdit}>
            <FontAwesome name="save" size={30} color="black" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        )
      ),
    });
  }, [navigation, toggleEdit]);

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <BlurView intensity={80} style={styles.blurView}>
      <ScrollView contentContainerStyle={styles.insideContainer}>
        <View style={styles.profileContainer}>
          <Image source={ProfileImage} style={styles.profileImage} />
        </View>
        <View style={styles.detailsContainer}>
          {[
            { label: "Name", value: name, onChange: setName },
            { label: "Phone", value: phone, onChange: setPhone },
            { label: "Username", value: username, onChange: setUsername },
            { label: "Password", value: password, onChange: setPassword, secure: true },
            { label: "Address Line 1", value: address1, onChange: setAddress1, multiline: true },
            { label: "Address Line 2", value: address2, onChange: setAddress2, multiline: true },
            { label: "City", value: city, onChange: setCity },
            { label: "State", value: state, onChange: setState },
            { label: "Zip Code", value: zip, onChange: setZip }
          ].map((field, index) => (
            <View style={styles.card} key={index}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={[styles.textbox, field.multiline && styles.addressbox]}
                onChangeText={field.onChange}
                secureTextEntry={field.secure}
                multiline={field.multiline}
                value={field.value}
                editable={edit}
                placeholder={`Enter ${field.label}`}
                placeholderTextColor="#888"
              />
            </View>
          ))}
        </View>
      </ScrollView>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  blurView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  insideContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#fff',
    marginVertical: 15,
  },
  detailsContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textbox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  addressbox: {
    height: 80,
    textAlignVertical: 'top',
  },
});
