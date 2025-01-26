//Importing important libraries
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground, Clipboard } from 'react-native';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//Importing background image
import BackgroundImage from '../../../assets/profile/profile2.jpg';

export const BoughtProduct = () => {
    //Demo eco friendly products
    const productDict = {
        301: { 
            name: 'Recycled Paper book', 
            category: 'Stationery', 
            price: 24.55, 
            date: '10-Oct-2024', 
            lastImageUrl: 'https://static.wixstatic.com/media/a7b922_a8daa5d89f494cfbb4ba39e329988581~mv2.png/v1/fill/w_550,h_438,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/a7b922_a8daa5d89f494cfbb4ba39e329988581~mv2.png' 
        },
        302: { 
            name: 'Bamboo Pencils', 
            category: 'Stationery', 
            price: 10.89, 
            date: '12-Oct-2024', 
            lastImageUrl: 'https://57cbfd06.rocketcdn.me/wp-content/uploads/2023/12/Bamboo-Pen.png' 
        },
        303: { 
            name: 'Reusable Water Bottle', 
            category: 'Accessories', 
            price: 48.99, 
            date: '15-Oct-2024', 
            lastImageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/022/024/695/small_2x/gray-bottle-isolated-on-a-transparent-background-png.png' 
        }
    };

    //State variable for tracking copied ID
    const [copiedId, setCopiedId] = useState(null);

    //To handle clipboard functionality
    const handleCopyId = (id) => {
        Clipboard.setString(id.toString());
        setCopiedId(id);
        
        // Reset the copied state after 2 seconds
        setTimeout(() => {
            setCopiedId(null);
        }, 2000);
    };
    
    return (
        <ImageBackground source={BackgroundImage} style={styles.background}>
            <BlurView intensity={90} tint="dark" style={styles.blurView}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {Object.entries(productDict).length > 0 ? (
                        Object.entries(productDict).map(([id, item]) => (
                            <View key={id} style={styles.card}>
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: item.lastImageUrl }} style={styles.productImage} />
                                    <View style={styles.categoryTag}>
                                        <Text style={styles.categoryText}>{item.category}</Text>
                                    </View>
                                </View>
                                <View style={styles.cardContent}>
                                    <View style={styles.headerRow}>
                                        <View style={styles.productInfoContainer}>
                                            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                                            <Text style={styles.date}>{item.date}</Text>
                                        </View>
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.idContainer}>
                                        <Text style={styles.idText}>ID: {id}</Text>
                                        <TouchableOpacity 
                                            style={[styles.copyButton, copiedId === parseInt(id) && styles.copyButtonActive]}
                                            onPress={() => handleCopyId(id)}
                                        >
                                            <FontAwesome 
                                                name={copiedId === parseInt(id) ? 'check' : 'copy'} 
                                                size={14} 
                                                color='#fff' 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.nothingHere}>
                            <FontAwesome name="shopping-bag" size={50} color="#666" />
                            <Text style={styles.nothingText}>No purchases yet</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    scrollView: {
        padding: 16,
    },
    card: {
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
        backgroundColor: '#2a2a2a',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    categoryTag: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    cardContent: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    productInfoContainer: {
        flex: 1,
        marginRight: 12,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    date: {
        fontSize: 14,
        color: '#999',
    },
    priceContainer: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    price: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    idText: {
        color: '#999',
        fontSize: 14,
        flex: 1,
    },
    copyButton: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    copyButtonActive: {
        backgroundColor: '#4CAF50',
    },
    nothingHere: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    nothingText: {
        color: '#666',
        fontSize: 18,
        marginTop: 12,
    },
});