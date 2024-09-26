import React,{useState} from 'react'
import {Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView} from 'react-native'

import backgroundImage from '../../assets/registration-login/1.jpg';

export const Login = ({navigation}) => {

    const [username,setusername] = useState()
    const [password,setpassword] = useState()

  return (
    <ImageBackground style={styles.backgroundimage} source={backgroundImage}>
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Login</Text>
        <TextInput style={styles.textbox} placeholder='Username' onChangeText={setusername}></TextInput>
        <TextInput style={[styles.textbox, styles.lasttextbox]} secureTextEntry={true} placeholder='Password' onChangeText={setpassword}></TextInput>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Profile')}>
            <Text style={styles.buttontext}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.text} onPress={()=>navigation.navigate('Registration')}>Do you have an Account? <Text style={styles.underline}>Register</Text></Text>
        <Text style={styles.text}>Forgot <Text style={styles.underline}>Username or Password?</Text></Text>
        </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    backgroundimage:{
        flex:1,
        resizeMode:'cover'
    },
    container:{
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 100,
    },
    header:{
        fontSize:35,
        marginBottom:65
    },
    text:{
        marginTop:30
    },
    textbox:{
        marginBottom:20,
        borderBlockColor:'black',
        borderWidth:1,
        paddingLeft:15,
        height:35,
        width:'75%'
    },
    lasttextbox:{
        marginBottom:40,
    },
    button:{
        backgroundColor:'#01b697',
        width:'75%',
        height:50,
        alignItems:'center',
        justifyContent:'center'
    },
    buttontext:{
        color:'white'
    },
    underline:{
        textDecorationLine:'underline',
        color:'#01b697'
    }

})