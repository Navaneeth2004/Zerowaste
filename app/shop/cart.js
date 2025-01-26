import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackgroundImage from '../../assets/profile/profile.jpg';
import Toast from 'react-native-toast-message';
import { useUser } from '../storage';

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

export const Cart = ({ navigation }) => {
  const { userData } = useUser();
  const [cartItems, setCartItems] = useState({});
  const [productDict, setproductDict] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const resultList = await pb.collection('cart').getFullList({
        sort: '-created',
        filter: `user_id="${userData.id}"`,
      });
      const items = {};
      const productIds = [];
      for (const item of resultList) {
        items[item.id] = {
          id: item.id,
          productId: item.product_id,
          quantity: item.quantity,
        };
        productIds.push(item.product_id);
      }

      setCartItems(items);
      await fetchProductDetails(productIds);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching cart items',
        position: 'top',
        visibilityTime: 3000,
      });
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productIds) => {
    try {
      const products = {};
      for (const productId of productIds) {
        const product = await pb.collection('product').getOne(productId);
        products[productId] = {
          name: product.product_name,
          category: product.category_id,
          price: product.price,
          lastImageUrl: product.image_url,
          stockQuantity: product.stock_quantity,
          description: product.description,
          rating: product.average_rating,
          quantity: cartItems[Object.keys(cartItems).find(key => cartItems[key].productId === productId)]?.quantity || 1
        };
      }
      setproductDict(products);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching product details',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const deleteProduct = (productId) => {
    Alert.alert(
      'Remove Product',
      'Remove product from cart list?',
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // Find the cart item ID for this product
              const cartItemId = Object.keys(cartItems).find(
                key => cartItems[key].productId === productId
              );
              if (cartItemId) {
                await pb.collection('cart').delete(cartItemId);
                const newProductDict = { ...productDict };
                delete newProductDict[productId];
                setproductDict(newProductDict);
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Product removed from cart',
                  position: 'top',
                  visibilityTime: 2000,
                });
              }
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to remove product',
                position: 'top',
                visibilityTime: 3000,
              });
            }
          }
        }
      ]
    );
  };

  const calculateTotal = () => {
    return Object.values(productDict).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const updateQuantity = async (productId, change) => {
    const cartItemId = Object.keys(cartItems).find(
      key => cartItems[key].productId === productId
    );
    
    const newQuantity = Math.max(1, productDict[productId].quantity + change);
    
    try {
      await pb.collection('cart').update(cartItemId, {
        quantity: newQuantity
      });
      
      setproductDict(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity
        }
      }));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update quantity',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.keys(productDict).length > 0 ? (
          <>
            {Object.entries(productDict).map(([id, item]) => (
              <View key={id} style={styles.productDetails}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.lastImageUrl }} style={styles.productImage} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productCategory}>{item.category}</Text>
                  <Text style={styles.productPrice}>{item.price}</Text>
                  <Text numberOfLines={2} style={styles.productDescription}>{item.description}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => updateQuantity(id, -1)} style={styles.quantityButton}>
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(id, 1)} style={styles.quantityButton}>
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.productRating}>★ {item.rating.toFixed(1)}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteProduct(id)} style={styles.deleteButton}>
                  <FontAwesome name='trash' size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              {Object.entries(productDict).map(([id, item]) => (
                <View key={id} style={styles.summaryItem}>
                  <Text style={styles.summaryItemName}>{item.name} (x{item.quantity})</Text>
                  <Text style={styles.summaryItemPrice}>{(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalAmount}>{calculateTotal().toFixed(2)}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Buy',{previousScreen:"Cart"})} 
                style={styles.buyButton}
              >
                <Text style={styles.buyButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="shopping-cart" size={50} color="#888" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Shop')}
              style={styles.continueShopping}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black'
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  productDetails: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 110,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
  },
  productPrice: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    color: '#666',
    fontSize: 13,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  productRating: {
    color: '#f39c12',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItemName: {
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  summaryItemPrice: {
    color: '#333',
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 12,
    paddingTop: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  buyButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  continueShopping: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});