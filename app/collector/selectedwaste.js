import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useUser } from '../storage';

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

export const SelectedWaste = ({ navigation }) => {
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [wasteItems, setWasteItems] = useState([]);

  useEffect(() => {
    
    pb.collection('post').getFullList(200, {
      filter: `collector_id ?~ "${userData.id}" && status != "Collected"`
    })
      .then((records) => {
        console.log("Filtered records:", records);
        setWasteItems(records);
      })
      .catch((error) => {
        console.log("Error occurred while fetching post details: ", error.data);
        Toast.show({ 
          text1: "An Error Occurred.", 
          text2: "Check your internet connection", 
          type: "error", 
          position: "top" 
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderWasteItem = (item, index) => {
    
    const categories = item.category.split(',').filter(Boolean);

    return(
      <TouchableOpacity
        key={item.id}
        style={[styles.itemCard]}
        onPress={() => navigation.navigate('Waste Details', { id: item.id })}
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
    )

  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#1F2937']}
        style={styles.gradient}
      >
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
          {wasteItems.length > 0 ? (
            <View style={styles.itemsGrid}>
              {wasteItems.map((item, index) => renderWasteItem(item, index))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="recycle" size={60} color="#3B82F6" />
              <Text style={styles.emptyText}>No Waste Booked</Text>
            </View>
          )}
        </ScrollView>
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Recycle Bin')}
          >
            <FontAwesome name="recycle" size={24} color="#6B7280" />
            <Text style={styles.navText}>Recycle</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
          >
            <FontAwesome name="clipboard" size={24} color="#3B82F6" />
            <Text style={[styles.navText,styles.activeNavText]}>Jobs</Text>
          </TouchableOpacity>
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
  scrollContent: {
    padding: 16,
    marginTop:40
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
    backgroundColor: '#374151',
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});