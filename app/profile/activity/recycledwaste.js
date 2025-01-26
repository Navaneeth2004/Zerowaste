//Importing important libraries
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Clipboard } from 'react-native';
import { BlurView } from 'expo-blur';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../../storage';

//Importing background image
import BackgroundImage from '../../../assets/profile/profile2.jpg';

export const RecycledWaste = ({navigation}) => {
    const { userData } = useUser();//Importing local storage
    //Demo values for waste recycled
    const wastedict = {
        15275: { collector: 'Arjun Das', warehouse: "Kochi", rate: 35, date: '20-Oct-2024', waste: ['Cardboard', 'Plastic Chair'] },
        15276: { collector: 'Rahul Kumar', warehouse: "Aluva", rate: 40, date: '26-Oct-2024', waste: ['Gas Cylinder'] },
        15277: { collector: 'Priya Singh', warehouse: "Paravur", rate: 38, date: '17-Nov-2024', waste: ['Metal Pipe'] },
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
        <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
            <BlurView intensity={90} tint="dark" style={styles.blurView}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
                    {Object.entries(wastedict).length > 0 ? (
                        Object.entries(wastedict).map(([id, item]) => (
                            <View key={id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.idContainer}>
                                        <Text style={styles.idLabel}>ID</Text>
                                        <Text style={styles.headingText}>{id}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => handleCopyId(id)}
                                        style={styles.copyButton}
                                    >
                                        <FontAwesome name='copy' size={15} color='#fff' />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.infoContainer}>
                                    <View style={styles.infoRow}>
                                        <FontAwesome name='user' size={16} color='#4CAF50' style={styles.infoIcon} />
                                        <Text style={styles.infoText}>
                                            {userData.role === 'collector' ? 'Seller' : 'Collector'}: {' '}
                                            <Text 
                                                onPress={() => navigation.navigate('Profile')} 
                                                style={styles.highlight}
                                            >
                                                {item.collector}
                                            </Text>
                                        </Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <FontAwesome name='building' size={16} color='#4CAF50' style={styles.infoIcon} />
                                        <Text style={styles.infoText}>
                                            Warehouse: <Text style={styles.highlight}>{item.warehouse}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <FontAwesome name='money' size={16} color='#4CAF50' style={styles.infoIcon} />
                                        <Text style={styles.infoText}>
                                            Rate: <Text style={styles.highlight}>₹{item.rate}/kg</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <FontAwesome name='calendar' size={16} color='#4CAF50' style={styles.infoIcon} />
                                        <Text style={styles.infoText}>
                                            Date: <Text style={styles.highlight}>{item.date}</Text>
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.wasteContainer}>
                                    <Text style={styles.wasteHeader}>
                                        <FontAwesome name='recycle' size={16} color='#4CAF50' /> Waste Items
                                    </Text>
                                    <View style={styles.wasteItemsContainer}>
                                        {item.waste.map((wasteItem, index) => (
                                            <View key={index} style={styles.wasteItemChip}>
                                                <Text style={styles.wasteItemText}>{wasteItem}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        //If waste items are not there
                        <View style={styles.nothingHere}>
                            <FontAwesome name='inbox' size={50} color='#666' />
                            <Text style={styles.nothingText}>No waste records found</Text>
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
        padding: 16,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    blurView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    card: {
        backgroundColor: 'rgba(23, 23, 23, 0.95)',
        borderRadius: 16,
        marginBottom: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    idContainer: {
        flexDirection: 'column',
    },
    idLabel: {
        color: '#666',
        fontSize: 12,
        marginBottom: 2,
    },
    headingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    icon: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 10,
    },
    copyButton: {
        padding: 8,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 15,
    },
    infoContainer: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginRight: 10,
        width: 20,
    },
    infoText: {
        fontSize: 16,
        color: '#999',
    },
    highlight: {
        color: '#fff',
        fontWeight: '600',
    },
    wasteContainer: {
        marginTop: 20,
    },
    wasteHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    wasteItemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    wasteItemChip: {
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#8B5CF6',
    },
    wasteItemText: {
        color: '#fff',
        fontSize: 14,
    },
    nothingHere: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 12,
    },
    nothingText: {
        color: '#666',
        fontSize: 18,
    },
});