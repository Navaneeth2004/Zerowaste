//Importing important libraries
import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Dimensions, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../storage';
import backgroundImage from '../../assets/registration-login/1.jpg';

//Connection to the database
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

//Getting the window height and width
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const Login = ({ navigation }) => {

    //Accessing local storage
    const { setUserData } = useUser();  

    //Declaring state variables
    const [gmail, setgmail] = useState("");  
    const [password, setpassword] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [forgotpassword, setforgotpassword] = useState(false); 
    const [timer, setTimer] = useState(0);  
    const [isDisabled, setIsDisabled] = useState(false);  
    const [otp, setotp] = useState(false);  
    const [otpvalue, setotpvalue] = useState("");  
    const [otpmail, setotpmail] = useState("");  


    const login = async () => {
        setLoading(true);//To show the loading indicator
        pb.collection('user').getFirstListItem(`user_mail="${gmail.toLowerCase()}"`)  
            .then((record) => {
                if (record.user_password === password) {
                    // Store user data upon successful login
                    setUserData({
                        id: record.id,
                        mail: record.user_mail,
                        username: record.user_name,
                        phone: String(record.user_phone),
                        address: record.address_line,
                        city: record.city,
                        state: record.state,
                        zip: record.postal_code,
                        idproof: record.idproof,
                        upi: record.upi,
                        collector_return: record.collector_return,
                        status: record.account_status,
                        subscriber: String(record.subscriber),
                        role: record.role
                    });
                    Toast.show({
                        text1: 'Success',
                        text2: "Successfully logged in!",
                        type: "success",
                        position: "top"
                    });
                    navigation.navigate('BaseProfile');  // Navigate to user profile page after successful login
                } else {
                    Toast.show({
                        text1: "Password is incorrect",
                        type: "error",
                        position: "bottom"
                    });
                }
            })
            .catch((error) => {
                console.log("An Error occurred: ", error.data);
                Toast.show({
                    text1: "User doesn't exist",
                    type: "error",
                    position: "bottom"
                });
            })
            .finally(() => setLoading(false));  // Hide the loading indicator after the request
    };

    // Start OTP timer: Disable the resend button and start countdown
    const startTimer = () => {
        setIsDisabled(true);  // Disable button while countdown is active
        setTimer(60);  // Set initial timer value
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    clearInterval(countdown);  // Stop countdown when timer reaches 0
                    setIsDisabled(false);  // Enable resend button after countdown finishes
                }
                return prev - 1;  // Decrease the timer
            });
        }, 1000);
    };

    // OTP validation function: Checks if OTP value is provided
    const checkotp = () => {
        if (!otpvalue) {
            Toast.show({
                text1: "Please provide the OTP",
                type: "error",
                position: "bottom"
            });
        }
    };

    //Validaing the fields
    const check = (type) => {
        if (type) {

            if (!otpmail.endsWith("@gmail.com")) {
                Toast.show({
                    text1: "Please provide a valid Gmail",
                    type: "error",
                    position: "bottom"
                });
            } else {
                startTimer();  
                setotp(true); 
                Toast.show({
                    text1: "Confirmation Sent!",
                    type: "success",
                    position: "bottom"
                });
            }
        } else {

            if (!gmail || !password) {
                Toast.show({
                    text1: "Please fill in the fields",
                    type: "error",
                    position: "bottom"
                });
                return login();  
            }
            if (!gmail.endsWith("@gmail.com")) {
                Toast.show({
                    text1: "Please provide a valid Gmail",
                    type: "error",
                    position: "bottom"
                });
            } else {
                login();  
            }
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground 
                source={backgroundImage}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
                <ScrollView 
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/*If values are being imported from the database*/}
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#01b697" />
                        </View>
                    )}
                    {/*If user did not click on forgot password*/}
                    {!forgotpassword ? (
                        <View style={styles.container}>
                            <Text style={styles.header}>Welcome Back</Text>
                            <Text style={styles.subHeader}>Sign in to continue</Text>
                            
                            <View style={styles.inputContainer}>
                                <View style={styles.inputWrapper}>
                                    <FontAwesome name="envelope" size={20} color="#01b697" style={styles.inputIcon} />
                                    <TextInput 
                                        style={styles.textbox} 
                                        placeholder="Gmail" 
                                        onChangeText={setgmail}
                                        placeholderTextColor="#999"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                                
                                <View style={styles.inputWrapper}>
                                    <FontAwesome name="lock" size={20} color="#01b697" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textbox}
                                        secureTextEntry={true}
                                        placeholder="Password"
                                        onChangeText={setpassword}
                                        placeholderTextColor="#999"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity 
                                style={styles.button} 
                                onPress={() => check(0)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttontext}>Sign In</Text>
                            </TouchableOpacity>

                            <View style={styles.linksContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                                    <Text style={styles.linkText}>
                                        New user? <Text style={styles.highlight}>Create Account</Text>
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity onPress={() => setforgotpassword(true)}>
                                    <Text style={styles.linkText}>
                                        Forgot <Text style={styles.highlight}>Password?</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        //If user clicks on forgot password
                        <View style={styles.container}>
                            <TouchableOpacity 
                                onPress={() => setforgotpassword(false)} 
                                style={styles.backarrow}
                            >
                                <FontAwesome name="arrow-left" size={24} color="#fff" />
                            </TouchableOpacity>
                            
                            <Text style={styles.header}>Password Reset</Text>
                            <Text style={styles.subHeader}>Enter your email to continue</Text>

                            <View style={styles.inputWrapper}>
                                <FontAwesome name="envelope" size={20} color="#01b697" style={styles.inputIcon} />
                                <TextInput 
                                    style={styles.textbox} 
                                    placeholder="Gmail" 
                                    onChangeText={setotpmail}
                                    placeholderTextColor="#999"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                            {/*If clicked on send otp button*/}
                            {otp && (
                                <View style={styles.otpContainer}>
                                    <View style={styles.inputWrapper}>
                                        <FontAwesome name="key" size={20} color="#01b697" style={styles.inputIcon} />
                                        <TextInput 
                                            style={styles.textbox} 
                                            placeholder="Enter OTP" 
                                            onChangeText={setotpvalue}
                                            placeholderTextColor="#999"
                                            keyboardType="number-pad"
                                            maxLength={6}
                                        />
                                    </View>
                                    
                                    <TouchableOpacity 
                                        style={styles.button} 
                                        onPress={checkotp}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.buttontext}>Verify OTP</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <TouchableOpacity
                                style={[styles.button, isDisabled && styles.disabledButton]}
                                onPress={() => check(1)}
                                disabled={isDisabled}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttontext}>
                                    {isDisabled ? `Resend in ${timer}s` : 'Send OTP'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        width: windowWidth,
        height: windowHeight,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,//To fill the entire parent object
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    scrollViewContent: {
        minHeight: windowHeight,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 2,
    },
    header: {
        fontSize: 32,
        marginTop:'50%',
        marginBottom: 10,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    inputIcon: {
        marginRight: 10,
    },
    textbox: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#01b697',
        width: '100%',
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginTop: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    disabledButton: {
        backgroundColor: '#7dc9bc',
        opacity: 0.7,
    },
    buttontext: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    linksContainer: {
        width: '100%',
        marginTop: 30,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 15,
        color: '#fff',
        marginVertical: 8,
    },
    highlight: {
        color: '#01b697',
        fontWeight: '600',
    },
    backarrow: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
        zIndex: 1,
    },
    otpContainer: {
        width: '100%',
        marginBottom: 20,
    },
});