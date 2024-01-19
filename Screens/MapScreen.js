import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker,Polyline } from 'react-native-maps';
import { supabase } from '../App'; // Import your Supabase client instance

const MapScreen = ({ route }) => {
  const { email } = route.params;
  const [location, setLocation] = useState({
    latitude: 41.3874,
    longitude:  2.1686  ,
    latitudeDelta: 0.005,
    longitudeDelta:0.005,
  });
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);


  useEffect(() => {
    // Set up Supabase real-time subscription
 
        const channels = supabase.channel('custom-update-channel')
        .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users' },
        (payload) => {
            const { new: updatedLocation } = payload;
            if (updatedLocation.email === email) {
                const newCoordinates = {
                    latitude: updatedLocation.latitude,
                    longitude: updatedLocation.longitude,
                  }
            setLocation({
                latitude: updatedLocation.latitude,
                longitude: updatedLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setPolylineCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinates]);
            }
           
        }
        )
        .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [email]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={MapView.PROVIDER_GOOGLE}
        region={location}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title="Deliver"
          description="real time location"
        />
        <Polyline
          coordinates={polylineCoordinates}
          strokeWidth={3}
          strokeColor="red"
          lineCap="round"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;