//Importing important libraries
import { View, Text, ScrollView, TextInput, StyleSheet, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import Toast from 'react-native-toast-message';

//Connection to the server
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://zero.pockethost.io');

//Importing background image
import background from '../../../assets/profile/profile.jpg';

export const ViewTicket = ({ navigation, route }) => {
  //Declaring state variables
  const [subject, setSubject] = useState();
  const [detail, setDetail] = useState();
  const [response, setResponse] = useState();
  const [loading, setloading] = useState(false);
  const [edit, setedit] = useState(false);

  //To import the ticket from the database using the id recieved form the previous screen
  //and importing it in the state variables
  useEffect(() => {
    setloading(true);
    pb.collection('ticket')
      .getFullList(200, { filter: `id="${route.params.id}"` })
      .then((record) => {
        setSubject(record[0].subject);
        setDetail(record[0].details);
        setResponse(record[0].resolution);
      })
      .catch((error) => {
        console.log("Error occured while fetching ticket: ", error.data);
        Toast.show({
          text1: "Error occured while fetching ticket.",
          type: "error",
          position: "top"
        });
      })
      .finally(() => {
        setloading(false);
      });
  }, []);

  //To update the data after clicking on save button
  const update_data = () => {
    const data = {
      "subject": subject,
      "details": detail
    };
    setloading(true);
    pb.collection('ticket').update(route.params.id, data)
      .then(() => {
        Toast.show({
          text1: 'Success',
          text2: 'Successfully updated!',
          type: 'success',
          position: 'top',
        });
        setedit(false);
      })
      .catch((error) => {
        console.log("An Error occured: ", error);
        Toast.show({
          text1: 'Error',
          text2: 'An Error occured. Try again',
          type: 'error',
          position: 'top',
        });
      })
      .finally(() => {
        setloading(false);
      });
  };

  // Function to show save confirmation
  const confirmSave = () => {
    Alert.alert(
      "Save Changes",
      "Are you sure you want to save these changes?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Save",
          onPress: update_data
        }
      ],
      { cancelable: false }
    );
  };

  //To toggle edit mode 
  const toggleEdit = (value) => {
    if (value == 0) {
      setedit(true);
    } else {
      confirmSave();
    }
  };

  // Function to show delete confirmation and delete ticket
  const confirmDelete = () => {
    Alert.alert(
      "Delete Ticket",
      "Are you sure you want to delete this ticket?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteTicket(),
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  // Function to delete ticket
  const deleteTicket = () => {
    setloading(true);
    pb.collection('ticket').delete(route.params.id)
      .then(() => {
        Toast.show({
          text1: 'Success',
          text2: 'Ticket deleted successfully!',
          type: 'success',
          position: 'top',
        });
        navigation.goBack();
      })
      .catch((error) => {
        console.log("Error deleting ticket: ", error);
        Toast.show({
          text1: 'Error',
          text2: 'Failed to delete ticket',
          type: 'error',
          position: 'top',
        });
      })
      .finally(() => {
        setloading(false);
      });
  };

  //Header of the content.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#303132',
      },
      headerTintColor: '#E4E4E4',
    });
  }, [navigation]);

  return (
    <ImageBackground 
      source={background} 
      style={styles.background}
      blurRadius={3}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading && (
          <ActivityIndicator style={styles.loading} size="large" color="#E4E4E4"/>
        )}
        <BlurView intensity={90} tint="dark" style={styles.blurView}>
          <View style={styles.container}>
            {/*When edit mode is on*/}
            {edit ? (
              <View style={styles.editContainer}>
                <Text style={styles.label}>Subject</Text>
                <TextInput
                  style={styles.textInput}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder='Enter subject'
                  placeholderTextColor="#808080"
                  multiline={true}
                />
                <Text style={styles.label}>Details</Text>
                <TextInput
                  style={[styles.textInput, styles.textDetail]}
                  value={detail}
                  onChangeText={setDetail}
                  placeholder='Enter details'
                  placeholderTextColor="#808080"
                  multiline={true}
                />
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]} 
                  onPress={() => toggleEdit(1)}
                >
                  <FontAwesome name="save" size={20} color="#E4E4E4" />
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.readOnlyContainer}>
                <View style={styles.section}>
                  <Text style={styles.label}>Subject</Text>
                  <Text style={styles.displayText}>{subject}</Text>
                </View>
                
                <View style={styles.section}>
                  <Text style={styles.label}>Details</Text>
                  <Text style={styles.displayText}>{detail}</Text>
                </View>
                {/*When response is not there*/}
                {!response ? (
                  <View style={styles.statusContainer}>
                    <FontAwesome name="clock-o" size={20} color="#FFD700" style={styles.statusIcon} />
                    <Text style={styles.statusText}>Awaiting Response...</Text>
                  </View>
                ) : (
                  <View style={styles.section}>
                    <Text style={styles.label}>Response</Text>
                    <Text style={styles.displayText}>{response}</Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  {!response && (
                    <TouchableOpacity 
                      style={[styles.button, styles.editButton]} 
                      onPress={() => toggleEdit(0)}
                    >
                      <FontAwesome name="edit" size={20} color="#E4E4E4" />
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]} 
                    onPress={confirmDelete}
                  >
                    <FontAwesome name="trash" size={20} color="#E4E4E4" />
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: '#121212',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  blurView: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 30, 30, 0.75)',
  },
  container: {
    width: '100%',
    padding: 20,
  },
  editContainer: {
    gap: 12,
  },
  textInput: {
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    color: '#E4E4E4',
    fontSize: 16,
    minHeight: 50,
  },
  textDetail: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  readOnlyContainer: {
    gap: 24,
  },
  section: {
    backgroundColor: 'rgba(40, 40, 40, 0.5)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#404040',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#808080',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  displayText: {
    fontSize: 16,
    color: '#E4E4E4',
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(40, 40, 40, 0.5)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#404040',
  },
  statusIcon: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '500',
  },
  loading: {
    position: "absolute",
    alignSelf: 'center',
    top: 50,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    gap: 8,
  },
  buttonText: {
    color: '#E4E4E4',
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#2C5282',
  },
  deleteButton: {
    backgroundColor: '#C53030',
  },
  saveButton: {
    backgroundColor: '#2F855A',
  },
});