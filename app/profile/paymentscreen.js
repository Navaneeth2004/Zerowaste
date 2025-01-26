import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import { useUser } from '../storage';

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

export const PaymentScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const { userData,setUserData } = useUser();
  
  const merchantUpiId = "navaneeth2004pa@oksbi";
  const amount = "5.00";
  const merchantName = "ZeroWaste";
  
  const generateTransactionId = () => {
    return 'txn_' + Math.random().toString(36).substr(2, 9);
  };

  const initiateUPIPayment = async () => {
    const transactionId = generateTransactionId();
    const upiUrl = generateUPIUrl(transactionId);

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      
      if (supported) {
        setLoading(true);
        await Linking.openURL(upiUrl);
        checkTransactionStatus(transactionId);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No UPI apps found on your device',
          position: 'top',
          visibilityTime: 3000
        });
      }
    } catch (err) {
      console.error('UPI Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to open UPI payment',
        position: 'top',
        visibilityTime: 3000
      });
      setLoading(false);
    }
  };

  const generateUPIUrl = (transactionId) => {
    const upiData = {
      pa: merchantUpiId,
      pn: merchantName,
      tn: 'ZeroWaste Subscription',
      am: amount,
      cu: 'INR',
      tr: transactionId,
      mc: '5411',
      mode: '04',
      purpose: 'Subscription'
    };

    let upiUrl = 'upi://pay?';
    Object.keys(upiData).forEach((key, index) => {
      upiUrl += `${key}=${encodeURIComponent(upiData[key])}`;
      if (index < Object.keys(upiData).length - 1) {
        upiUrl += '&';
      }
    });

    return upiUrl;
  };

  const checkTransactionStatus = async () => {
    try {
      const data = {
        subscriber: true,
      };

      await pb.collection('user').update(userData.id, data);

      setUserData({
        id: userData.id,
        mail: userData.user_mail,
        username: userData.user_name,
        phone: String(userData.user_phone),
        address: userData.address_line,
        city: userData.city,
        state: userData.state,
        zip: userData.postal_code,
        idproof: userData.idproof,
        upi: userData.upi,
        collector_return: userData.collector_return,
        status: userData.account_status,
        subscriber: "true",
        role: userData.role
    });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Payment successful! Your subscription is now active.',
        position: 'top',
        visibilityTime: 3000,
        onHide: () => navigation.navigate('BaseProfile')
      });
      
    } catch (error) {
      console.error('Payment update error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update subscription status',
        position: 'top',
        visibilityTime: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Subscribe to ZeroWaste</Text>
        <Text style={styles.subtitle}>Amount: ₹{amount}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          • Access to Auto-Pickup Scheduler{'\n'}
          • Priority waste collection{'\n'}
          • Monthly subscription
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.payButton}
        onPress={initiateUPIPayment}
      >
        <LinearGradient
          colors={['#4CAF50', '#45a049']}
          style={styles.buttonGradient}
        >
          <FontAwesome name="credit-card" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Pay with UPI</Text>
        </LinearGradient>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Processing payment...</Text>
          <Text style={styles.loadingSubtext}>Please complete the payment in your UPI app</Text>
        </View>
      )}
      
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  infoText: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 24,
  },
  payButton: {
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 'auto',
    marginBottom: 20,
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
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  loadingSubtext: {
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
  },
});