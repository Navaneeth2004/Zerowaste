import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Alert, StatusBar } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';

import ProfileImage from '../../assets/test/dog.png';
import BackgroundImage from '../../assets/profile/profile.jpg';
import { BlurView } from 'expo-blur';

export const BaseProfile = ({ navigation }) => {
  const [role, setRole] = useState('seller');
  const [sub,setsub] = useState('subscribe');

  const logout = () => {
    Alert.alert(
      "Logout",
      "Do you want to logout?",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <BlurView intensity={80} style={styles.blurView}>
        <ScrollView>
          <View style={styles.mainContent}>
            <View style={styles.profileContainer}>
              <Image source={ProfileImage} style={styles.profileImage} />
              <Text style={styles.username}>Username</Text>
              <Text style={styles.role}>Seller</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Personal Details')} style={styles.button}>
                <FontAwesome name='address-book' size={25} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Personal Details</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Activity')} style={styles.button}>
                <FontAwesome name='book' size={25} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Activity</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Ticket')} style={styles.button}>
                <FontAwesome name='ticket' size={25} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Ticket</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Subscription')} style={styles.button}>
                <FontAwesome name={sub=='subscribed'?'truck':'star'} size={25} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>{sub=='subscribed'?'Schedule Pickups':'Subscribe'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.button}>
                <FontAwesome name='sliders' size={25} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('About Us')} style={styles.button}>
                <FontAwesome name='info-circle' size={25} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>About Us</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={logout} style={[styles.button,{marginBottom:50}]}>
                <FontAwesome name='sign-out' size={25} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
          {
            role === 'seller' ? (
            <LinearGradient
              colors={['#23374D', '#416788']}
              style={styles.bottomTab}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity onPress={() => navigation.navigate('Recycle Bin')}>
                <FontAwesome style={styles.icon} name="recycle" size={30} color="#fff" />
                <Text style={styles.tabLabel}>Recycle</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                <FontAwesome style={styles.icon} name="shopping-cart" size={30} color="#fff" />
                <Text style={styles.tabLabel}>Shop</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome style={styles.icon} name="user-circle" size={30} color="#85dfdf" />
                <Text style={styles.tabLabel}>Profile</Text>
              </TouchableOpacity>
            </LinearGradient>
            ) : (
            <LinearGradient
              colors={['#23374D', '#416788']}
              style={styles.bottomTab}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity onPress={() => navigation.navigate('Recycle Bin')}>
                <FontAwesome style={styles.icon} name="recycle" size={30} color="#fff" />
                <Text style={styles.tabLabel}>Recycle</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
                <FontAwesome style={styles.icon} name="check-square-o" size={30} color="#fff" />
                <Text style={styles.tabLabel}>Jobs</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                <FontAwesome style={styles.icon} name="shopping-cart" size={30} color="#fff" />
                <Text style={styles.tabLabel}>Shop</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome style={styles.icon} name="user-circle" size={30} color="#85dfdf" />
                <Text style={styles.tabLabel}>Profile</Text>
              </TouchableOpacity>
            </LinearGradient>
            )
          }
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 60,
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: 'white',
    borderWidth: 2,
  },
  username: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  role: {
    fontSize: 16,
    color: 'lightgreen',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
  },
  icon: {
    marginRight: 15,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    paddingLeft:10
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  icon: {
    alignSelf: 'center',
    marginVertical: 5,
  },
  tabLabel: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
});
