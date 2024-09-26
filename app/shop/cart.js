import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackgroundImage from '../../assets/profile/profile.jpg';

export const Cart = ({ navigation }) => {
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

  const deleteproduct = () => {
    Alert.alert(
      'Remove Product',
      'Remove product from cart list?',
      [
        {
          text: "Cancel",
        },
        {
          text: "Remove",
        },
      ]
    );
  }

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              <TouchableOpacity onPress={deleteproduct}>
                <FontAwesome name='trash' size={20} color="black" style={styles.icon} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nothing here...</Text>
          </View>
        )}   
        {
          filteredProducts.length > 0 &&
            <View style={{backgroundColor:'white',width:"80%",padding:15,alignSelf:'center',borderRadius:10,marginBottom:30}}>
              {
                filteredProducts.map(([id, item]) => (
                  <View key={id} style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
                    <Text>{item.name}</Text>
                    <Text>{item.price}</Text>
                  </View>
                ))
              }
              <View style={{flexDirection:'row',borderTopColor:'black',borderTopWidth:1,justifyContent:'space-between',marginTop:5}}>
                <Text style={{fontWeight:'bold'}}>Total</Text>
                <Text style={{fontWeight:'bold'}}>2000Rs</Text>
              </View>
              <TouchableOpacity style={styles.buybutton}>
                <Text style={styles.buyButtonText}>Buy</Text>
              </TouchableOpacity>
            </View>
        }
      </ScrollView>
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
    marginBottom: 50,
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
  buybutton:{
    backgroundColor: '#e1de7a',
    alignSelf: 'flex-start',
    paddingVertical: 10,   
    paddingHorizontal: 30,  
    borderRadius: 10,  
    alignSelf:'center',
    marginTop:30
  },
  buyButtonText: {
    fontSize: 16,
    color: 'black',       
  },
  totaltext:{
    fontWeight:'bold',
    fontSize:20
  }
});
