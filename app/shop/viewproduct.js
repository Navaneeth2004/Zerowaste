import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '../storage';
import Toast from 'react-native-toast-message';

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

export const ViewProduct = ({ navigation }) => {

  const { userData } = useUser();

    const [search, setSearch] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
    });
    const [productDict, setproductDict] = useState({
        name: '',
        category: '',
        price: 0,
        minRating: '',
        lastImageUrl:'',
        stockQuantity:0,
        description:'',
        rating:0
    });

    useEffect(() => {
        fetchProducts();
      }, []);
    
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const resultList = await pb.collection('product').getList(1, 50);
          const products = {};
          
          for (const product of resultList.items) {
            products[product.id] = {
              name: product.product_name,
              category: product.category_id,
              price: product.price,
              lastImageUrl: product.image_url,
              stockQuantity: product.stock_quantity,
              description: product.description,
              rating: product.average_rating,
            };
          }
          
          setproductDict(products);
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Error fetching products',
            position: 'top',
            visibilityTime: 3000,
          });
          console.error('Error fetching products:', error);
        } finally {
          setIsLoading(false);
        }
      };

    const filteredProducts = Object.entries(productDict || {}).filter(([id, item]) => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
                            item.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCriteria.category ? item.category === filterCriteria.category : true;
    const matchesPrice = (filterCriteria.minPrice ? item.price >= parseFloat(filterCriteria.minPrice) : true) &&
                            (filterCriteria.maxPrice ? item.price <= parseFloat(filterCriteria.maxPrice) : true);
    const matchesRating = (filterCriteria.minRating ? item.rating >= parseFloat(filterCriteria.minRating) : true);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;

    });

  const filterProduct = () => {
    setModalVisible(true);
  };

  const applyFilter = () => {
    setFilterCriteria({ ...filterCriteria, category: selectedCategory });
    setModalVisible(false);
  };

  const resetFilters = () => {
    setFilterCriteria({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
    });
    setSearch('');
  };

  return (
    <View style={styles.container}>
        <LinearGradient
            colors={['#161925', '#23395d']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <FontAwesome name='search' size={18} color="#8EBBFF" />
                        <TextInput
                            style={styles.searchInput}
                            onChangeText={setSearch}
                            placeholder='Search products...'
                            placeholderTextColor="#566583"
                        />
                        <TouchableOpacity style={styles.filterButton} onPress={filterProduct}>
                            <FontAwesome name='sliders' size={18} color="#8EBBFF" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={()=>navigation.navigate('Cart')}>
                        <FontAwesome name='shopping-cart' size={18} color="#8EBBFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#8EBBFF" />
                        <Text style={styles.loadingText}>Loading products...</Text>
                    </View>
                ) : (
                    <View style={styles.gridContainer}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(([id, item]) => (
                                <TouchableOpacity 
                                    key={id} 
                                    style={styles.productCard}
                                    onPress={() => navigation.navigate('Product',{ id: id })}
                                >
                                    <Image source={{ uri: item.lastImageUrl }} style={styles.productImage} />
                                    <View style={styles.productContent}>
                                        <View style={styles.productHeader}>
                                            <Text style={styles.productName}>{item.name}</Text>
                                            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                                        </View>
                                        <Text style={styles.productCategory}>{item.category}</Text>
                                        <Text style={styles.productDescription} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                        <View style={styles.productFooter}>
                                            <View style={styles.ratingContainer}>
                                                <FontAwesome name="star" size={12} color="#8EBBFF" />
                                                <Text style={styles.ratingText}>{item.rating}</Text>
                                            </View>
                                            <Text style={styles.stockText}>
                                                {item.stockQuantity} left
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <FontAwesome name="search" size={40} color="#8EBBFF" />
                                <Text style={styles.emptyText}>No products found</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity 
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Recycle Bin')}
                >
                    <FontAwesome name="recycle" size={24} color="#6B7280" />
                    <Text style={styles.navText}>Recycle</Text>
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
                : null
                }
                <TouchableOpacity 
                    style={styles.navItem}
                >
                    <FontAwesome name="shopping-cart" size={24} color="#3B82F6" />
                    <Text style={[styles.navText,styles.activeNavText]}>Shop</Text>
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
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <TouchableOpacity 
                                style={styles.closeButton} 
                                onPress={() => setModalVisible(false)}
                            >
                                <FontAwesome name="times" size={20} color="#566583" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Category</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    style={styles.picker}
                                    dropdownIconColor="#8EBBFF"
                                >
                                    <Picker.Item label="All Categories" value="" />
                                    <Picker.Item label="Accessories" value="Accessories" />
                                    <Picker.Item label="Appliances" value="Appliances" />
                                    <Picker.Item label="Furniture" value="Furniture" />
                                    <Picker.Item label="Stationery" value="Stationery" />
                                </Picker>
                            </View>

                            <Text style={styles.filterLabel}>Price Range</Text>
                            <View style={styles.rangeInputs}>
                                <TextInput
                                    style={[styles.filterInput, styles.halfInput]}
                                    placeholder="Min"
                                    placeholderTextColor="#566583"
                                    keyboardType="numeric"
                                    onChangeText={(text) => setFilterCriteria({ ...filterCriteria, minPrice: text })}
                                />
                                <TextInput
                                    style={[styles.filterInput, styles.halfInput]}
                                    placeholder="Max"
                                    placeholderTextColor="#566583"
                                    keyboardType="numeric"
                                    onChangeText={(text) => setFilterCriteria({ ...filterCriteria, maxPrice: text })}
                                />
                            </View>

                            <Text style={styles.filterLabel}>Minimum Rating</Text>
                            <TextInput
                                style={styles.filterInput}
                                placeholder="Enter minimum rating"
                                placeholderTextColor="#566583"
                                keyboardType="numeric"
                                onChangeText={(text) => setFilterCriteria({ ...filterCriteria, minRating: text })}
                            />
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.resetButton]} 
                                onPress={resetFilters}
                            >
                                <Text style={styles.resetButtonText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.applyButton]} 
                                onPress={applyFilter}
                            >
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    </View>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#161925',
},
gradient: {
    flex: 1,
},
header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
},
searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
},
searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 46,
    gap: 12,
},
searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
},
filterButton: {
    width: 46,
    height: 46,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
},
scrollContainer: {
    padding: 16,
},
gridContainer: {
    gap: 16,
    paddingBottom: 100,
},
productCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    overflow: 'hidden',
},
productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
},
productContent: {
    padding: 16,
    gap: 8,
},
productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
},
productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
},
productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8EBBFF',
    marginLeft: 8,
},
productCategory: {
    fontSize: 14,
    color: '#566583',
},
productDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
},
productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
},
ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
},
ratingText: {
    color: '#8EBBFF',
    fontSize: 14,
    fontWeight: '500',
},
stockText: {
    color: '#566583',
    fontSize: 14,
},
emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 16,
},
emptyText: {
    color: '#566583',
    fontSize: 16,
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
centerButton: {
    marginBottom: 20,
},
gradientButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
},
modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(22, 25, 37, 0.9)',
    justifyContent: 'flex-end',
},
modalContent: {
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
},
modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
},
modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
},
closeButton: {
    padding: 8,
},
filterSection: {
    gap: 16,
},
filterLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
},
pickerContainer: {
    backgroundColor: '#161925',
    borderRadius: 12,
    marginBottom: 8,
},
picker: {
    color: '#fff',
},
rangeInputs: {
    flexDirection: 'row',
    gap: 12,
},
filterInput: {
    backgroundColor: '#161925',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 16,
},
halfInput: {
    flex: 1,
},
modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
},
modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
},
resetButton: {
    backgroundColor: '#161925',
},
resetButtonText: {
    color: '#566583',
    fontSize: 16,
    fontWeight: '600',
},
applyButton: {
    backgroundColor: '#8EBBFF',
},
applyButtonText: {
    color: '#161925',
    fontSize: 16,
    fontWeight: '600',
},
bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom:20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
},
tabButton: {
    alignItems: 'center',
    opacity: 0.8,
},
loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    gap: 16,
},
  loadingText: {
    color: '#8EBBFF',
    fontSize: 16,
    fontWeight: '500',
},
});
