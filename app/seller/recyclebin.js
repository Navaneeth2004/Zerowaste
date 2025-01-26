import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useUser } from '../storage';

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

export const RecycleBin = ({ navigation }) => {
  const { userData } = useUser();
  const [filteredWasteItems, setFilteredWasteItems] = useState([]);
  const [subscriptionItems, setSubscriptionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wasteItems, setWasteItems] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    category: '',
    minWeight: '',
    maxWeight: '',
    minRate: '',
    maxRate: '',
  });

  // Fetch both regular waste items and subscriptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        let wasteRecords = [];
        if (userData.role === "seller") {
          wasteRecords = await pb.collection('post').getFullList(200, { 
            filter: `user_id="${userData.id}"` 
          });
        } else {
          wasteRecords = await pb.collection('post').getFullList({
            filter: 'status="Pending"',
          });
        }
        setWasteItems(wasteRecords);

        // Fetch subscription items
        const subscriptionRecords = await pb.collection('subscription').getFullList({
          filter: userData.role === "seller" ? 
            `subscriber_id="${userData.id}" && status="Active"` : 
            'status="Active"',
        });
        setSubscriptionItems(subscriptionRecords);
      } catch (error) {
        console.log("Error occurred while fetching data: ", error);
        Toast.show({ 
          text1: "An Error Occurred",
          text2: "Check your internet connection", 
          type: "error", 
          position: "top" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData.id, userData.role]);

   // Filter waste items
   useEffect(() => {
    if (!wasteItems) return;

    const filtered = wasteItems.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) ||
        (item.category?.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = !filterCriteria.category || 
        item.category?.includes(filterCriteria.category);

      const matchesWeight = 
        (!filterCriteria.minWeight || item.total_weight >= parseFloat(filterCriteria.minWeight)) &&
        (!filterCriteria.maxWeight || item.total_weight <= parseFloat(filterCriteria.maxWeight));

      const matchesRate = 
        (!filterCriteria.minRate || item.rate >= parseFloat(filterCriteria.minRate)) &&
        (!filterCriteria.maxRate || item.rate <= parseFloat(filterCriteria.maxRate));

      return matchesSearch && matchesCategory && matchesWeight && matchesRate;
    });

    setFilteredWasteItems(filtered);
  }, [wasteItems, search, filterCriteria]);

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearch}
          placeholder="Search waste items..."
          placeholderTextColor="#6B7280"
          value={search}
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          style={styles.filterGradient}
        >
          <FontAwesome name="filter" size={20} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderSubscriptionItem = (item) => {
    const categories = item.waste_categories.split(',').filter(Boolean);
    const daysUntilPickup = Math.ceil((new Date(item.subscription_end_date) - new Date()) / (1000 * 60 * 60 * 24));
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.itemCard, styles.subscriptionCard]}
        onPress={() => navigation.navigate('Subscription Details', {type:"subscription", id: item.id })}
      >
        <Image 
          source={{ uri: `https://zero.pockethost.io/api/files/emo6y6qor2r1xmu/${item.image_id}/${item.image}` }}
          style={styles.itemImage}
        />
        <LinearGradient
          colors={['rgba(218,165,32,0)', 'rgba(218,165,32,0.25)']}
          style={styles.imageOverlay}
        >
          <View style={styles.categoriesContainer}>
            {categories.map((category, idx) => (
              <View key={idx} style={[styles.categoryBadge, styles.subscriptionCategoryBadge]}>
                <Text style={styles.categoryText}>{category.trim()}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
        <View style={styles.itemContent}>
          <Text style={[styles.itemName, styles.subscriptionItemName]}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <View style={styles.itemStats}>
            <View style={styles.statItem}>
              <FontAwesome name="clock-o" size={15} color="#FFD700" />
            <View style={styles.subscriptionBadge}>
              <FontAwesome name="calendar" size={12} color="#FFD700" />
              <Text style={styles.subscriptionText}>Subscription</Text>
            </View>
            </View>
            <View style={styles.statItem}>
              <FontAwesome name="calendar-check-o" size={15} color="#FFD700" />
              <Text style={[styles.statText, styles.subscriptionStatText]}>
                Every {item.day_count} days
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderWasteItem = (item, index) => {

    const categories = item.category.split(',').filter(Boolean);
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.itemCard,
          index === 0 && userData.role === "seller" ? { marginTop: 50 } : null
        ]}
        onPress={() => navigation.navigate('Waste Details', {type:"normal", id: item.id })}
      >
        <Image 
          source={{ uri: `https://zero.pockethost.io/api/files/emo6y6qor2r1xmu/${item.image_id}/${item.image}` }}
          style={styles.itemImage}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          style={styles.imageOverlay}
        >
          <View style={styles.categoriesContainer}>
            {categories.map((category, idx) => (
              <View key={idx} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category.trim()}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <View style={styles.itemStats}>
            <View style={styles.statItem}>
              <FontAwesome name="balance-scale" size={15} color="#3B82F6" />
              <Text style={styles.statText}>{item.total_weight}kg   </Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome name="rupee" size={16} color="#3B82F6" />
              <Text style={styles.statText}>
                {typeof item.rate === 'number' ? item.rate.toFixed(2) : '0.00'}/kg
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#1F2937']}
        style={styles.gradient}
      >
        {userData.role !== 'seller' && renderSearchBar()}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        )}

        {!loading && (
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Render Subscription Items First */}
            {subscriptionItems.length > 0 && (
              <View style={styles.subscriptionSection}>
                {subscriptionItems.map(item => renderSubscriptionItem(item))}
              </View>
            )}

            {/* Render Regular Waste Items */}
            {filteredWasteItems.length > 0 ? (
              <View style={styles.itemsGrid}>
                {filteredWasteItems.map((item, index) => renderWasteItem(item, index))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <FontAwesome name="recycle" size={60} color="#3B82F6" />
                <Text style={styles.emptyText}>No items found</Text>
              </View>
            )}
          </ScrollView>
        )}

        {userData.role == 'seller'&& !loading &&(
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('Create Post')}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.fabGradient}
            >
              <FontAwesome name="plus" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <FontAwesome name="recycle" size={24} color="#3B82F6" />
            <Text style={[styles.navText, styles.activeNavText]}>Recycle</Text>
          </TouchableOpacity>
          {
          userData.role!="seller"?
            <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Jobs')}
            >
              <FontAwesome name="clipboard" size={24} color="#6B7280" />
              <Text style={styles.navText}>Jobs</Text>
            </TouchableOpacity>
          :
          null
          }
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Shop')}
          >
            <FontAwesome name="shopping-cart" size={24} color="#6B7280" />
            <Text style={styles.navText}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('BaseProfile')}
          >
            <FontAwesome name="user-circle" size={24} color="#6B7280" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter Items</Text>
              <View style={styles.modalForm}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Category</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedCategory}
                      onValueChange={setSelectedCategory}
                      style={styles.picker}
                      dropdownIconColor="#3B82F6"
                    >
                      <Picker.Item label="Select Category" value="" />
                      <Picker.Item label="Plastic" value="Plastic" />
                      <Picker.Item label="Paper" value="Paper" />
                      <Picker.Item label="Metal" value="Metal" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Min Weight (kg)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={filterCriteria.minWeight}
                      onChangeText={(text) => setFilterCriteria({ ...filterCriteria, minWeight: text })}
                      keyboardType="numeric"
                      placeholder="0.0"
                      placeholderTextColor="#6B7280"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Max Weight (kg)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={filterCriteria.maxWeight}
                      onChangeText={(text) => setFilterCriteria({ ...filterCriteria, maxWeight: text })}
                      keyboardType="numeric"
                      placeholder="99.9"
                      placeholderTextColor="#6B7280"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Min Rate ($/kg)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={filterCriteria.minRate}
                      onChangeText={(text) => setFilterCriteria({ ...filterCriteria, minRate: text })}
                      keyboardType="numeric"
                      placeholder="0.0"
                      placeholderTextColor="#6B7280"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Max Rate ($/kg)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={filterCriteria.maxRate}
                      onChangeText={(text) => setFilterCriteria({ ...filterCriteria, maxRate: text })}
                      keyboardType="numeric"
                      placeholder="99.9"
                      placeholderTextColor="#6B7280"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.secondaryButton]}
                  onPress={() => {
                    setFilterCriteria({
                      category: '',
                      minWeight: '',
                      maxWeight: '',
                      minRate: '',
                      maxRate: '',
                    });
                    setSelectedCategory('');
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={() => {
                    setFilterCriteria({ ...filterCriteria, category: selectedCategory });
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.primaryButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome name="times" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop:50,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#F3F4F6',
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  filterGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  itemCard: {
    width: "100%",
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'flex-start',
    padding: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)', 
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  itemContent: {
    padding: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F4F6',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  itemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 85, 99, 0.3)',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#3B82F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F3F4F6',
    marginBottom: 24,
  },
  modalForm: {
    gap: 20,
  },
  formGroup: {
    flex: 1,
    gap: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  formLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  modalInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
    color: '#F3F4F6',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
  },
  pickerContainer: {
    backgroundColor: '#374151',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
    overflow: 'hidden',
  },
  picker: {
    color: '#F3F4F6',
    height: 48,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryButton: {
    backgroundColor: '#374151',
  },
  primaryButtonText: {
    color: '#F3F4F6',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '600',
  },
  modalClose: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  subscriptionSection: {
    gap: 16,
    marginTop:35
  },
  subscriptionCard: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(218,165,32,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  subscriptionText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  subscriptionCategoryBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
  },
  subscriptionItemName: {
    color: '#FFD700',
  },
  subscriptionStatText: {
    color: '#FFD700',
  },
});