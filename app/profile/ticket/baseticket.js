import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import BackgroundImage from '../../../assets/profile/profile.jpg'; // Replace with your actual image URL

export const BaseTicket = ({ navigation }) => {
    const ticketDict = {
        301: { type: 'Bug', subject: 'App Crashes on Startup', date: '15-Sep-2024', status: 'Open', resolveDate: null },
        302: { type: 'Feature Request', subject: 'Add Dark Mode', date: '16-Sep-2024', status: 'In Progress', resolveDate: null },
        303: { type: 'Support', subject: 'Issue with Payment Gateway', date: '17-Sep-2024', status: 'Resolved', resolveDate: '18-Sep-2024' },
        304: { type: 'Bug', subject: 'Error on Checkout Page', date: '18-Sep-2024', status: 'Open', resolveDate: null },
        305: { type: 'Feature Request', subject: 'Improve Search Functionality', date: '19-Sep-2024', status: 'Pending', resolveDate: null },
        306: { type: 'Support', subject: 'User Login Issues', date: '20-Sep-2024', status: 'In Progress', resolveDate: null },
        307: { type: 'Bug', subject: 'Broken Link on Homepage', date: '21-Sep-2024', status: 'Resolved', resolveDate: '22-Sep-2024' },
        308: { type: 'Support', subject: 'Incorrect Order Details', date: '22-Sep-2024', status: 'Open', resolveDate: null }
    };

    return (
        <ImageBackground source={BackgroundImage} style={styles.background}>
            <BlurView intensity={80} style={styles.blurView}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {Object.entries(ticketDict).length > 0 ? (
                        Object.entries(ticketDict).map(([id, item]) => (
                            <TouchableOpacity onPress={() => navigation.navigate('Ticket Name')} key={id} style={styles.card}>
                                <View style={styles.cardContent}>
                                    <View style={styles.headerRow}>
                                        <Text style={styles.headingText}>ID: {id}</Text>
                                        <TouchableOpacity style={styles.icon}>
                                            <FontAwesome name='copy' size={16} color='#6a3e82' />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Type:</Text>
                                        <Text style={styles.detail}>{item.type}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Subject:</Text>
                                        <Text style={styles.detail}>{item.subject}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Status:</Text>
                                        <Text style={styles.detail}>{item.status}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Date:</Text>
                                        <Text style={styles.detail}>{item.date}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Resolve Date:</Text>
                                        <Text style={styles.detail}>{item.resolveDate || 'N/A'}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.nothingHere}>
                            <Text style={styles.nothingText}>Nothing here...</Text>
                        </View>
                    )}
                </ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate('Create Ticket')} style={styles.addButton}>
                    <LinearGradient colors={['#4087e1', '#2b5a9c']} style={styles.gradient}>
                        <FontAwesome name='plus' size={50} color='#ffffff' />
                    </LinearGradient>
                </TouchableOpacity>
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
        alignItems: 'center',
        padding:20
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 15,
        padding: 15,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    cardContent: {
        flexDirection: 'column',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    icon: {
        justifyContent: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    label: {
        fontWeight: 'bold',
        color: '#555',
    },
    detail: {
        color: '#333',
        marginLeft: 5,
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
        fontStyle: 'italic',
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
    },
    gradient: {
        borderRadius: 50,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
});
