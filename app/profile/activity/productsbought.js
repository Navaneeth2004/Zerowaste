import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import BackgroundImage from '../../../assets/profile/profile.jpg';

export const BoughtProduct = () => {
    const productDict = {
        201: { name: 'Laptop Stand', category: 'Accessories', price: 79.99, date: '10-Sep-2024', lastImageUrl: 'https://ergonofis.com/cdn/shop/products/Artboard8.png?crop=center&height=2048&v=1675976402&width=2048' },
        202: { name: 'Smartphone Case', category: 'Accessories', price: 29.99, date: '15-Sep-2024', lastImageUrl: 'https://goldenconcept.in/cdn/shop/files/C-14PM-W-CE-BK-G-0002_490x_015e67d1-3681-4ae4-a748-e1a1ddc44e70_490x.png?v=1686212925' },
        203: { name: 'Coffee Maker', category: 'Appliances', price: 109.99, date: '18-Sep-2024', lastImageUrl: 'https://www.bialetti.com/media/catalog/product/cache/e8aa104d064dcf81ed9afb1c9c6893f4/g/i/gioia-responsible-lato.png' },
        204: { name: 'Desk Chair', category: 'Furniture', price: 159.99, date: '20-Sep-2024', lastImageUrl: 'https://static.wixstatic.com/media/c01599_640381ad3061434b9a1b57e18fc2c3d7~mv2.png/v1/crop/x_831,y_0,w_2178,h_2160/fill/w_560,h_632,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Spaceforme%20EN%2050%20Chair%20GR%20Angle.png' },
        205: { name: 'Headphones', category: 'Accessories', price: 69.99, date: '23-Sep-2024', lastImageUrl: 'https://www.sony-asia.com/image/2ab749ab3983bdeb6b2187653f12f792?fmt=png-alpha&wid=440' },
        206: { name: 'Water Bottle', category: 'Accessories', price: 18.99, date: '25-Sep-2024', lastImageUrl: 'https://www.bigbasket.com/media/uploads/p/xl/40129975_7-cello-water-bottle-h2o-purple.jpg' },
        207: { name: 'Pencil', category: 'Stationery', price: 1.99, date: '01-Oct-2024', lastImageUrl: 'https://www.promotionalwears.com/image/cache/catalog/data/pencil/natraj-621-bold-writing-pencil-750x750.png' },
        208: { name: 'Notebook', category: 'Stationery', price: 15.99, date: '05-Oct-2024', lastImageUrl: 'https://www.theumbrellastore.in/cdn/shop/products/51yRq76FiUL-removebg-preview.png?v=1649674334' }
    };

    return (
        <ImageBackground source={BackgroundImage} style={styles.background}>
            <BlurView intensity={80} style={styles.blurView}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {Object.entries(productDict).length > 0 ? (
                        Object.entries(productDict).map(([id, item]) => (
                            <View key={id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.headerRow}>
                                        <Text style={styles.headingText}>ID: {id}</Text>
                                        <TouchableOpacity style={styles.icon}>
                                            <FontAwesome name='copy' size={15} color='white' />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.infoText}>Product: <Text style={styles.highlight}>{item.name}</Text></Text>
                                        <Text style={styles.infoText}>Category: <Text style={styles.highlight}>{item.category}</Text></Text>
                                        <Text style={styles.infoText}>Price: <Text style={styles.highlight}>${item.price.toFixed(2)}</Text></Text>
                                        <Text style={styles.infoText}>Date: <Text style={styles.highlight}>{item.date}</Text></Text>
                                    </View>
                                </View>
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: item.lastImageUrl }} style={styles.productImage} />
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.nothingHere}>
                            <Text style={styles.nothingText}>Nothing here...</Text>
                        </View>
                    )}
                </ScrollView>
            </BlurView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    blurView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    scrollView: {
        padding: 20,
    },
    card: {
        backgroundColor: '#9ac8d1',
        borderRadius: 10,
        marginBottom: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    cardHeader: {
        marginBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    icon: {
        backgroundColor: '#6a3e82',
        justifyContent: 'center',
        padding:5,
        borderRadius: 5,
        
    },
    infoContainer: {
        marginTop: 5,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
    },
    highlight: {
        fontWeight: 'bold',
        color: '#6a3e82',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    productImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    nothingHere: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    nothingText: {
        color: 'gray',
        fontSize: 18,
    },
});
