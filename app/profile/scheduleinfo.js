import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, SafeAreaView, TouchableOpacity, Alert, Modal,
        ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PocketBase from 'pocketbase';
import Toast from 'react-native-toast-message';
import { useUser } from '../storage';
import { Picker } from '@react-native-picker/picker';

import background from '../../assets/profile/profile2.jpg';

const { width, height } = Dimensions.get('window');
const pb = new PocketBase('https://zero.pockethost.io');

// EditModal Component
const EditModal = ({ visible, onClose, onSave, initialData, wasteCategories, isSaving }) => {
  const [editedData, setEditedData] = useState(initialData);
  
  useEffect(() => {
    setEditedData(initialData);
  }, [initialData]);

  const handleCategoryToggle = (categoryName) => {
    setEditedData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryName)
        ? prev.selectedCategories.filter(cat => cat !== categoryName)
        : [...prev.selectedCategories, categoryName]
    }));
  };

  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Edit Schedule</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={editedData.title}
                onChangeText={(text) => setEditedData(prev => ({ ...prev, title: text }))}
                placeholder="Enter title"
                placeholderTextColor="#666666"
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedData.description}
                onChangeText={(text) => setEditedData(prev => ({ ...prev, description: text }))}
                placeholder="Enter description"
                placeholderTextColor="#666666"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Pickup Interval */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Pickup Interval (Days)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedData.day_count.toString()}
                  onValueChange={(itemValue) => 
                    setEditedData(prev => ({ ...prev, day_count: parseInt(itemValue) }))
                  }
                  style={styles.picker}
                  dropdownIconColor="#FFFFFF"
                >
                  {[2,3,4,5,6,7,8].map((num) => (
                    <Picker.Item 
                      key={num} 
                      label={`${num} days`} 
                      value={num.toString()}
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Waste Categories */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Waste Categories</Text>
              <View style={styles.categoriesContainer}>
                {wasteCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      editedData.selectedCategories.includes(category.name) && styles.selectedCategoryChip
                    ]}
                    onPress={() => handleCategoryToggle(category.name)}
                  >
                    <FontAwesome
                      name={editedData.selectedCategories.includes(category.name) ? "check-circle" : "circle-o"}
                      size={16}
                      color={editedData.selectedCategories.includes(category.name) ? "#4CAF50" : "#666666"}
                      style={styles.categoryIcon}
                    />
                    <Text style={[
                      styles.categoryText,
                      editedData.selectedCategories.includes(category.name) && styles.selectedCategoryText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={() => onSave(editedData)}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export const Schedule = ({ navigation }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  // Start with loading true
  const { userData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [wasteCategories, setWasteCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  //Fetching the subscription data
  const fetchData = async () => {
    try {
      const subscriptions = await pb.collection('subscription').getFirstListItem(`subscriber_id="${userData.id}"`);
      
      if (subscriptions) {
        let category = subscriptions.waste_categories.trim().split(',');
    
        const lastPickup = new Date(subscriptions.last_pickup);
        const nextPickup = new Date(lastPickup);
        nextPickup.setDate(nextPickup.getDate() + parseInt(subscriptions.day_count));
    
        //Setting custom date format
        const formatDate = (date) => {
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        };
    
        //Adding all the info from the subscription table to a dictionary and storing it in a state variable
        const scheduleInfo = {
          id: subscriptions.id,
          title: subscriptions.title,
          description: subscriptions.description,
          day_count: subscriptions.day_count,
          lastPickup: formatDate(lastPickup),
          nextPickup: formatDate(nextPickup),
          created: formatDate(new Date(subscriptions.created)),
          updated: formatDate(new Date(subscriptions.updated)),
          waste: category,
          uploadDate: formatDate(new Date(subscriptions.created))
        };
    
        setScheduleData(scheduleInfo);
      }
    } catch (error) {
      console.error('Subscriber is not found:', error);
      setScheduleData(null);
    } finally {
      setIsLoading(false);  // Always set loading to false after fetch completes
    }
  };

  // Call fetchData when component mounts
  useEffect(() => {
    fetchData();
    fetchWasteCategories();
  }, []);

  //Fetching waste categories to show it on the model
  const fetchWasteCategories = useCallback(async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  //If edit mode is on then only fetch waste categories
  useEffect(() => {
    if (isEditing) {
      fetchWasteCategories();
    }
  }, [isEditing, fetchWasteCategories]);

  //When edit button is clicked then make model visible
  const handleEdit = () => {
    if (scheduleData) {
      const initialModalData = {
        title: scheduleData.title,
        description: scheduleData.description,
        day_count: scheduleData.day_count,
        selectedCategories: scheduleData.waste || []
      };
      setModalVisible(true);
    }
  };

  //When clicked on the save button handle the save to the database and do validation
  const handleSave = async (editedData) => {
    // Validation checks
    if (!editedData.title.trim() || !editedData.description.trim() || !editedData.day_count || editedData.selectedCategories.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields and select at least one category',
        position: 'top',
      });
      return;
    }
  
    // Check title length (max 25 characters)
    if (editedData.title.trim().length > 25) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Title cannot be longer than 25 characters',
        position: 'top',
      });
      return;
    }
  
    // Check description length (max 150 characters)
    if (editedData.description.trim().length > 150) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Description cannot be longer than 150 characters',
        position: 'top',
      });
      return;
    }
  
    setIsSaving(true);
    try {
      const data = {
        title: editedData.title.trim(),
        description: editedData.description.trim(),
        day_count: parseInt(editedData.day_count),
        waste_categories: editedData.selectedCategories.join(','),
        updated: new Date().toISOString(),
      };
  
      await pb.collection('subscription').update(scheduleData.id, data);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Schedule updated successfully',
        position: 'top',
      });
      
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Update error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update schedule',
        position: 'top',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  //When pressed on the delete button
  const handleDelete = async () => {
    try {
      Alert.alert(
        "Delete Schedule",
        "Are you sure you want to delete this schedule?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await pb.collection('subscription').delete(scheduleData.id);
                Toast.show({
                  type: 'info',
                  text1: 'Schedule Deleted',
                  position: 'top',
                  visibilityTime: 3000
                })
                setIsDeleted(true);
                navigation.navigate('BaseProfile');
              } catch (error) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: "Failed to delete schedule. Please try again.",
                  position: 'top',
                  visibilityTime: 3000
                });
                console.error('Delete error:', error);
              }
            }
          }
        ]
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: "Failed to delete schedule. Please try again.",
        position: 'top',
        visibilityTime: 3000
      });
      console.error('Delete error:', error);
    }
  };

  //When pressed on the add schedule button
  const handleAdd = () => {
    navigation.navigate('Schedule Pickup');
  };

  if (isLoading) {
    return (
      <ImageBackground source={background} style={styles.background} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']} style={styles.gradientOverlay} />
        <SafeAreaView style={styles.container}>
          <BlurView intensity={90} tint="dark" style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading schedule...</Text>
          </BlurView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (isDeleted || (!isLoading && !scheduleData)) {
    return (
      <ImageBackground source={background} style={styles.background} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']} style={styles.gradientOverlay} />
        <SafeAreaView style={styles.container}>
          <BlurView intensity={90} tint="dark" style={styles.emptyStateContainer}>
            <FontAwesome name="calendar-plus-o" size={48} color="#4CAF50" style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateText}>No active schedule found</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <FontAwesome name="plus" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Create New Schedule</Text>
            </TouchableOpacity>
          </BlurView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={background} style={styles.background} resizeMode="cover">
      <LinearGradient colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']} style={styles.gradientOverlay} />
      <SafeAreaView style={styles.container}>
        <BlurView intensity={90} tint="dark" style={styles.content}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.mainCard}>
              {/* Header Section */}
              <View style={styles.headerSection}>
                <View style={styles.titleContainer}>
                  <FontAwesome name="calendar" size={28} color="#4CAF50" style={styles.headerIcon} />
                  <Text style={styles.mainTitle}>{scheduleData.title}</Text>
                </View>
              </View>

              <View style={styles.scheduleInfoCard}>
                <View style={styles.scheduleInfoRow}>
                  <View style={styles.infoItem}>
                    <FontAwesome name="clock-o" size={16} color="#4CAF50" />
                    <Text style={styles.infoLabel}>Created</Text>
                    <Text style={styles.infoValue}>{scheduleData.created}</Text>
                  </View>
                  <View style={styles.infoSeparator} />
                  <View style={styles.infoItem}>
                    <FontAwesome name="refresh" size={16} color="#4CAF50" />
                    <Text style={styles.infoLabel}>Last Updated</Text>
                    <Text style={styles.infoValue}>{scheduleData.updated}</Text>
                  </View>
                </View>
              </View>

              {/* Description Card */}
              <View style={styles.descriptionCard}>
                <Text style={styles.sectionTitle}>About This Schedule</Text>
                <Text style={styles.description}>{scheduleData.description}</Text>
              </View>

              {/* Pickup Timeline */}
              <View style={styles.timelineSection}>
                <Text style={styles.sectionTitle}>Pickup Schedule</Text>
                <View style={styles.timelineCards}>
                  <View style={[styles.timelineCard, styles.lastPickupCard]}>
                    <FontAwesome name="calendar-check-o" size={24} color="#4CAF50" />
                    <Text style={styles.timelineLabel}>Last Pickup</Text>
                    <Text style={styles.timelineDate}>{scheduleData.lastPickup}</Text>
                  </View>
                  <View style={styles.timelineConnector}>
                    <FontAwesome name="long-arrow-right" size={24} color="#4CAF50" />
                  </View>
                  <View style={[styles.timelineCard, styles.nextPickupCard]}>
                    <FontAwesome name="calendar" size={24} color="#4CAF50" />
                    <Text style={styles.timelineLabel}>Next Pickup</Text>
                    <Text style={styles.timelineDate}>{scheduleData.nextPickup}</Text>
                  </View>
                </View>
              </View>

              {/* Interval Info */}
              <View style={styles.intervalCard}>
                <FontAwesome name="refresh" size={24} color="#4CAF50" />
                <Text style={styles.intervalTitle}>Pickup Interval</Text>
                <Text style={styles.intervalValue}>{scheduleData.day_count} Days</Text>
              </View>

              {/* Waste Categories */}
              <View style={styles.categoriesSection}>
                <Text style={styles.sectionTitle}>Waste Categories</Text>
                <View style={styles.categoriesGrid}>
                  {scheduleData.waste.map((category, index) => (
                    <View key={index} style={styles.categoryBadge}>
                      <FontAwesome name="trash" size={16} color="#4CAF50" style={styles.categoryIcon} />
                      <Text style={styles.categoryText}>{category}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={handleEdit}
                >
                  <FontAwesome name="edit" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Edit Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <FontAwesome name="trash" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Delete Schedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {modalVisible && (
            <EditModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSave={handleSave}
              initialData={{
                title: scheduleData?.title,
                description: scheduleData?.description,
                day_count: scheduleData?.day_count,
                selectedCategories: scheduleData?.waste || []
              }}
              wasteCategories={wasteCategories}
              isSaving={isSaving}
            />
          )}
        </BlurView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerSection: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    marginRight: 12,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  dateInfo: {
    marginLeft: 40,
  },
  dateText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  descriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  timelineSection: {
    marginBottom: 24,
  },
  timelineCards: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  timelineConnector: {
    paddingHorizontal: 16,
  },
  timelineLabel: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
  timelineDate: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  intervalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  intervalTitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
  intervalValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 8,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: 24,
    padding: 24,
  },
  modalScroll: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
  },
  pickerItem: {
    color: '#FFFFFF',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 8,
  },
  selectedCategoryChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  categoryChipText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 8,
  },
  selectedCategoryChipText: {
    color: '#4CAF50',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 24,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  scheduleInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  infoSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
  modalScrollView: {
    padding: 20,
    maxHeight: height * 0.5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    color: '#FFFFFF',
    backgroundColor: '#1E1E1E',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
});