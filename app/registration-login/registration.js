import React,{useState} from 'react'
import {Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ScrollView} from 'react-native'

import backgroundImage from '../../assets/registration-login/1.jpg'

export const Registration = ({navigation}) => {
 
    const [username,setusername] = useState()
    const [phone,setphone] = useState()
    const [gmail,setgmail] = useState();
    const [password,setpassword] = useState()
    const [address1,setaddress1] = useState()
    const [address2,setaddress2] = useState()
    const [state,setstate] = useState()
    const [city,setcity] = useState()
    const [zip,setzip] = useState()
    
  return (
    <ImageBackground style={styles.backgroundimage} source={backgroundImage}>
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Registration</Text>
        <TextInput style={styles.textbox} placeholder='Username' onChangeText={setusername}></TextInput>
        <TextInput style={styles.textbox} placeholder='Phone' onChangeText={setphone}></TextInput>
        <TextInput style={styles.textbox} placeholder='Gmail' onChangeText={setgmail}></TextInput>
        <TextInput style={styles.textbox} placeholder='Password' secureTextEntry={true} onChangeText={setpassword}></TextInput>
        <TextInput style={[styles.textbox,styles.addressbox]} multiline={true} placeholder='Address line 1' onChangeText={setaddress1}></TextInput>
        <TextInput style={[styles.textbox,styles.addressbox]} multiline={true} placeholder='Address line 2' onChangeText={setaddress2}></TextInput>
        <TextInput style={styles.textbox} placeholder='State' onChangeText={setstate}></TextInput>
        <TextInput style={styles.textbox} placeholder='City' onChangeText={setcity}></TextInput>
        <TextInput style={[styles.textbox,styles.lasttextbox]} placeholder='Zip Code' onChangeText={setzip}></TextInput>
        <TouchableOpacity onPress={()=>navigation.navigate('Profile')} style={styles.button}>
            <Text style={styles.buttontext}>Register</Text>
        </TouchableOpacity>
        <Text style={styles.text} onPress={()=>navigation.navigate('Login')}>Already have an account? <Text style={styles.underline}>Log in</Text></Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    header:{
        fontSize:35,
        marginBottom:40
    },
    text:{
        marginTop:20
    },
    textbox:{
        marginBottom:20,
        borderBlockColor:'black',
        borderWidth:1,
        paddingLeft:15,
        height:35,
        width:'75%'
    },
    addressbox:{
        height:60,
        textAlignVertical: 'top',
        paddingTop:8
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