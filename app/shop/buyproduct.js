import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import PocketBase from 'pocketbase';
import { useUser } from '../storage';

const pb = new PocketBase('https://zero.pockethost.io');

export const Buyproduct = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [upiId, setUpiId] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const { userData } = useUser();
  const previousScreen = route.params?.previousScreen || 'Product';
  const singleProduct = route.params?.product;

  useEffect(() => {
    console.log("previousScreen: ",previousScreen)
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (previousScreen == 'Cart') {
        // Fetch cart items
        const cartItems = await pb.collection('cart').getFullList({
          filter: `user_id = "${userData.id}"`,
          expand: 'product_id'
        });

        console.log("cartitems: ",cartItems)

        const cartProducts = cartItems.map(item => ({
          ...item.expand.product_id,
          quantity: item.quantity
        }));

        console.log(cartProducts)
        
        setProducts(cartProducts);
        calculateTotalPrice(cartProducts);
      } else {
        // Single product from previous screen
        setProducts([singleProduct]);
        setTotalPrice(singleProduct.price * quantity);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = (type) => {
    let newQuantity = quantity;
    if (type === 'increase') {
      newQuantity += 1;
    } else if (type === 'decrease' && quantity > 1) {
      newQuantity -= 1;
    }
    setQuantity(newQuantity);
    setTotalPrice(singleProduct.price * newQuantity);
  };

  const handlePayment = async () => {
    if (!upiId) {
      Alert.alert('Error', 'Please enter a valid UPI ID.');
      return;
    }
    
    try {
      // Here you would typically process the payment
      Alert.alert('Payment Successful', `You have paid $${totalPrice.toFixed(2)} using UPI.`);
      if (previousScreen === 'Cart') {
        // Clear cart after successful payment
        await pb.collection('cart').delete();
      }
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {products.map((product, index) => (
          <View key={index} style={styles.productCard}>
            <Image 
              source={{ uri: product.image_url }} 
              style={styles.productImage} 
              resizeMode="contain" 
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.product_name}</Text>
              <Text style={styles.productCategory}>
                Category: {product.category}
              </Text>
              <Text style={styles.productPrice}>
                ${product.price.toFixed(2)}
              </Text>
              {previousScreen === 'Cart' ? (
                <Text style={styles.quantityText}>
                  Quantity: {product.quantity}
                </Text>
              ) : (
                <View style={styles.quantityControl}>
                  <TouchableOpacity 
                    onPress={() => handleQuantityChange('decrease')} 
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity 
                    onPress={() => handleQuantityChange('increase')} 
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.paymentLabel}>Payment Method: UPI</Text>
          <TextInput
            placeholder="Enter UPI ID"
            placeholderTextColor="#666"
            style={styles.upiInput}
            value={upiId}
            onChangeText={setUpiId}
          />
        </View>

        <TouchableOpacity 
          style={styles.payButton} 
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#333',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginHorizontal: 16,
  },
  totalSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  upiInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});