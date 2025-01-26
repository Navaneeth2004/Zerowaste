import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { useUser } from '../storage';

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

export const Product = ({ navigation, route }) => {
  const { userData } = useUser();
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [cart, setCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendationsData, setRecommendations] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
    checkCartStatus(); 
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      fetchRecommendations();
    }
  }, [product]);

  const fetchProductDetails = async () => {
    try {
      const record = await pb.collection('product').getOne(id, {
        expand: 'category_id'
      });

      console.log("record is : ",record)

      const category = record.expand?.category_id;
      console.log('Category:', category);
  
      console.log(category)
      setProduct({
        id: record.id,
        name: record.product_name,
        category: category?.category_name || 'Uncategorized',
        price: record.price,
        imageUrl: record.image_url,
        quantity: record.stock_quantity,
        description: record.description,
        rating: record.average_rating || 0
      });
  
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch product details');
      console.error('Error fetching product:', error);
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const resultList = await pb.collection('review').getList(1, 50, {
        filter: `product_id = "${id}"`,
        sort: '-review_date',
        expand: 'user_id'      
      });

      const formattedComments = resultList.items.map(review => ({
        username: review.expand?.user_id?.user_name || 'Anonymous',
        rating: review.rating,
        comment: review.review_text,
        timestamp: new Date(review.review_date).toLocaleString(),
      }));

      setComments(formattedComments);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch reviews');
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const resultList = await pb.collection('product').getList(1, 5, {
        filter: `category_id = "${product.category}" && id != "${id}"`,
        sort: 'created'
      });

      const recommendations = resultList.items.map(item => ({
        id: item.id,
        name: item.product_name,
        price: item.price,
        imageUrl: item.image_url
      }));

      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleAddComment = async () => {
    if (comment && username && rating) {
      try {
        const data = {
          product_id: id,
          user_id: userData.id, 
          rating: rating,
          review_title: `Review by ${username}`,
          review_text: comment,
          review_date: new Date().toISOString()
        };

        await pb.collection('review').create(data);
        await fetchReviews();
        
        setComment('');
        setUsername('');
        setRating(0);
        setModalVisible(false);
        Alert.alert('Success', 'Review added successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to add review');
        console.error('Error adding review:', error);
      }
    }
  };

  const handleCart = async () => {
    try {
      if (cart) {
 
        Alert.alert(
          'Remove From Cart',
          'Are you sure you want to remove from cart?',
          [
            { text: "Cancel" },
            { 
              text: "Remove", 
              onPress: async () => {
                try {
            
                  const cartItems = await pb.collection('cart').getList(1, 1, {
                    filter: `user_id = "${userData.id}" && product_id = "${id}"`
                  });
                  
                  if (cartItems.items.length > 0) {
                
                    await pb.collection('cart').delete(cartItems.items[0].id);
                    setCart(false);
                    Alert.alert("Success", "Removed from cart!");
                  }
                } catch (error) {
                  console.error('Error removing from cart:', error);
                  Alert.alert("Error", "Failed to remove from cart");
                }
              }
            }
          ]
        );
      } else {
 
        try {
          const data = {
            user_id: userData.id,
            product_id: id,
            quantity: 1 
          };
  
          await pb.collection('cart').create(data);
          setCart(true);
          Alert.alert("Success", "Added to Cart!");
        } catch (error) {
          console.error('Error adding to cart:', error);
          Alert.alert("Error", "Failed to add to cart");
        }
      }
    } catch (error) {
      console.error('Cart operation error:', error);
      Alert.alert("Error", "Failed to perform cart operation");
    }
  };

  const checkCartStatus = async () => {
    try {
      const cartItems = await pb.collection('cart').getList(1, 1, {
        filter: `user_id = "${userData.id}" && product_id = "${id}"`
      });
      
      setCart(cartItems.items.length > 0);
    } catch (error) {
      console.error('Error checking cart status:', error);
    }
  };

  const renderProductDetails = () => (
    <View style={styles.productContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} resizeMode="contain" />
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.ratingContainer}>
          {renderStars(product.rating)}
          <Text style={styles.ratingText}>{product.rating}/5</Text>
        </View>
        
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        
        <View style={styles.metadata}>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Category</Text>
            <Text style={styles.metadataValue}>{product.category}</Text>
          </View>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>Stock</Text>
            <Text style={styles.metadataValue}>{product.quantity} units</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleCart} style={[styles.button, styles.cartButton]}>
            <Text style={styles.buttonText}>{cart ? 'Remove from Cart' : 'Add to Cart'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Buy',{product:product})} style={[styles.button, styles.buyButton]}>
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text 
          key={i} 
          style={{ 
            color: i < roundedRating ? '#FFD700' : '#666', 
            fontSize: 16,
            marginRight: 2 
          }}
        >
          ★
        </Text>
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const renderRecommendations = () => (
    <View style={styles.recommendationsSection}>
      <Text style={styles.sectionTitle}>You May Also Like</Text>
      <FlatList
        data={recommendationsData}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recommendationItem}>
            <View style={styles.recommendationImageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.recommendationImage} resizeMode="contain" />
            </View>
            <View style={styles.recommendationInfo}>
              <Text style={styles.recommendationName}>{item.name}</Text>
              <Text style={styles.recommendationPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendationsList}
      />
    </View>
  );

  const renderCommentsSection = () => (
    <View style={styles.commentsSection}>
      <View style={styles.commentHeader}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <TouchableOpacity 
          style={styles.addCommentButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addCommentText}>Write a Review</Text>
        </TouchableOpacity>
      </View>

      {comments.length === 0 ? (
        <View style={styles.noCommentsContainer}>
          <Text style={styles.noCommentsText}>No reviews yet. Be the first to review this product!</Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <View style={styles.commentCard}>
              <View style={styles.commentCardHeader}>
                <View style={styles.commentHeaderInfo}>
                  <Text style={styles.commentUsername}>{item.username}</Text>
                  {renderStars(item.rating)}
                </View>
                <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
              </View>
              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.commentsList}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : product ? (
        <FlatList
          data={[
            { key: 'Product Details', render: renderProductDetails },
            { key: 'Recommendations', render: renderRecommendations },
            { key: 'Comments', render: renderCommentsSection }
          ]}
          renderItem={({ item }) => (
            <View style={styles.section}>
              {item.render()}
            </View>
          )}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Product not found</Text>
        </View>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate the Product</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Your Name"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
            />
            <View style={styles.ratingInputContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                >
                  <Text style={{ 
                    fontSize: 30, 
                    color: star <= rating ? '#FFD700' : '#666' 
                  }}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.modalInput, styles.commentInput]}
              placeholder="Your Comment"
              placeholderTextColor="#666"
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
              <Text style={styles.buttonText}>Submit Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  section: {
    marginBottom: 20,
  },
  productContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: '#252525',
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 10,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    color: '#AAAAAA',
    lineHeight: 24,
    marginBottom: 20,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metadataItem: {
    backgroundColor: '#252525',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  metadataLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  metadataValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  cartButton: {
    backgroundColor: '#1E88E5',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationsSection: {
    marginTop: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
  },
  recommendationsList: {
    paddingVertical: 10,
  },
  recommendationItem: {
    width: 180,
    marginRight: 15,
    backgroundColor: '#252525',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendationImageContainer: {
    height: 180,
    backgroundColor: '#303030',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  recommendationInfo: {
    padding: 12,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recommendationPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  commentsSection: {
    marginTop: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addCommentButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addCommentText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  noCommentsContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 10,
  },
  noCommentsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  commentCard: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  commentCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentHeaderInfo: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#252525',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  commentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  ratingInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#666',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})