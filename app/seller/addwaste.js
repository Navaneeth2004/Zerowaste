import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState, useLayoutEffect, useCallback, useRef } from 'react';
import Toast from 'react-native-toast-message';
import BackgroundImage from '../../assets/profile/profile.jpg';
import MapView, { Marker } from 'react-native-maps';
import { useUser } from '../storage';

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

export const AddWaste = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description,setdescription] = useState('');
    const [wasteLimit, setWasteLimit] = useState(false);
    const [wasteArray, setWasteArray] = useState([{ id: 1, category: '', weight: 0, image: '' }]);
    const [loading, setLoading] = useState(false);
    const [wasteCategories, setWasteCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [markerCoordinate, setMarkerCoordinate] = useState(null);
    const [isMarkerPlaced, setIsMarkerPlaced] = useState(false);

    const {userData} = useUser();
    const mapref = useRef(null);

    const initial = {
        latitude: 9.9816,
        longitude: 76.2999,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };

    const fetchWasteCategories = useCallback(async () => {
        setLoading(true);
        try {
            const record = await pb.collection('waste_category').getFullList({ 
                sort: '-created',
                fields: 'id,category_name,standardized_price'
            });
            
            const formattedCategories = record.map(category => ({
                id: category.id,
                name: category.category_name.toUpperCase(),
                standardized_price: category.standardized_price
            }));
            
            setWasteCategories(formattedCategories);
        } catch (error) {
            console.log("Error fetching categories:", error);
            Toast.show({ text1: "An Error Occured.",text2:"Check your internet connection", type: "error", position: "top" });
        } finally {
            setLoading(false);
        }
    }, []);

    const calculate_weight = () => {

        let totalweight=0
        let category=''

        const categoryWeightDict = wasteArray.map(item => {
            const matchedCategory = wasteCategories.find(item2 => item2.id == item.category);
            if (matchedCategory) 
            {
                category=category+','+matchedCategory.name
                console.log(category)
                totalweight+=parseInt(item.weight);
                const weight = parseInt(item.weight) * parseInt(matchedCategory.standardized_price);
                return {
                    category: item.category,
                    weight: weight,
                };
            }
        });

        if(categoryWeightDict)
        {
            // Sum all weights to get the total weight
            const totalrate = categoryWeightDict.reduce((acc, curr) => acc + curr.weight, 0);

            category=category.trim()

            return [totalrate,totalweight,category];
        }
    }

    const createpost = async () => {
        try {
            const [totalrate,totalweight,totalcategory] = calculate_weight()

            const data = {
                "user_id":userData.id,
                "title":title,
                "description":description,
                "rate":totalrate,
                "status":"Pending",
                "location":markerCoordinate,
                "total_weight":totalweight,
                "category":totalcategory
            };

            const response = await pb.collection('post').create(data);
            createwaste(response.id)

        } catch (error) {
            console.error('Error creating post:', error);
            Toast.show({ text1: "An Error Occured.",text2:"Check your internet connection", type: "error", position: "top" });
        }
    };

    const createwaste = async (postid) => {
        try {
            for (const [index, waste] of wasteArray.entries()) {
                const formData = new FormData();

                const fileName = waste.image.split('/').pop();
                const match = /\.(\w+)$/.exec(fileName);
                const type = match ? `image/${match[1]}` : `image`;
                const file = { uri: waste.image, name: fileName, type };
                formData.append('image', file);
                formData.append('post_id', postid);

                console.log(formData)
            
                const record = await pb.collection('images').create(formData);
    
                if (index === 0) {
                    await pb.collection('post').update(postid, {
                        "image": record.image,
                        "image_id": record.id
                    });
                }
    
                const data = {
                    "post_id": postid,
                    "category_id": waste.category,
                    "description": waste.description,
                    "estimated_weight": parseInt(waste.weight),
                    "image": record.image
                };
    
                try {
                    await pb.collection('waste').create(data);
                    console.log("Record created in waste table successfully");
                } catch (error) {
                    console.error('Error creating waste record:', error.data);
                }
            }
    
        } catch (error) {
            console.error('Error in createwaste function:', error);
            Toast.show({ 
                text1: "An Error Occurred.",
                text2: "Check your internet connection", 
                type: "error", 
                position: "top" 
            });
        }
    };

    useEffect(() => {
        fetchWasteCategories();
    }, [fetchWasteCategories]);

    useEffect(() => {
        setWasteLimit(wasteArray.length === 5);
    }, [wasteArray]);

    const addItem = useCallback(() => {
        if (wasteArray.length < 5) {
            setWasteArray(prev => [...prev, { 
                id: prev.length + 1, 
                category: '', 
                weight: 0, 
                image: ''
            }]);
        }
    }, [wasteArray.length]);

    const handleTextChange = useCallback((index, field, value) => {
        setWasteArray(prev => {
            const newArray = [...prev];
            newArray[index] = { ...newArray[index], [field]: value };
            return newArray;
        });
    }, []);

    const validateFields = useCallback(() => {
        const trimmedTitle = title.trim();
        const trimmedDes = description.trim();
        if (!trimmedTitle) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please enter a title',
                position: 'top',
                visibilityTime: 3000,
            });
            return false;
        }

        if (!trimmedDes) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: `Please add a description`,
                position: 'top',
                visibilityTime: 3000,
            });
            return true;
        }

        if (!markerCoordinate) {
          Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: 'Location is required',
            position: 'top',
            visibilityTime: 3000,
          });
          return false;
        }

        const hasInvalidItems = wasteArray.some((item, index) => {
            if (!item.category) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: `Please select a category for Item ${index + 1}`,
                    position: 'top',
                    visibilityTime: 3000,
                });
                return true;
            }

            if (!item.weight) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: `Please enter an estimated weight for Item ${index + 1}`,
                    position: 'top',
                    visibilityTime: 3000,
                });
                return true;
            }

            if (!item.image) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: `Please choose an image for Item ${index + 1}`,
                    position: 'top',
                    visibilityTime: 3000,
                });
                return true;
            }
            return false;
        });

        return !hasInvalidItems;
    }, [title, wasteArray]);

    const handleSave = useCallback(() => {
        if (validateFields()) {
            const previousRoute = navigation.getState().routes[navigation.getState().index - 1];
            const message = previousRoute?.name === 'Recycle Bin' ?  'Create Schedule?' : 'Save Changes?' ;
            
            Alert.alert(message, 'Are you sure you want to proceed?', [
                { text: "Cancel", style: 'cancel' },
                { 
                    text: "Proceed", 
                    onPress: async () => {
                        setIsSubmitting(true);
                        try {
                            await createpost();
       
                            Toast.show({
                              type: 'success',
                              text1: 'Successfully Created Post',
                              position: 'top',
                              visibilityTime: 3000,
                            });
                            

                            setTimeout(() => {
                              navigation.navigate('BaseProfile');
                            }, 3000);

                        } catch (error) {
                            console.error('Save error:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Failed to save post. Please try again.',
                                position: 'top',
                                visibilityTime: 3000,
                            });
                        } finally {
                            setIsSubmitting(false);
                        }
                    },
                },
            ]);
        }
    }, [navigation, validateFields, title, wasteArray]);

    //function to choose image from the gallery
    const pickImage = async (index) => {
        let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Permission is required to access the gallery!");
            return;
        }

        let resultImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!resultImage.canceled) {
            setWasteArray(prevWasteArray => {
                const updatedWasteArray = [...prevWasteArray];
                updatedWasteArray[index] = {
                    ...updatedWasteArray[index],
                    image: resultImage.assets[0].uri,
                };
                return updatedWasteArray;
            });
        }
    };

    const removeImage = useCallback((index) => {
        setWasteArray(prev => {
            const newArray = [...prev];
            newArray[index] = { ...newArray[index], image: null };
            return newArray;
        });
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity 
                    onPress={handleSave}
                    style={styles.headerButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#7CB342" />
                    ) : (
                        <FontAwesome name='save' size={26} color='#7CB342' />
                    )}
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: '#1E1E1E',
            },
            headerTintColor: '#7CB342',
            headerTitleStyle: {
                color: '#FFFFFF',
            },
        });
    }, [navigation, handleSave, isSubmitting]);

    const renderWasteItem = useCallback((item, index) => (
        <View key={index} style={styles.wasteTextBox}>
            <View style={styles.countContainer}>
                <Text style={styles.countText}>Item {index + 1}</Text>
            </View>
            <View style={styles.textBoxSelect}>
                <Text style={styles.labelText}>Waste Category</Text>
                {loading ? (
                    <ActivityIndicator size="small" color="#7CB342" />
                ) : (
                    <View>
                        <Picker
                            selectedValue={item.category}
                            onValueChange={(itemValue) => {
                                handleTextChange(index, 'category', itemValue);
                            }}
                            style={styles.picker}
                            dropdownIconColor="#7CB342"
                        >
                            <Picker.Item 
                                label='Select Category' 
                                value="" 
                                color="#808080" 
                            />
                            {wasteCategories.map((category) => (
                                <Picker.Item 
                                    key={category.id}
                                    label={category.name}
                                    value={category.id}
                                    color="black"
                                />
                            ))}
                        </Picker>
                    </View>
                )}
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.labelText}>Estimated Weight</Text>
                <TextInput
                    style={[styles.descriptionBox,{height:50,}]}
                    onChangeText={(text) => handleTextChange(index, 'weight', text)}
                    value={item.weight}       
                    keyboardType="numeric" 
                    placeholder='Enter estimated weight'
                    placeholderTextColor="#808080"
                    selectionColor="#7CB342"
                />
            </View>
            <View style={styles.imageContainer}>
                <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => pickImage(index)}
                >
                    <FontAwesome name='image' size={45} color="white" />
                    <Text style={styles.imageButtonText}>{item.image ? "Change Image" : "Select Image"}</Text>
                </TouchableOpacity>
                {item.image ? (
                    <TouchableOpacity onPress={() => removeImage(index)}>
                        <FontAwesome name='close' size={30} color="#C03A3A" />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    ), [loading, wasteCategories, handleTextChange]);

    // Function to handle map press
    const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
    
        setMarkerCoordinate(coordinate);
        setIsMarkerPlaced(true);
    };

    // Function to toggle marker visibility
    const toggleMarker = () => {
        setMarkerCoordinate(null);
        setIsMarkerPlaced(false);
    };

    // Function to relocate to the initial position
    const relocateToTarget = () => {
        const targetRegion = isMarkerPlaced && markerCoordinate
            ? {
                latitude: markerCoordinate.latitude,
                longitude: markerCoordinate.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005, 
            }
            : initial; 
    
        if (mapref.current) {
            mapref.current.animateToRegion(targetRegion, 1000);
        }
    };

    return (
        <>
            <ImageBackground 
                source={BackgroundImage} 
                style={styles.container}
                blurRadius={2}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.postContainer}>
                        <TextInput
                            style={styles.titleBox}
                            onChangeText={setTitle}
                            placeholder='Title'
                            placeholderTextColor="#808080"
                            selectionColor="#7CB342"
                            value={title}
                        />

                    <View style={styles.descriptionContainer}>
                        <TextInput
                            style={[styles.descriptionBox,{marginBottom: 30}]}
                            onChangeText={setdescription}
                            value={description}
                            multiline={true}
                            placeholder='Enter waste description...'
                            placeholderTextColor="#808080"
                            selectionColor="#7CB342"
                        />
                    </View>

                        <View style={styles.mapWrapper}>
                            <MapView
                                ref={mapref}
                                style={styles.map}
                                initialRegion={initial}
                                showsUserLocation
                                showsMyLocationButton
                                onPress={handleMapPress}
                            >
                                {markerCoordinate && 
                                (
                                    <Marker coordinate={markerCoordinate} />
                                )}
                            </MapView>
                            <TouchableOpacity onPress={toggleMarker} style={[styles.getDirections,{backgroundColor:isMarkerPlaced?"red":"gray"}]} disabled={isMarkerPlaced?false:true}>
                                <Text style={styles.getDirectionsText}>
                                    {isMarkerPlaced ? 'Remove the Marker' : 'Place the Marker'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={relocateToTarget} style={styles.relocateIconContainer}>
                                <FontAwesome name='location-arrow' size={25} color="black" />
                            </TouchableOpacity>
                         </View>
   
                        {wasteArray.map(renderWasteItem)}
                        
                        {!wasteLimit && (
                            <TouchableOpacity 
                                onPress={addItem} 
                                style={styles.addButton}
                                activeOpacity={0.7}
                            >
                                <FontAwesome name='plus' size={20} color="#FFFFFF" />
                                <Text style={styles.addButtonText}>Add Another Item</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </ImageBackground>
            <Toast />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    postContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    titleBox: {
        backgroundColor: '#2A2A2A',
        width: "100%",
        height: 50,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 20,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333333',
    },
    textBoxSelect: {
        width: "100%",
        marginBottom: 20,
    },
    labelText: {
        color: '#7CB342',
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    picker: {
        backgroundColor: '#2A2A2A',
        color: '#FFFFFF',
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333333',
    },
    wasteTextBox: {
        width: "100%",
        marginBottom: 24,
        backgroundColor: '#252525',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333333',
    },
    countContainer: {
        marginBottom: 16,
    },
    countText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7CB342',
    },
    descriptionContainer: {
        width: "100%",
    },
    descriptionBox: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 12,
        height: 100,
        color: '#FFFFFF',
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#333333',
    },
    addButton: {
        backgroundColor: '#7CB342',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 16,
    },
    headerButton: {
        marginRight: 15,
    },
    mapWrapper: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        position:'relative',
        marginBottom: 50,
      },
    map: {
        width: '100%',
        height: 250,
    },
    getDirections: {
        backgroundColor: '#4caf50',
        padding: 10,
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    getDirectionsText: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
    relocateIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10, 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 50,
        elevation: 2, 
      },
      imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop:30
    },
    imageButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 75,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        marginBottom: 10,
        borderColor: '#B0BEC5',
        borderWidth: 1,
    },
    imageButtonText: {
        color: 'white',
        marginTop: 5,
        fontWeight: 'bold',
    },
});

