import { View, Text, Image, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { Feather } from '@expo/vector-icons';
import dog from '../../assets/test/dog.png';

const pb = new PocketBase('https://zero.pockethost.io');

const defaultData = {
  user_name: 'John Doe',
  role: 'Collector',
  user_phone: 1234567890,
  rating: 4.5,
};

export const Profile = ({route}) => {
  const [profileData, setProfileData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const record = await pb.collection('user').getOne(route.params.profileid);
      
      setProfileData({
        ...defaultData,
        ...record
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ImageBackground 
        source={require('../../assets/profile/profile.jpg')} 
        style={styles.backgroundImage}
        blurRadius={0}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.profileSection}>
              <View style={styles.profilePicWrapper}>
                <Image source={dog} style={styles.profilePic} />
                <View style={styles.statusDot} />
              </View>
              <View style={styles.nameSection}>
                <Text style={styles.name}>{profileData.user_name}</Text>
                <Text style={styles.role}>{profileData.role}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Rating</Text>
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingNumber}>{profileData.rating || 'No Ratings'}</Text>
                  {
                    profileData.rating?
                    <Text style={styles.ratingStar}>★</Text>
                    :null
                  }
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Status</Text>
                <Text style={styles.statValue}>Active</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Feather name="phone" size={20} color="#10b981" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{profileData.user_phone}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Feather name="calendar" size={20} color="#10b981" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>
                    {profileData.created 
                      ? new Date(profileData.created).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'January 2024'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#10b981',
  },
  statusDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#111827',
  },
  nameSection: {
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#374151',
    marginHorizontal: 15,
  },
  statLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 5,
  },
  ratingStar: {
    fontSize: 20,
    color: '#10b981',
  },
  infoCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginBottom: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
});