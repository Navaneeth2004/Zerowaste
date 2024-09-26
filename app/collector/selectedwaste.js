import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { BlurView } from 'expo-blur';

import BackgroundImage from '../../assets/profile/profile.jpg';
import WasteImage from '../../assets/test/cardboard.webp';

export const SelectedWaste = ({ navigation }) => {
  const [imageIndex, setImageIndex] = useState(2);
  const [role, setRole] = useState('selle');

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <BlurView intensity={80} style={styles.blurView}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.postContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Waste Details')} style={styles.post}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={WasteImage} />
              <View style={styles.indicatorContainer}>
                <Text style={styles.indicatorText}>Total: {imageIndex}</Text>
              </View>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.wasteTitle}>Cardboard and Plastic Wastes</Text>
              <Text style={styles.wasteCategory}>Cardboard, Plastic</Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Estimated Weight: </Text>5kg
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Rate: </Text>120 Rs
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Collector: </Text>Antony Das
              </Text>
              <Text style={styles.dateText}>1:24 PM, 1/07/2024</Text>
            </View>
          </TouchableOpacity>
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
            <TouchableOpacity>
              <FontAwesome style={styles.icon} name="recycle" size={30} color="#fff" />
              <Text style={styles.tabLabel}>Recycle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
              <FontAwesome style={styles.icon} name="shopping-cart" size={30} color="#fff" />
              <Text style={styles.tabLabel}>Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <FontAwesome style={styles.icon} name="user-circle" size={30} color="#fff" />
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
            <TouchableOpacity>
              <FontAwesome style={styles.icon} name="check-square-o" size={30} color="#85dfdf" />
              <Text style={styles.tabLabel}>Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
              <FontAwesome style={styles.icon} name="shopping-cart" size={30} color="#fff" />
              <Text style={styles.tabLabel}>Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <FontAwesome style={styles.icon} name="user-circle" size={30} color="#fff" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },  
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  postContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginHorizontal: 20,
  },
  post: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: 'lightgray',
    borderWidth: 3,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 25,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 5,
    padding: 5,
  },
  indicatorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsContainer: {
    paddingVertical: 5,
  },
  wasteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  wasteCategory: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
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