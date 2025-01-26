//Importing important libraries
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import React from 'react'
import BackgroundImage from '../../../assets/profile/profile2.jpg'


export const BaseActivity = ({navigation}) => {
  //attributes to be given to the button
  const activities = [
    {
      title: 'Recycled Waste',
      icon: 'recycle',
      screen: 'Recycled Waste',
      color: '#4CAF50'
    },
    {
      title: 'Products Bought',
      icon: 'shopping-bag',
      screen: 'Bought Products',
      color: '#FF9800'
    }
  ]

  return (
    <ImageBackground 
      source={BackgroundImage} 
      style={styles.container}
    >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.buttonContainer}>
            {activities.map((activity, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(activity.screen)}
                style={styles.button}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: activity.color }]}>
                  <FontAwesome name={activity.icon} size={24} color="white" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonText}>{activity.title}</Text>
                  <Text style={styles.buttonSubText}>View Details</Text>
                </View>
                <FontAwesome name="angle-right" size={20} color="#666" style={styles.arrowIcon} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop:20
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  buttonSubText: {
    fontSize: 14,
    color: '#999',
  },
  arrowIcon: {
    marginLeft: 10,
  }
})