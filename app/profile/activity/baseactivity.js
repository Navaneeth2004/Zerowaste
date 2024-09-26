import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground} from 'react-native'
import FontAwesome  from 'react-native-vector-icons/FontAwesome'
import React from 'react'
import { BlurView } from 'expo-blur';

import BackgroundImage from '../../../assets/profile/profile.jpg'

export const BaseActivity = ({navigation}) => {
  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <BlurView intensity={80} style={styles.blurView}>
        <ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Recycled Waste')} style={styles.button}>
              <FontAwesome name='recycle' size={25} color="black" style={styles.icon} />
              <Text style={styles.buttonText}>Recycled Waste</Text>
             </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Bought Products')} style={styles.button}>
              <FontAwesome name='shopping-bag' size={25} color="black" style={styles.icon} />
              <Text style={styles.buttonText}>Products Bought</Text>
             </TouchableOpacity>
          </View>
        </ScrollView>
      </BlurView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  blurView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  buttonContainer: {
    padding:15
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    color: 'black',
    paddingLeft:10
  },
})