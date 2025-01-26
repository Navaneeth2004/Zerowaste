//Importing important libraries
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import {React,useEffect,useState} from 'react';
import Toast from 'react-native-toast-message';
import { useUser } from '../storage';
import PocketBase from 'pocketbase';

//Connecting to the database
const pb = new PocketBase('https://zero.pockethost.io');
import ProfileImage from '../../assets/test/dog.png';

//Importing background picture
import BackgroundImage from '../../assets/profile/profile.jpg';

export const BaseProfile = ({ navigation }) => {

  const { userData, clearUserData } = useUser();//Importing local storage
  const [schedule,setschedule] = useState(false);

  //Fetching the data once 
  useEffect(() => {
    fetchsubdata();
  }, []);

  //Fetching subscription data to check whether the user has already subscribed
  const fetchsubdata = async () => {
    try {
      await pb.collection('subscription').getFirstListItem(`subscriber_id="${userData.id}"`)
      setschedule(true)
      
    } catch (error) {
      if (error.status === 404 || error.message.includes("not found")) {
        setschedule(false);
      }
      else
      {
        console.log("Error occured while fetching Subscription: "+error)
      }
    }
  };

  //When clicked on logout button
  const logout = () => {
    Alert.alert(
      "Logout",
      "Do you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            navigation.navigate('Login');
            Toast.show({ text1: "Logged out successfully", type: "info", position: "top" });
            clearUserData();
          } 
        },
      ]
    );
  };

  //Button code to avoid redundancy
  const renderButton = (icon, text, route) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate(route)} 
      style={styles.button}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['rgba(66, 66, 66, 0.8)', 'rgba(33, 33, 33, 0.8)']}
        style={styles.buttonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FontAwesome name={icon} size={22} color={icon=='star'?'gold':'#E0E0E0'} style={styles.icon} />
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={BackgroundImage} 
      style={styles.container}
      imageStyle={{ opacity: 0.3 }}
    >
        <ScrollView 
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
              <Image source={ProfileImage} style={styles.profileImage} />
              <View style={styles.statusIndicator} />
            </View>
            <Text style={styles.username}>{userData.username}</Text>
            <LinearGradient
              colors={['#2E7D32', '#1B5E20']}
              style={styles.roleContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.role}>{userData.role}</Text>
            </LinearGradient>
          </View>
          
          <View>
            {renderButton('address-book', 'Personal Details', 'Personal Details')}
            {renderButton('book', 'Activity', 'Activity')}
            {renderButton('ticket', 'Ticket', 'Ticket')}
            {userData.role=="seller"&&renderButton(
              //checking if user is subscriber using the local storage
              userData.subscriber === "true" ? 'truck' : 'star',
              userData.subscriber === "true" ? 'Schedule Pickups' : 'Subscribe',
              userData.subscriber === "true" ? schedule?'Schedule':'Schedule Pickup' : 'Subscription'
            )}
            {renderButton('sliders', 'Settings', 'Settings')}
            {renderButton('info-circle', 'About Us', 'About Us')}
            <TouchableOpacity 
              onPress={logout} 
              style={styles.button}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(198, 40, 40, 0.8)', 'rgba(183, 28, 28, 0.8)']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome name='sign-out' size={22} color="#FFCDD2" style={styles.icon} />
                <Text style={[styles.buttonText, { color: '#FFCDD2' }]}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Recycle Bin')}
          >
            <FontAwesome name="recycle" size={24} color="#6B7280" />
            <Text style={styles.navText}>Recycle</Text>
          </TouchableOpacity>
          {
          //Only render if user is not seller
          userData.role!="seller"?
            <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Jobs')}
            >
              <FontAwesome name="clipboard" size={24} color="#6B7280" />
              <Text style={styles.navText}>Jobs</Text>
            </TouchableOpacity>
          :
          null
          }
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Shop')}
          >
            <FontAwesome name="shopping-cart" size={24} color="#6B7280" />
            <Text style={styles.navText}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
          >
            <FontAwesome name="user-circle" size={24} color="#3B82F6" />
            <Text style={[styles.navText,styles.activeNavText]}>Profile</Text>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  blurView: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.85)',
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#424242',
    borderWidth: 3,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#212121',
  },
  username: {
    fontSize: 24,
    color: '#FAFAFA',
    fontWeight: 'bold',
    marginVertical: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  roleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom:20
  },
  role: {
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  button: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 15,
    width: 22,
  },
  buttonText: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 15,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 85, 99, 0.3)',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#3B82F6',
  },
});