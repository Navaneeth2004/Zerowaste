//Importing important libraries
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useUser } from '../../storage';

//Connecting to the database
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

//Importing background image
import BackgroundImage from '../../../assets/profile/profile2.jpg';

//Setting the colour of the status
const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
        case 'open':
            return '#00b894';
        case 'closed':
            return '#d63031';
        case 'in progress':
            return '#0984e3';
        default:
            return '#636e72';
    }
};

export const BaseTicket = ({ navigation }) => {
    const { userData } = useUser();//Importing local storage
    const [ticketDict, setticketDict] = useState([]);
    const [loading, setloading] = useState(false);

    //Importing tickets from the database
    useEffect(() => {
        setloading(true);
        pb.collection('ticket').getFullList(200, { filter: `user_id="${userData.id}"` })
            .then((record) => {
                setticketDict(record);
            })
            .catch((error) => {
                console.log("Error occured while fetching tickets: ", error.data);
                Toast.show({
                    text1: "Error occurred while fetching tickets.",
                    type: "error",
                    position: "top"
                });
            })
            .finally(() => {
                setloading(false);
            });
    }, []);

    //Converting date to another format
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

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
            <BlurView intensity={100} tint="dark" style={styles.blurView}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Loading tickets...</Text>
                    </View>
                ) : null}
                
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {ticketDict.length > 0 ? (
                        ticketDict.map((item) => (
                            <TouchableOpacity 
                                //Upon on press going to another screen and sending the ticket id as well
                                onPress={() => navigation.navigate('Ticket Name', { id: item.id })}
                                key={item.id} 
                                style={styles.card}
                            >
                                <LinearGradient
                                    colors={['rgba(32, 32, 32, 0.9)', 'rgba(24, 24, 24, 0.95)']}
                                    style={styles.cardGradient}
                                >
                                    <View style={styles.statusBar}>
                                        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
                                        <Text style={styles.statusText}>{item.status}</Text>
                                    </View>

                                    <View style={styles.cardContent}>
                                        <View style={styles.headerRow}>
                                            <Text style={styles.headingText}>#{item.id}</Text>
                                            <TouchableOpacity style={styles.iconButton}>
                                                <FontAwesome name='copy' size={16} color='#6c5ce7' />
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={styles.subjectText} numberOfLines={2}>
                                            {item.subject}
                                        </Text>

                                        <View style={styles.detailsContainer}>
                                            <View style={styles.detailItem}>
                                                <FontAwesome name='tag' size={14} color='#a4b0be' />
                                                <Text style={styles.detailText}>{item.tickettype}</Text>
                                            </View>
                                            
                                            <View style={styles.detailItem}>
                                                <FontAwesome name='calendar' size={14} color='#a4b0be' />
                                                <Text style={styles.detailText}>{formatDate(item.created)}</Text>
                                            </View>

                                            {item.resolvedate && (
                                                <View style={styles.detailItem}>
                                                    <FontAwesome name='check-circle' size={14} color='#a4b0be' />
                                                    <Text style={styles.detailText}>{formatDate(item.resolvedate)}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))
                    ) : (
                        //If tickets were not found
                        <View style={styles.emptyContainer}>
                            <FontAwesome name='ticket' size={50} color='rgba(255,255,255,0.3)' />
                            <Text style={styles.emptyText}>No tickets found</Text>
                            <Text style={styles.emptySubText}>Create a new ticket to get started</Text>
                        </View>
                    )}
                </ScrollView>
                    {/*If pressed on the create ticket button*/}
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Create Ticket')} 
                        style={styles.gradient}
                    >
                        <FontAwesome name='plus' size={30} color='#ffffff' />
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    loadingContainer: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    scrollView: {
        padding: 15,
    },
    card: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    cardGradient: {
        borderRadius: 15,
        overflow: 'hidden',
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardContent: {
        padding: 15,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    iconButton: {
        padding: 8,
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        borderRadius: 8,
    },
    subjectText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 15,
        lineHeight: 24,
    },
    detailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 5,
    },
    detailText: {
        color: '#a4b0be',
        marginLeft: 6,
        fontSize: 13,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        height: Dimensions.get('window').height * 0.7,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 20,
        marginTop: 20,
        fontWeight: '600',
    },
    emptySubText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginTop: 10,
    },
    gradient: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#4CAF50'
    },
});