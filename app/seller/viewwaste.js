import React, { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useUser } from '../storage';
import { TextInput } from 'react-native';

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

const { width } = Dimensions.get('window');

const EditModal = ({ visible, onClose, postDetails, categories, onSave }) => {
  const [editedDetails, setEditedDetails] = useState(postDetails);
  const [editedCategories, setEditedCategories] = useState(categories);

  useEffect(() => {
    setEditedDetails(postDetails);
    setEditedCategories(categories);
  }, [visible, postDetails, categories]);

  const handleSave = () => {
    onSave(editedDetails, editedCategories);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Post</Text>
              <TouchableOpacity onPress={onClose}>
                <FontAwesome name="times" size={24} color="#F9FAFB" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.modalInput}
              value={editedDetails.title}
              onChangeText={(text) => setEditedDetails(prev => ({ ...prev, title: text }))}
              placeholder="Enter title"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.modalInput, styles.descriptionInput]}
              value={editedDetails.description}
              onChangeText={(text) => setEditedDetails(prev => ({ ...prev, description: text }))}
              placeholder="Enter description"
              placeholderTextColor="#9CA3AF"
              multiline
            />

            <Text style={styles.inputLabel}>Categories</Text>
            {editedCategories.map((item, index) => (
              <View key={item.id} style={styles.modalCategoryItem}>
                <Text style={styles.categoryTitle}>{item.category}</Text>
                <View style={styles.weightContainer}>
                  <FontAwesome name="balance-scale" size={16} color="#8B5CF6" />
                  <TextInput
                    style={styles.modalWeightInput}
                    value={item.estimated_weight.toString()}
                    onChangeText={(text) => {
                      const updatedCategories = [...editedCategories];
                      updatedCategories[index] = { ...item, estimated_weight: text };
                      setEditedCategories(updatedCategories);
                    }}
                    keyboardType="numeric"
                    placeholder="Weight"
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.weightUnit}>kg</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const ViewWaste = ({ navigation, route }) => {
  
  const { userData } = useUser();
  const [loading, setloading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousScreen, setPreviousScreen] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableCategories, setEditableCategories] = useState([]);
  const [wasteCategories, setWasteCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [post_details, setpost_details] = useState({
    title: '',
    description: '',
    estimated_weight: '',
    rate: '',
    seller_collector: '',
    seller_collector_id: '',
    address: '',
    date: ''
  });
  const [images, setimage] = useState([]);

  // Fetch waste categories for rate calculation
  const fetchWasteCategories = useCallback(async () => {
    try {
      const record = await pb.collection('waste_category').getFullList({
        sort: '-created',
        fields: 'id,category_name,standardized_price'
      });
      const formattedCategories = record.map(category => ({
        id: category.id,
        name: category.category_name.toUpperCase(),
        standardized_price: category.standardized_price
      }));
      setWasteCategories(formattedCategories);
    } catch (error) {
      console.log("Error fetching categories:", error);
      Toast.show({
        text1: "An Error Occurred.",
        text2: "Check your internet connection",
        type: "error",
        position: "top"
      });
    }
  }, []);

  const calculate_weight = (categories) => {
    let totalweight = 0;
    let category = '';
    const categoryWeightDict = categories.map(item => {
      const matchedCategory = wasteCategories.find(cat => cat.id === item.category_id);
      if (matchedCategory) {
        category = category + ',' + matchedCategory.name;
        totalweight += parseInt(item.estimated_weight);
        const weight = parseInt(item.estimated_weight) * parseInt(matchedCategory.standardized_price);
        return { category: item.category_id, weight };
      }
    });

    if (categoryWeightDict) {
      const totalrate = categoryWeightDict.reduce((acc, curr) => acc + curr.weight, 0);
      category = category.trim();
      return [totalrate, totalweight, category];
    }
    return [0, 0, ''];
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setloading(true);
            try {
              // Delete images
              const imageRecords = await pb.collection('images').getFullList({
                filter: `post_id = "${route.params.id}"`,
              });
              for (const img of imageRecords) {
                await pb.collection('images').delete(img.id);
              }

              // Delete waste categories
              const wasteRecords = await pb.collection('waste').getFullList({
                filter: `post_id = "${route.params.id}"`,
              });
              for (const waste of wasteRecords) {
                await pb.collection('waste').delete(waste.id);
              }

              // Delete post
              await pb.collection('post').delete(route.params.id);

              Toast.show({
                text1: "Post deleted successfully",
                type: "success",
                position: "top"
              });
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting post:", error);
              Toast.show({
                text1: "Error deleting post",
                type: "error",
                position: "top"
              });
            } finally {
              setloading(false);
            }
          }
        }
      ]
    );
  };

  const handleSave = async (editedDetails, editedCategories) => {
    setloading(true);
    try {
      const [totalRate, totalWeight] = calculate_weight(editedCategories);

      // Update waste categories
      for (const category of editedCategories) {
        await pb.collection('waste').update(category.id, {
          estimated_weight: category.estimated_weight
        });
      }

      // Update post
      await pb.collection('post').update(route.params.id, {
        title: editedDetails.title,
        description: editedDetails.description,
        total_weight: totalWeight,
        rate: totalRate
      });

      // Update local state
      setpost_details(editedDetails);
      setEditableCategories(editedCategories);

      Toast.show({
        text1: "Post updated successfully",
        type: "success",
        position: "top"
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error updating post:", error);
      Toast.show({
        text1: "Error updating post",
        type: "error",
        position: "top"
      });
    } finally {
      setloading(false);
    }
  };

  const fetchData = async () => {
    setloading(true);
    try {
      const record = await pb.collection('post').getFirstListItem(`id = "${route.params.id}"`);

      const postData = {
        title: record.title || '',
        description: record.description || '',
        estimated_weight: record.total_weight?.toString() || '',
        rate: record.rate?.toString() || '',
        seller_collector: '',
        seller_collector_id: userData.role == "seller" ? record.collector_id : record.user_id,
        address: '',
        date: record.created
      };

      if (postData.seller_collector_id) {
        try {
          const userRecord = await pb.collection('user').getFirstListItem(`id = "${postData.seller_collector_id}"`);
          postData.seller_collector = userRecord.user_name || '';
          postData.address = userData.role == "seller" ? userData.address : userRecord.address_line;
        } catch (error) {
          postData.seller_collector = "No Collector Yet";
          postData.address = "Address not available";
        }
      }

      setpost_details(postData);

      const imageRecords = await pb.collection('images').getFullList({
        filter: `post_id = "${route.params.id}"`,
        sort: '-created'
      });

      const imageUrls = imageRecords.map(element => ({
        uri: `https://zero.pockethost.io/api/files/emo6y6qor2r1xmu/${element.id}/${element.image}`
      }));
      setimage(imageUrls);

      const wasteRecords = await pb.collection('waste').getFullList({
        filter: `post_id = "${route.params.id}"`,
        sort: '-created'
      });
      
      const categoryRecords = await pb.collection('waste_category').getFullList({
        sort: '-created'
      });

      const categoriesWithNames = wasteRecords.map(waste => {
        const matchingCategory = categoryRecords.find(
          cat => cat.id === waste.category_id
        );
          
        return {
          id: waste.id,
          category_id: waste.category_id,
          category: matchingCategory ? matchingCategory.category_name.toUpperCase() : 'Unknown Category',
          estimated_weight: waste.estimated_weight
        };
      });

      setEditableCategories(categoriesWithNames);
    } catch (error) {
      console.error("Error occurred while fetching data: ", error);
      Toast.show({
        text1: "Error occurred while fetching data.",
        type: "error",
        position: "top"
      });
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchWasteCategories();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const routeNames = navigation.getState().routes;
      const prevRoute = routeNames[routeNames.length - 2];
      setPreviousScreen(prevRoute.name);
    });
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => userData.role === 'seller'
    });
  }, [navigation]);

  const handleBook = (action) => {
    const actions = {
      book: {
        title: 'Book Waste',
        message: 'Would you like to proceed with booking this waste collection?',
        confirmText: 'Book Now',
        screen: 'Recycle Bin',
      },
      collect: {
        title: 'Collect Waste',
        message: 'Ready to collect this waste?',
        confirmText: 'Start Collection',
        screen: 'Jobs'
      },
      drop: {
        title: 'Drop Job',
        message: 'Are you sure you want to drop this job?',
        confirmText: 'Drop Job',
        screen: 'Jobs'
      }
    };

    const selected = actions[action];
    Alert.alert(
      selected.title,
      selected.message,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: selected.confirmText,
          onPress: () => {
            action === "book" ? bookbutton() : action === "collect" ? collectbutton() : dropbutton();
            navigation.navigate(selected.screen)},
          style: 'default'
        }
      ]
    );
  };

  const CarouselItem = ({ item, index, animationValue }) => {
    const imageAnimationStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.9, 1, 0.9]
      );
      const opacity = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.75, 1, 0.75]
      );
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View style={[styles.imageSlide, imageAnimationStyle]}>
        <Image 
          source={{ uri: item.uri }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </Animated.View>
    );
  };

  const editButton = (
    <TouchableOpacity
      style={styles.editButton}
      onPress={() => setIsModalVisible(true)}
    >
      <FontAwesome name="edit" size={20} color="#F9FAFB" />
      <Text style={styles.editButtonText}>Edit Post</Text>
    </TouchableOpacity>
  );

  const InfoItem = ({ icon, label, value, onPress }) => {
    const isCollectorAvailable = post_details.seller_collector !== "No Collector Yet"; 
  
    return (
      <TouchableOpacity
        style={styles.infoItem}
        onPress={isCollectorAvailable && onPress}  
        disabled={!isCollectorAvailable || !onPress}  
      >
        <FontAwesome name={icon} size={20} color="#8B5CF6" style={styles.infoIcon} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={[styles.infoValue, value !== "No Collector Yet" && onPress && styles.linkValue]}>
            {value}
          </Text>
        </View>
        {onPress && isCollectorAvailable && <FontAwesome name="chevron-right" size={16} color="#8B5CF6" />}
      </TouchableOpacity>
    );
  };

  const PaginationDot = ({ index, activeIndex }) => (
    <View
      style={[
        styles.paginationDot,
        { backgroundColor: activeIndex === index ? '#8B5CF6' : '#4B5563' }
      ]}
    />
  );

  const bookbutton = async () => {

    const data = {
      "collector_id":userData.id,
      "status":"Processing"
    };
    try {
      await pb.collection('post').update(route.params.id, data);
      Toast.show({ text1: "Successfully Booked.", type: "success", position: "top" });
    } catch (error) {
      console.log("Error Occured: ",error.data)
      Toast.show({ text1: "An Error Occured.",text2:"Error occured while trying to book. Please try again", type: "error", position: "top" });
    }
 
  }

  const collectbutton = async () => {

    const data = {
      "status":"Collected"
    };
    try {
      await pb.collection('post').update(route.params.id, data);
      Toast.show({ text1: "Successfully Completed Job.", type: "success", position: "top" });
    } catch (error) {
      console.log("Error Occured: ",error.data)
      Toast.show({ text1: "An Error Occured.",text2:"Error occured while trying to book. Please try again", type: "error", position: "top" });
    }
 
  }

  const dropbutton = async () => {

    const data = {
      "status":"Pending",
      "collector_id":""
    };
    try {
      await pb.collection('post').update(route.params.id, data);
      Toast.show({ text1: "Dropped Job.", type: "info", position: "top" });
    } catch (error) {
      console.log("Error Occured: ",error.data)
      Toast.show({ text1: "An Error Occured.",text2:"Error occured while trying to book. Please try again", type: "error", position: "top" });
    }
 
  }

  return (
    <View style={styles.container}>
      <EditModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        postDetails={post_details}
        categories={editableCategories}
        onSave={handleSave}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <Carousel
                loop
                width={width}
                height={300}
                data={images}
                onSnapToItem={setCurrentIndex}
                renderItem={({ item, index, animationValue }) => (
                  <CarouselItem 
                    item={item} 
                    index={index} 
                    animationValue={animationValue}
                  />
                )}
                panGestureHandlerProps={{
                  activeOffsetX: [-10, 10],
                }}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxScrollingOffset: 50,
                }}
              />
              <View style={styles.paginationContainer}>
                {images.map((_, index) => (
                  <PaginationDot 
                    key={index} 
                    index={index} 
                    activeIndex={currentIndex}
                  />
                ))}
              </View>
            </View>

            <View style={styles.contentContainer}>
            {userData.role === 'seller' && (
              <View style={styles.editButtonContainer}>
                {editButton}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <FontAwesome name="trash" size={20} color="#F9FAFB" />
                  <Text style={styles.editButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}

              {isEditMode ? (
                <TextInput
                  style={styles.editInput}
                  value={post_details.title}
                  onChangeText={(text) => setpost_details(prev => ({ ...prev, title: text }))}
                  placeholder="Enter title"
                  placeholderTextColor="#9CA3AF"
                />
              ) : (
                <Text style={styles.title}>{post_details.title}</Text>
              )}

              {isEditMode ? (
                <TextInput
                  style={[styles.editInput, styles.descriptionInput]}
                  value={post_details.description}
                  onChangeText={(text) => setpost_details(prev => ({ ...prev, description: text }))}
                  placeholder="Enter description"
                  placeholderTextColor="#9CA3AF"
                  multiline
                />
              ) : (
                <Text style={styles.description}>{post_details.description}</Text>
              )}

              <View style={styles.card}>
                <InfoItem 
                  icon="balance-scale"
                  label="Estimated Weight"
                  value={post_details.estimated_weight}
                />
                <InfoItem 
                  icon="rupee"
                  label="Rate"
                  value={"₹"+post_details.rate}
                />
                <InfoItem 
                  icon="user"
                  label={userData.role === 'seller' ? 'Collector' : 'Seller'}
                  value={post_details.seller_collector}
                  onPress={() => navigation.navigate('Profile', { profileid: post_details.seller_collector_id })}
                />
                <InfoItem 
                  icon="map-marker"
                  label="Address"
                  value={post_details.address}
                />
                <InfoItem 
                  icon="calendar"
                  label="Date"
                  value={post_details.date}
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Categories</Text>
                {editableCategories.map((item) => (
                  <View key={item.id} style={styles.categoryItem}>
                    <Text style={styles.categoryTitle}>{item.category}</Text>
                    <View style={styles.weightContainer}>
                      <FontAwesome name="balance-scale" size={16} color="#8B5CF6" />
                      {isEditMode ? (
                        <TextInput
                          style={styles.weightInput}
                          value={item.estimated_weight.toString()}
                          onChangeText={(text) => {
                            const updatedCategories = editableCategories.map(cat => 
                              cat.id === item.id ? { ...cat, estimated_weight: text } : cat
                            );
                            setEditableCategories(updatedCategories);
                          }}
                          keyboardType="numeric"
                          placeholder="Weight"
                          placeholderTextColor="#9CA3AF"
                        />
                      ) : (
                        <Text style={styles.weightText}>{item.estimated_weight} kg</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {isEditMode ? (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          ) : (
            userData.role !== 'seller' && (
              previousScreen === 'Recycle Bin' ? (
                <TouchableOpacity 
                  onPress={() => handleBook('book')} 
                  style={styles.bookButton}
                >
                  <Text style={styles.buttonText}>Book Now</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    onPress={() => handleBook('collect')} 
                    style={[styles.actionButton, styles.collectButton]}
                    >
                    <Text style={styles.buttonText}>Collect</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleBook('drop')} 
                    style={[styles.actionButton, styles.dropButton]}
                  >
                    <Text style={styles.buttonText}>Drop Job</Text>
                  </TouchableOpacity>
                </View>
              )
            )
          )}
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#111827',
  },
  imageSlide: {
    width: width,
    height: 300,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  contentContainer: {
    padding: 16,
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: 'white',
    marginBottom: 16,
    paddingLeft: 20,
  },
  editInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#F9FAFB',
    fontSize: 16,
    marginBottom: 16,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  weightInput: {
    backgroundColor: '#4B5563',
    borderRadius: 4,
    padding: 4,
    color: '#F9FAFB',
    fontSize: 14,
    marginLeft: 8,
    width: 80,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#F9FAFB',
  },
  linkValue: {
    color: '#8B5CF6',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  categoryItem: {
    backgroundColor: '#4B5563',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightText: {
    fontSize: 14,
    color: '#8B5CF6',
    marginLeft: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    backgroundColor: '#8B5CF6',
    paddingBottom: 25,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#10B981',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 12,
  },
  collectButton: {
    backgroundColor: '#10B981',
    borderTopLeftRadius: 12,
  },
  dropButton: {
    backgroundColor: '#EF4444',
    borderTopRightRadius: 12,
  },
  buttonText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    marginRight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  loadingText: {
    color: '#F9FAFB',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  modalInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#F9FAFB',
    fontSize: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  modalCategoryItem: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modalWeightInput: {
    backgroundColor: '#4B5563',
    borderRadius: 4,
    padding: 4,
    color: '#F9FAFB',
    fontSize: 14,
    marginLeft: 8,
    width: 80,
    textAlign: 'center',
  },
  weightUnit: {
    color: '#9CA3AF',
    marginLeft: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#4B5563',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
  }
});