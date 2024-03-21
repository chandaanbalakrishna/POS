// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import * as Location from 'expo-location';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const POLocation: React.FC = () => {
//   const [mapRegion, setMapRegion] = useState<any>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   useEffect(() => {
//     const userLocation = async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }
//       try {
//         const location = await Location.getCurrentPositionAsync({});
//         setMapRegion({
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         });
//       } catch (error) {
//         setErrorMsg('Error getting location: ' + error.message);
//       }
//     };

//     userLocation();
//   }, []);

//   if (!mapRegion || errorMsg) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       {errorMsg && <Text>{errorMsg}</Text>}
//       <View style={styles.mapContainer}>
//         <MapView style={styles.map} region={mapRegion} provider={PROVIDER_GOOGLE}>
//           <Marker
//             coordinate={{
//               latitude: mapRegion?.latitude,
//               longitude: mapRegion?.longitude,
//             }}
//             title="My Location"
//             description="This is my current location"
//           />
//         </MapView>
//       </View>
//     </View>
//   );
// };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   mapContainer: {
// //     width: '95%',
// //     height: 200,
// //     borderRadius: 10,
// //     overflow: 'hidden',
// //     bottom:30
// //   },
// //   map: {
// //     flex: 1,
// //     width: '100%',
// //     borderRadius: 10,
// //   },
// // });
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mapContainer: {
//     width: wp('95%'),
//     height: hp('28%'), // Adjust the percentage based on your needs
//     borderRadius: wp('2.5%'),
//     overflow: 'hidden',
//     bottom: hp('6%'), // Adjust the percentage based on your needs
//   },
//   map: {
//     flex: 1,
//     width: '100%',
//     borderRadius: wp('2.5%'),
//   },
// });

// export default POLocation;


import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native'; 

interface Props {
  setLoading: any; 
}

const POLocation: React.FC<Props> = ({setLoading}) => {
  const [mapRegion, setMapRegion] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationLoaded, setLocationLoaded] = useState<boolean>(false);

  useFocusEffect(() => {
    if (!locationLoaded) {
      userLocation();
      setLocationLoaded(true);
    }
  });
  
  const userLocation = async () => {
    debugger
    if (Platform.OS === 'android') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    } else if (Platform.OS === 'ios') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    }
  try {
    const location = await Location.getCurrentPositionAsync({});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  } catch (error) {
    setErrorMsg('Error getting location: ' + error.message);
  }
};
  if (!mapRegion || errorMsg) {
    setLoading(true)
    return <Text>Loading...</Text>;
  }else{
    setLoading(false)

  }

  return (
    <View style={styles.container}>
      {errorMsg && <Text>{errorMsg}</Text>}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={mapRegion} provider={PROVIDER_GOOGLE}>
          <Marker
            coordinate={{
              latitude: mapRegion?.latitude,
              longitude: mapRegion?.longitude,
            }}
            title="My Location"
            description="This is my current location"
          />
        </MapView>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    width: wp('95%'),
    height: hp('28%'), // Adjust the percentage based on your needs
    borderRadius: wp('2.5%'),
    overflow: 'hidden',
    bottom: hp('6%'), // Adjust the percentage based on your needs
  },
  map: {
    flex: 1,
    width: '100%',
    borderRadius: wp('2.5%'),
  },
});
export default POLocation;

