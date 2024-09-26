import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import BackgroundImage from '../../../../assets/profile/profile.jpg';

export const RecycledWaste = () => {
    const wastedict = {
        15275: { collector: 'Arjun Das', warehouse: 2, rate: 35, date: '20-Oct-2024', waste: ['Cardboard', 'Plastic Chair'] },
        15276: { collector: 'Rahul Kumar', warehouse: 1, rate: 40, date: '21-Oct-2024', waste: ['Gas Cylinder'] },
        15277: { collector: 'Priya Singh', warehouse: 3, rate: 38, date: '22-Oct-2024', waste: ['Metal Pipe'] },
        15278: { collector: 'Vikram Mehta', warehouse: 2, rate: 37, date: '23-Oct-2024', waste: ['Wooden Furniture', 'Plastic Chair'] },
        15279: { collector: 'Ayesha Khan', warehouse: 1, rate: 36, date: '24-Oct-2024', waste: ['Cardboard', 'Metal Pipe'] },
        15280: { collector: 'Suresh Yadav', warehouse: 3, rate: 39, date: '25-Oct-2024', waste: ['Wooden Furniture'] }
    };

    return (
        <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
            <BlurView intensity={80} style={styles.blurView}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
                    {Object.entries(wastedict).length > 0 ? (
                        Object.entries(wastedict).map(([id, item]) => (
                            <View key={id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.headingText}>ID: {id}</Text>
                                    <TouchableOpacity style={styles.icon}>
                                        <FontAwesome name='copy' size={20} color='white' />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoText}>Collector: <Text style={styles.highlight}>{item.collector}</Text></Text>
                                    <Text style={styles.infoText}>Warehouse: <Text style={styles.highlight}>{item.warehouse}</Text></Text>
                                    <Text style={styles.infoText}>Rate: <Text style={styles.highlight}>{item.rate}</Text></Text>
                                    <Text style={styles.infoText}>Date: <Text style={styles.highlight}>{item.date}</Text></Text>
                                </View>
                                <View style={styles.wasteContainer}>
                                    <Text style={styles.wasteHeader}>Waste Items:</Text>
                                    {item.waste.map((wasteItem, index) => (
                                        <Text key={index} style={styles.wasteItem}>{wasteItem}</Text>
                                    ))}
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
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    scrollView: {
        padding: 20,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    blurView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    card: {
        backgroundColor: '#e3c5a5',
        borderRadius: 10,
        marginBottom: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    icon: {
        backgroundColor: '#6a3e82',
        borderRadius: 5,
        padding: 5,
    },
    infoContainer: {
        marginTop: 10,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
    },
    highlight: {
        fontWeight: 'bold',
        color: '#333',
    },
    wasteContainer: {
        marginTop: 10,
    },
    wasteHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6a3e82',
        marginBottom: 5,
    },
    wasteItem: {
        fontSize: 14,
        color: '#333',
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

