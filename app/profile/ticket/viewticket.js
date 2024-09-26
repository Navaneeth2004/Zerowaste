import { View, Text, ScrollView, TextInput, StyleSheet, ImageBackground } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';

import background from '../../../assets/profile/profile.jpg';

export const ViewTicket = ({ navigation }) => {
  const [subject, setSubject] = useState('Issue with product order');
  const [detail, setDetail] = useState('The product I ordered arrived damaged, and I need a replacement.');
  const [response, setResponse] = useState('');

  const [edit,setedit] = useState(false)

  const toggleEdit=()=>{
      setedit(!edit)
  }

useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        !edit?
          response.trim()==''?
        <TouchableOpacity onPress={toggleEdit}>
          <FontAwesome name='edit' size={30} color='black' style={{ marginRight: 15 }} />
        </TouchableOpacity>
        :null:
        <TouchableOpacity onPress={toggleEdit}>
          <FontAwesome name='save' size={30} color='black' style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, edit, response]);

  return (
    <ImageBackground source={background} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <BlurView intensity={100} style={styles.blurView}>
          <View style={styles.container}>
            {edit ? (
              <>
                <TextInput
                  style={styles.textInput}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder='Subject'
                  placeholderTextColor="#bbb"
                  multiline={true}
                />
                <TextInput
                  style={[styles.textInput, styles.textDetail]}
                  value={detail}
                  onChangeText={setDetail}
                  placeholder='Details'
                  placeholderTextColor="#bbb"
                  multiline={true}
                />
              </>
            ) : (
              <View style={styles.readOnlyContainer}>
                <Text style={styles.label}>Subject:</Text>
                <Text style={styles.displayText}>{subject}</Text>
                <Text style={styles.label}>Details:</Text>
                <Text style={styles.displayText}>{detail}</Text>
                {response.trim() === '' ? (
                  <Text style={styles.statusText}>Awaiting Response...</Text>
                ) : (
                  <>
                    <Text style={styles.label}>Response:</Text>
                    <Text style={styles.displayText}>{response}</Text>
                  </>
                )}
              </View>
            )}
          </View>
        </BlurView>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  blurView: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  container: {
    width: '100%',
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    height: 60,
    padding:10,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  textDetail: {
    height: 150,
    textAlignVertical: 'top',
  },
  readOnlyContainer: {
    padding: 10,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  displayText: {
    fontSize: 16,
    color: '#555',
    paddingBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});


