import { View, Text, StyleSheet, ImageBackground, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import background from '../../assets/profile/profile.jpg'

const { width, height } = Dimensions.get('window');

export const Subscription = ({navigation}) => {
  return (
    <ImageBackground 
      source={background} 
      style={styles.imagebackground}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.gradientOverlay}
        locations={[0, 0.6, 1]}
      />
        <View style={styles.maincontainer}>
          <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
            <View style={styles.container}>
              <View style={styles.iconContainer}>
                <FontAwesome name="calendar-check-o" size={40} color="#4CAF50" />
              </View>
              
              <Text style={styles.title}>
                Auto-Pickup Scheduler
              </Text>
              
              <Text style={styles.subtitle}>
                Set It and Forget It!
              </Text>

              <View style={styles.divider} />

              <Text style={styles.description}>
                Tired of listing your waste every day? With our Auto-Pickup Scheduler,
                you can easily set up recurring waste pickups at intervals that suit you.
              </Text>

              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <FontAwesome name="clock-o" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Daily or Weekly Pickups</Text>
                </View>
                <View style={styles.featureItem}>
                  <FontAwesome name="refresh" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Automatic Scheduling</Text>
                </View>
                <View style={styles.featureItem}>
                  <FontAwesome name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Hassle-free Management</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => navigation.navigate('Payment')} 
                style={styles.button}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                  <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  imagebackground: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  maincontainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  blurContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 16,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: '#E0E0E0',
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  featureText: {
    color: '#E0E0E0',
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
});