//Importing important libraries
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, ImageBackground, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { useUser } from '../storage';

import background from '../../assets/profile/profile2.jpg';

//Connection to the database
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

//Fields that require input which will be used to generate using a function to avoid redundancy
const INPUT_FIELDS = [
  { key: 'username', icon: 'user' },
  { key: 'phone', icon: 'phone' },
  { key: 'address', icon: 'home', multiline: true },
  { key: 'upi', icon: 'credit-card' },
  { key: 'city', icon: 'map-marker' },
  { key: 'state', icon: 'map' },
  { key: 'zip', icon: 'location-arrow' }
];

export const Personaldetails = ({ navigation }) => {
  const { userData, setUserData } = useUser();//Importing local storage
  //State variable that will be used to update the database
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    upi: '',
    zip: '',
  });
  const [editMode, setEditMode] = useState(false);//To toggle edit mode
  const [loading, setLoading] = useState(false);

  // Initialize formData with userData when component mounts
  useEffect(() => {
    setFormData({
      username: userData.username || '',
      phone: userData.phone ? userData.phone.toString() : '',
      address: userData.address || '',
      state: userData.state || '',
      city: userData.city || '',
      upi: userData.upi || '',
      zip: userData.zip || '',
    });
  }, [userData]);

  //When input is changed the formdata is updated
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  //Validating the fields
  const validateForm = () => {
    // Check if any field is empty
    if (!formData.username || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zip) {
      Toast.show({ text1: "Please fill in the details", type: "error", position: "bottom" });
      return false;
    }
  
    // Check length limits for each field
    if (formData.username.length > 20) {
      Toast.show({ text1: "Username must be 20 characters or less", type: "error", position: "bottom" });
      return false;
    }
    if (formData.phone.length !== 10) {
      Toast.show({ text1: "Phone number must be exactly 10 digits", type: "error", position: "bottom" });
      return false;
    }
    if (formData.address.length > 100) {
      Toast.show({ text1: "Address must be 100 characters or less", type: "error", position: "bottom" });
      return false;
    }
    if (formData.city.length > 50) {
      Toast.show({ text1: "City name must be 50 characters or less", type: "error", position: "bottom" });
      return false;
    }
    if (formData.state.length > 20) {
      Toast.show({ text1: "State name must be 20 characters or less", type: "error", position: "bottom" });
      return false;
    }
    if (formData.zip.length > 10) {
      Toast.show({ text1: "Zip code must be 10 characters or less", type: "error", position: "bottom" });
      return false;
    }
  
    // If all checks pass, return true
    return true;
  };

  //When user clicks on save button
  const saveChanges = async () => {
    if (!validateForm()) return;//Check if validations are all correct

    setLoading(true);
    //Mounting all the values in a variable and updating the database
    try {
      const updatedData = {
        user_name: formData.username,
        user_phone: parseInt(formData.phone),
        upi: formData.upi,
        address_line: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zip,
      };

      await pb.collection('user').update(userData.id, updatedData);

      //Also updating the local storage
      setUserData(prevUserData => ({
        ...prevUserData,
        username: formData.username,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        upi: formData.upi,
        zip: formData.zip,
      }));

      Toast.show({ text1: 'Success', text2: 'Profile updated successfully!', type: 'success', position: 'top' });
      setEditMode(false);
    } catch (error) {
      console.error("An error occurred: ", error.data);
      Toast.show({ text1: 'Error', text2: 'Failed to update profile', type: 'error', position: 'top' });
      
      //If any error occured in between then reset the local storage values to previous fields
      setFormData({
        username: userData.username,
        phone: userData.phone ? userData.phone.toString() : '',
        address: userData.address,
        state: userData.state,
        city: userData.city,
        upi: userData.upi,
        zip: userData.zip,
      });
    } finally {
      setLoading(false);
    }
  };

  //Header of the content
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => (editMode ? saveChanges() : setEditMode(true))}
          style={styles.headerButton}
        >
          <FontAwesome name={editMode ? 'save' : 'edit'} size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#303132',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
    });
  }, [navigation, editMode, formData]);

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={background} 
        style={styles.backgroundImage}
        blurRadius={3}
      >
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2E7D32" />
            </View>
          )}
          
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.profileContainer}>
              <View style={styles.imageContainer}>
                <Image source={require('../../assets/test/dog.png')} style={styles.profileImage} />
                {!editMode && (
                  <TouchableOpacity style={styles.editButton}>
                    <FontAwesome name="camera" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.userName}>{formData.username}</Text>
            </View>

            <View style={styles.detailsContainer}>
              {INPUT_FIELDS.map(({ key, icon, multiline }) => (
                <View key={key} style={styles.card}>
                  <View style={styles.labelContainer}>
                    <FontAwesome name={icon} size={18} color="#4CAF50" />
                    <Text style={styles.label}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.textbox,
                      multiline && styles.multilineInput,
                      !editMode && styles.readOnlyInput
                    ]}
                    onChangeText={(value) => handleInputChange(key, value)}
                    value={formData[key]}
                    editable={editMode}
                    placeholderTextColor="#666"
                    multiline={multiline}
                    numberOfLines={multiline ? 3 : 1}
                    keyboardType={key === 'phone' ? 'numeric' : 'default'}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },  
  blurView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  headerButton: {
    marginRight: 15,
    padding: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  detailsContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
  textbox: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    opacity: 0.8,
  },
});