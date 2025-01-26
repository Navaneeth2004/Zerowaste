//Importing important libraries
import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView, StatusBar, ActivityIndicator, Dimensions, View } from 'react-native';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../storage';

// Connection to the server
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

// Importing images
import backgroundImage from '../../assets/registration-login/1.jpg';

//Getting device width and height
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const Registration = ({ navigation }) => {
  // State variables for form inputs and loading state
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  //Importing local storage
  const { setUserData } = useUser();

  // Function to create a user record
  const createRecord = async () => {
    const data = {
      user_name: username,
      user_password: password,
      user_phone: phone,
      role: role,
      address_line: address,
      city: city,
      state: state,
      user_mail: gmail.toLowerCase(),
      postal_code: zip,
      account_status: "Active",
      subscriber: false
    };

    try {
      const record = await pb.collection('user').create(data);
      //Set the local storage if user was able to create account
      setUserData({
        id: record.id,
        mail: record.user_mail,
        username: record.user_name,
        phone: String(record.user_phone),
        address: record.address_line,
        city: record.city,
        state: record.state,
        zip: record.postal_code,
        idproof: record.idproof,
        upi: record.upi,
        collector_return: record.collector_return,
        status: record.account_status,
        subscriber: String(record.subscriber),
        role: record.role
      });
      Toast.show({ text1: 'Success', text2: 'Registration successful!', type: 'success', position: 'top' });
      navigation.navigate('BaseProfile');
    } catch (error) {
      console.error("An Error occurred: ", error.data);
      Toast.show({ text1: 'Error', text2: 'An error occurred. Try again', type: 'error', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  //Validating the fields
  const validateAndRegister = () => {
    // Check if any field is empty
    if (!username || !password || !phone || !address || !city || !state || !gmail || !zip) {
      return Toast.show({ text1: "Please fill in all the details", type: "error", position: "bottom" });
    }
  
    if (!gmail.endsWith("@gmail.com")) {
      return Toast.show({ text1: "Please provide a valid Gmail", type: "error", position: "bottom" });
    }
    
    if (username.length > 20) {
      return Toast.show({ text1: "Username must be 20 characters or less", type: "error", position: "bottom" });
    }
    if (gmail.length > 25) {
      return Toast.show({ text1: "Gmail must be 25 characters or less", type: "error", position: "bottom" });
    }
    if (password.length > 20) {
      return Toast.show({ text1: "Password must be 20 characters or less", type: "error", position: "bottom" });
    }
    if (state.length > 20) {
      return Toast.show({ text1: "State name must be 20 characters or less", type: "error", position: "bottom" });
    }
    if (zip.length > 10) {
      return Toast.show({ text1: "Zip code must be 10 characters or less", type: "error", position: "bottom" });
    }
  
    if (password.length < 10) {
      return Toast.show({ text1: "Password must be more than 10 characters", type: "error", position: "bottom" });
    }
  
    if (phone.length !== 10) {
      return Toast.show({ text1: "Please provide a valid phone number", type: "error", position: "bottom" });
    }
  
    // Check if Gmail already exists in the database
    setLoading(true);
    pb.collection('user').getFirstListItem(`user_mail="${gmail.toLowerCase()}"`)
      .then(() => {
        Toast.show({ text1: "Gmail already exists", type: "error", position: "bottom" });
        setLoading(false);
      })
      .catch(() => {
        createRecord();
      });
  };
  

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground 
        style={styles.backgroundImage} 
        source={backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {role ? (
            <ScrollView contentContainerStyle={styles.container}>
              <TouchableOpacity 
                onPress={() => setRole(null)} 
                style={styles.backArrow}
              >
                <FontAwesome name='arrow-left' size={30} color="white" />
              </TouchableOpacity>

              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#01b697" />
                </View>
              )}
              
              <Text style={styles.header}>Create Account</Text>

              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <FontAwesome name="user" size={20} color="#01b697" style={styles.inputIcon} />
                  <TextInput 
                      style={styles.textbox} 
                      placeholder="Username"
                      onChangeText={setUsername}
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <FontAwesome name="phone" size={20} color="#01b697" style={styles.inputIcon} />
                  <TextInput 
                      style={styles.textbox} 
                      placeholder="Phone"
                      onChangeText={setPhone}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <FontAwesome name="envelope" size={20} color="#01b697" style={styles.inputIcon} />
                  <TextInput 
                      style={styles.textbox} 
                      placeholder="Gmail"
                      onChangeText={setGmail}
                      keyboardType="email-address"
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <FontAwesome name="key" size={20} color="#01b697" style={styles.inputIcon} />
                  <TextInput 
                      style={styles.textbox} 
                      placeholder="Password"
                      onChangeText={setPassword}
                      secureTextEntry
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <FontAwesome name="address-book" size={20} color="#01b697" style={styles.inputIcon} />
                  <TextInput 
                      style={styles.textbox} 
                      placeholder="Address"
                      onChangeText={setAddress}
                      multiline
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <FontAwesome name="building" size={20} color="#01b697" style={styles.inputIcon} />
                  <TextInput 
                      style={styles.textbox} 
                      placeholder="State"
                      onChangeText={setState}
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <FontAwesome name="home" size={20} color="#01b697" style={styles.inputIcon} />
                  <TextInput 
                      style={styles.textbox} 
                      placeholder="City"
                      onChangeText={setCity}
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <FontAwesome name="map-pin" size={20} color="#01b697" style={styles.inputIcon} />
                  <TextInput 
                      style={styles.textbox} 
                      placeholder="Zip Code"
                      onChangeText={setZip}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity 
                  onPress={validateAndRegister} 
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Login')}
                  style={styles.loginLink}
                >
                  <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginTextHighlight}>Log in</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.roleContainer}>
              <Text style={styles.roleHeader}>Choose Your Role</Text>
              <TouchableOpacity 
                onPress={() => setRole("seller")} 
                style={[styles.roleButton, styles.sellerButton]}
              >
                <FontAwesome name="shopping-cart" size={24} color="white"/>
                <Text style={styles.roleButtonText}>Seller</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setRole('collector')} 
                style={[styles.roleButton, styles.collectorButton]}
              >
                <FontAwesome name="truck" size={24} color="white"/>
                <Text style={styles.roleButtonText}>Collector</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: windowWidth,
    height: windowHeight,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backArrow: {
    position: 'absolute',
    top: 50,
    left: 25,
    zIndex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: 100,
    paddingBottom: 40,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  textbox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    color: 'white',
    width: '100%',
    fontSize: 16,
  },
  addressBox: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#01b697',
    width: '100%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  loginTextHighlight: {
    color: '#01b697',
    fontWeight: 'bold',
  },
  roleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  roleHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
    textAlign: 'center',
  },
  roleButton: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sellerButton: {
    backgroundColor: '#01b697',
  },
  collectorButton: {
    backgroundColor: '#0191b6',
  },
  roleButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inputIcon: {
      marginRight: 10,
  },
  textbox: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
});