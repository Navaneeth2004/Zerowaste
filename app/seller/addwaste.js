import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState, useLayoutEffect } from 'react';

import BackgroundImage from '../../assets/profile/profile.jpg';

export const AddWaste = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [wasteLimit, setWasteLimit] = useState(false);
    const [wasteArray, setWasteArray] = useState([{ id: 1, category: '', description: '', weight: '', image: null }]);

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
            const newWasteArray = [...wasteArray];
            newWasteArray[index].image = resultImage.assets[0].uri;
            setWasteArray(newWasteArray);
        }
    };

    useEffect(() => {
        if (wasteArray.length === 5) {
            setWasteLimit(true);
        }
    }, [wasteArray]);

    const addItem = () => {
        setWasteArray([...wasteArray, { id: wasteArray.length + 1, category: '', description: '', weight: '', image: null }]);
    };

    const handleTextChange = (index, field, value) => {
        const newWasteArray = [...wasteArray];
        newWasteArray[index][field] = value;
        setWasteArray(newWasteArray);
    };

    const removeImage = (index) => {
        const newWasteArray = [...wasteArray];
        newWasteArray[index].image = null;
        setWasteArray(newWasteArray);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity>
                    <FontAwesome name='save' size={30} color='black' style={{ marginRight: 15 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <ImageBackground source={BackgroundImage} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.postContainer}>
                    <TextInput
                        style={styles.titleBox}
                        onChangeText={setTitle}
                        placeholder='Title'
                        placeholderTextColor="black"
                    />
                    {wasteArray.map((item, index) => (
                        <View key={index} style={styles.wasteTextBox}>
                            <Text style={styles.countText}>No. {index + 1}</Text>
                            <View style={styles.textBoxSelect}>
                                <Picker
                                    selectedValue={item.category}
                                    onValueChange={(itemValue) => handleTextChange(index, 'category', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label='Select Category' value="" />
                                    <Picker.Item label='Plastic' value="Plastic" />
                                    <Picker.Item label='Cardboard' value="Cardboard" />
                                    <Picker.Item label='Metal' value="Metal" />
                                </Picker>
                            </View>
                            <TextInput
                                style={[styles.textBox, { height: 90 }]}
                                onChangeText={(text) => handleTextChange(index, 'description', text)}
                                multiline={true}
                                placeholder='Description'
                                placeholderTextColor="#B0BEC5"
                            />
                            <TextInput
                                style={styles.textBox}
                                onChangeText={(text) => handleTextChange(index, 'weight', text)}
                                placeholder='Estimated Weight'
                                placeholderTextColor="#B0BEC5"
                            />
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
                    ))}
                    {!wasteLimit && (
                        <TouchableOpacity onPress={addItem} style={styles.addButton}>
                            <FontAwesome name='plus' size={30} color="white" />
                            <Text style={styles.addButtonText}>Add Another Item</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    postContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    titleBox: {
        borderColor: '#B0BEC5',
        borderWidth: 1,
        width: "100%",
        height: 40,
        paddingLeft: 10,
        borderRadius: 8,
        marginBottom: 80,
        backgroundColor: 'white',
    },
    textBox: {
        borderColor: '#B0BEC5',
        borderWidth: 1,
        width: "100%",
        height: 40,
        paddingLeft: 10,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: 'white',
        textAlignVertical: 'top',
        paddingTop:8
    },
    textBoxSelect: {
        borderColor: '#B0BEC5',
        borderWidth: 1,
        width: "100%",
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wasteTextBox: {
        width: "100%",
        alignItems: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    imageButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 75,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        marginBottom: 70,
        borderColor: '#B0BEC5',
        borderWidth: 1,
    },
    imageButtonText: {
        color: 'white',
        marginTop: 5,
        fontWeight: 'bold',
    },
    addButton: {
        marginBottom: 30,
        backgroundColor: '#1976D2',
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 16,
    },
    countText: {
        fontSize: 20,
        marginBottom: 10,
        width: "100%",
        textAlign: 'center',
        height: 45,
        fontWeight: 'bold',
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        color: '#fff',
    },
    picker: {
        height: 40,
        width: '100%',
        color: '#000',
    },
});
