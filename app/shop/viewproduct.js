import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import BackgroundImage from '../../assets/profile/profile.jpg';

export const ViewProduct = ({ navigation }) => {
  const productDict = {
    201: {
      name: 'Laptop Stand',
      category: 'Accessories',
      price: 79.99,
      lastImageUrl: 'https://ergonofis.com/cdn/shop/products/Artboard8.png?crop=center&height=2048&v=1675976402&width=2048',
      stockQuantity: 10,
      description: 'A sturdy laptop stand for better ergonomics.',
      rating: 4.5,
      lastitem:false
    },
    202: {
      name: 'Smartphone Case',
      category: 'Accessories',
      price: 29.99,
      lastImageUrl: 'https://goldenconcept.in/cdn/shop/files/C-14PM-W-CE-BK-G-0002_490x_015e67d1-3681-4ae4-a748-e1a1ddc44e70_490x.png?v=1686212925',
      stockQuantity: 25,
      description: 'Stylish case for your smartphone.',
      rating: 4.0,
      lastitem:false
    },
    203: {
      name: 'Coffee Maker',
      category: 'Appliances',
      price: 109.99,
      lastImageUrl: 'https://www.bialetti.com/media/catalog/product/cache/e8aa104d064dcf81ed9afb1c9c6893f4/g/i/gioia-responsible-lato.png',
      stockQuantity: 15,
      description: 'Brew delicious coffee every morning.',
      rating: 4.8,
      lastitem:false
    },
    204: {
      name: 'Desk Chair',
      category: 'Furniture',
      price: 159.99,
      lastImageUrl: 'https://static.wixstatic.com/media/c01599_640381ad3061434b9a1b57e18fc2c3d7~mv2.png/v1/crop/x_831,y_0,w_2178,h_2160/fill/w_560,h_632,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Spaceforme%20EN%2050%20Chair%20GR%20Angle.png',
      stockQuantity: 5,
      description: 'Comfortable ergonomic desk chair.',
      rating: 4.7,
      lastitem:false
    },
    205: {
      name: 'Headphones',
      category: 'Accessories',
      price: 69.99,
      lastImageUrl: 'https://www.sony-asia.com/image/2ab749ab3983bdeb6b2187653f12f792?fmt=png-alpha&wid=440',
      stockQuantity: 20,
      description: 'Noise-canceling over-ear headphones.',
      rating: 4.6,
      lastitem:false
    },
    206: {
      name: 'Water Bottle',
      category: 'Accessories',
      price: 18.99,
      lastImageUrl: 'https://www.bigbasket.com/media/uploads/p/xl/40129975_7-cello-water-bottle-h2o-purple.jpg',
      stockQuantity: 50,
      description: 'Durable water bottle for everyday use.',
      rating: 4.2,
      lastitem:false
    },
    207: {
      name: 'Pencil',
      category: 'Stationery',
      price: 1.99,
      lastImageUrl: 'https://www.promotionalwears.com/image/cache/catalog/data/pencil/natraj-621-bold-writing-pencil-750x750.png',
      stockQuantity: 100,
      description: 'High-quality writing pencil.',
      rating: 4.1,
      lastitem:false
    },
    208: {
      name: 'Notebook',
      category: 'Stationery',
      price: 15.99,
      lastImageUrl: 'https://www.theumbrellastore.in/cdn/shop/products/51yRq76FiUL-removebg-preview.png?v=1649674334',
      stockQuantity: 30,
      description: 'Spiral-bound notebook for your notes.',
      rating: 4.5,
      lastitem:false
    },

  };

  const [search, setSearch] = useState('');
  const filteredProducts = Object.entries(productDict).filter(([id, item]) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  if(filteredProducts.length>0)
  {
    const lastindex = filteredProducts.length-1
    const lastProduct = filteredProducts[lastindex];
    lastProduct[1].lastitem = true;
  }

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              onChangeText={setSearch}
              placeholder='Search'
              placeholderTextColor="#bbb"
            />
            <TouchableOpacity style={styles.iconContainer}>
              <FontAwesome name='filter' size={25} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>navigation.navigate('Cart')} style={[styles.cartcontainer]}>
            <FontAwesome name='shopping-cart' size={25} color="black" />
          </TouchableOpacity>
        </View>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(([id, item]) => (
            <TouchableOpacity key={id} style={[styles.productDetails, item.lastitem ? styles.lastItem : null]}>
              <View style={styles.imagecontainer}>
                <Image source={{ uri: item.lastImageUrl }} style={styles.productImage} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.productDescription}>{item.description}</Text>
                <Text style={styles.productStock}>Quantity: {item.stockQuantity}</Text>
                <Text style={styles.productRating}>Rating: {item.rating} ★</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nothing here...</Text>
          </View>
        )}
      </ScrollView>
      <LinearGradient
        colors={['#23374D', '#416788']}
        style={styles.bottomTab}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Recycle Bin')}>
          <FontAwesome style={styles.icon} name="recycle" size={30} color="#fff" />
          <Text style={styles.tabLabel}>Recycle</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome style={styles.icon} name="shopping-cart" size={30} color="#85dfdf" />
          <Text style={styles.tabLabel}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <FontAwesome style={styles.icon} name="user-circle" size={30} color="#fff" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 30,
    backgroundColor: '#ffffff',
    elevation: 5,
    marginTop:30,
    width:'85%'
  },
  cartcontainer:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding:10,
    backgroundColor: '#ffffff',
    elevation: 5,
    marginLeft:10
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: '#333',
  },
  iconContainer: {
    padding: 10,
  },
  productDetails: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  lastItem: {
    marginBottom: 100,
  },
  imagecontainer:{
    justifyContent:'center'
  },
  productImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  productCategory: {
    color: '#888',
    marginBottom: 5,
  },
  productPrice: {
    color: '#27ae60',
    fontSize: 16,
    marginVertical: 5,
  },
  productDescription: {
    color: '#555',
    marginBottom: 5,
  },
  productStock: {
    color: '#333',
    marginBottom: 5,
  },
  productRating: {
    color: '#f39c12',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: 'gray',
    fontSize: 18,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  icon: {
    alignSelf: 'center',
  },
  tabLabel: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
