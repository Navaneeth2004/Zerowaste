import { Linking, View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList, ScrollView, ImageBackground, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import backgroundImage from '../../assets/profile/profile.jpg';

export const ViewWaste = ({ navigation }) => {
  
  const images = [
    require('../../assets/test/cardboard.webp'),
    require('../../assets/test/plastic.webp'),
  ];

  const [edit, setEdit] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [role, setRole] = useState('selle');
  const [previousScreen, setPreviousScreen] = useState('');
  const mapref = useRef(null)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const routeNames = navigation.getState().routes;
      const prevRoute = routeNames[routeNames.length - 2];
      setPreviousScreen(prevRoute.name);
    });
    return unsubscribe;
  }, [navigation]);

  const toggleEdit = () => {
      setEdit(!edit);
  };

  const relocateToInitial = () => {
    if (mapref.current) {
      mapref.current.animateToRegion(initial,1000)
    }
  };

  const onViewChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const book = (num) => {
    if(num==1)
    {
      Alert.alert(
        'Book',
        'Are you sure you want to book the waste?',
        [
          {
            text: "Cancel",
          },
          {
            text: "Book",
            onPress: () => navigation.navigate('Recycle Bin'),
          },
        ]
      );
    }
    else if(num==2)
    {
      Alert.alert(
        'Collect',
        'Collect the waste?',
        [
          {
            text: "Cancel",
          },
          {
            text: "Collect",
            onPress: () => navigation.navigate('Jobs'),
          },
        ]
      );
    }
    else
    {
      Alert.alert(
        'Drop Job',
        'Are you sure you want to Drop the Job?',
        [
          {
            text: "Cancel",
          },
          {
            text: "Drop",
            onPress: () => navigation.navigate('Jobs'),
          },
        ]
      );
    }

  };

  const openGoogleMaps = () => {
    const latitude = initial.latitude;
    const longitude = initial.longitude;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

    Alert.alert(
      'Open Google Maps?',
      'Would you like to open Google Maps for directions?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Open',
          onPress: () => {
            Linking.canOpenURL(url)
              .then((supported) => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  Alert.alert('Error', 'Google Maps is not available.');
                }
              })
              .catch((err) => console.error('An error occurred', err));
          },
        },
      ],
    );
  };
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        role === 'seller' ? (
          <TouchableOpacity onPress={toggleEdit}>
            <FontAwesome name={edit ? 'save' : 'edit'} size={30} color='black' style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ) : null
      ),
    });
  }, [navigation, edit]);

  const wasteDict = {
    15276: { category: 'Gas Cylinder', description: 'Empty gas cylinder', estimatedWeight: 15 },
    15277: { category: 'Metal Pipe', description: 'Old metal pipe', estimatedWeight: 20 },
    15280: { category: 'Wooden Furniture', description: 'Damaged wooden chair', estimatedWeight: 25 },
    15281: { category: 'Wooden Furniture', description: 'Damaged wooden chair', estimatedWeight: 25 },
  };

  const [initial, setInitial] = useState({
    latitude: 9.9816,
    longitude: 76.2999,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageSlider}>
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={item} style={styles.image} resizeMode="cover" />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onViewableItemsChanged={onViewChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
          <View style={styles.indicatorContainer}>
            <Text style={styles.indicatorText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
          <TouchableOpacity style={styles.icon}>
            <FontAwesome name='copy' size={15} color='black'/>
          </TouchableOpacity>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Blah Plastic Waste and Cardboard Waste</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Estimated Weight: </Text>5kg
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Rate: </Text>120 Rs
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>{role === 'seller' ? 'Collector: ' : 'Seller: '}</Text>Antony Das
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Address: </Text>Ponnadiparambil House 179/A Near Mudukkad temple, Muppathadam PO
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Date: </Text>1:24 PM, 1/07/2024
          </Text>
        </View>

        <View style={styles.wasteContainer}>
          {role !== 'seller' && (
            <View style={styles.mapWrapper}>
              <MapView ref={mapref} style={styles.map} initialRegion={initial} showsUserLocation showsMyLocationButton>
                <Marker coordinate={initial} />
              </MapView>
              <TouchableOpacity onPress={openGoogleMaps} style={styles.getDirections}>
                <Text style={styles.getDirectionsText}>Get Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={relocateToInitial} style={styles.relocateIconContainer}>
                <FontAwesome name='location-arrow' size={25} color="black" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.categoryTitleContainer}>
            <Text style={styles.categoryTitle}>Categories</Text>
          </View>

          {Object.entries(wasteDict).map(([id, item]) => (
            <View key={id} style={styles.eachWaste}>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Category: </Text>{item.category}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Description: </Text>{item.description}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Estimated Weight: </Text>{item.estimatedWeight} kg
              </Text>
            </View>
          ))}
        </View>

        {role !== 'seller' && (
          previousScreen=='Recycle Bin'?
          <TouchableOpacity onPress={()=>book(1)} style={[styles.bookButton,{backgroundColor:'#e1e162'}]}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
          :
          <View style={{flexDirection:'row',backgroundColor:'white'}}>
            <TouchableOpacity onPress={()=>book(2)} style={[styles.bookButton,{backgroundColor:'#85dfa3',width:'50%'}]}>
              <Text style={styles.bookButtonText}>Collect</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>book(3)} style={[styles.bookButton,{backgroundColor:'#aeaead',width:'50%'}]}>
              <Text style={styles.bookButtonText}>Drop Job</Text>
            </TouchableOpacity>
          </View>

        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
  },
  imageSlider: {
    marginBottom: 20,
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: 300,
    overflow: 'hidden',
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  indicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  titleContainer: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 30,
    elevation: 5,
  },
  wasteContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    elevation: 5,
    marginBottom: 30,
  },
  mapWrapper: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    position:'relative'
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
  categoryTitleContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eachWaste: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
  bookButton: {
    padding: 15,
    alignItems: 'center',
  },
  bookButtonText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
  },
  icon: {
    position: 'absolute',
    right: 15,
    top:15,
    backgroundColor:'white',
    padding:8,
    borderRadius:10
  },
  relocateIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10, 
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 20,
    elevation: 2, 
  },
});
