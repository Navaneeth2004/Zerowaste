import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import background from '../../assets/profile/profile.jpg';

export const AboutUs = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:Zerowaste@gmail.com');
  };

  const renderValueCard = (icon, title, description) => (
    <View style={styles.valueCard}>
      <MaterialIcons name={icon} size={32} color="#4CAF50" />
      <Text style={styles.valueCardTitle}>{title}</Text>
      <Text style={styles.valueCardDescription}>{description}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={background}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.headerSection}>
              <MaterialIcons name="eco" size={50} color="#4CAF50" />
              <Text style={styles.title}>About Us</Text>
              <Text style={styles.subtitle}>Making recycling accessible for everyone</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.description}>
                Welcome to our platform! We are committed to making recycling and waste management easy and accessible for everyone.
                Our mission is to connect sellers and collectors, helping you to recycle responsibly and reduce waste.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Vision</Text>
              <View style={styles.card}>
                <Text style={styles.description}>
                  We envision a cleaner and more sustainable world where everyone plays a part in reducing waste and recycling.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Values</Text>
              <View style={styles.valuesContainer}>
                {renderValueCard(
                  'nature',
                  'Sustainability',
                  'We believe in practices that protect our planet'
                )}
                {renderValueCard(
                  'people',
                  'Community',
                  'Building a community that supports each other in waste management'
                )}
                {renderValueCard(
                  'lightbulb',
                  'Innovation',
                  'Utilizing technology to improve recycling processes'
                )}
              </View>
            </View>

            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contact Us</Text>
              <TouchableOpacity onPress={handleEmailPress} style={styles.emailButton}>
                <MaterialIcons name="mail" size={24} color="#4CAF50" />
                <Text style={styles.emailText}>Zerowaste@gmail.com</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(26, 32, 44, 0.95)',
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E2E8F0',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(45, 55, 72, 0.7)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
  },
  valuesContainer: {
    gap: 15,
  },
  valueCard: {
    backgroundColor: 'rgba(45, 55, 72, 0.7)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  valueCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 10,
  },
  valueCardDescription: {
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
  },
  contactSection: {
    marginVertical: 30,
    alignItems: 'center',
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 55, 72, 0.7)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    gap: 10,
  },
  emailText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
});