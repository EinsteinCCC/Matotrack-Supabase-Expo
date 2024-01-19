import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../App'; // Import the Supabase client
import * as Location from 'expo-location';
import saveLocationToSupabase from './SaveLocaion';

const RoleScreen = ({ route, navigation }) => {
  const { userRole } = route.params; // Get the user's role from the navigation params
  const { email } = route.params;
  const [delivers, setDelivers] = useState([]);


  useEffect(() => {
    // Fetch and set the list of delivers if the user is a "Client"
   
    if (userRole === 'Client') {
      fetchDelivers();
 
    } else {     watchLocation();} 
  }, [userRole, email]);

  const fetchDelivers = async () => {
    try {
      // Fetch delivers from your Supabase database
      const { data, error } = await supabase.from('users').select('email').eq('role', 'Deliver');
      if (error) {
        console.error('Error fetching delivers:', error.message);
      } else {
        setDelivers(data);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  const watchLocation = async () => {
    console.log('connected with supabase');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
      }

      const locationListener = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Update every 1000 milliseconds (1 second)
          distanceInterval: 0, // Update regardless of distance traveled
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          saveLocationToSupabase(email, latitude, longitude);
        }
      );

      // To stop watching the location updates, you can call locationListener.remove();
    } catch (error) {
      console.error('Error watching location:', error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text>Welcome to Dash</Text>
      {userRole === 'Client' && (
        <FlatList
          data={delivers}
          keyExtractor={(item) => (item.id ? item.id.toString() : item.email)}
          renderItem={({ item }) => (
            <View style={styles.deliverItem}>
              <TouchableOpacity onPress={() => navigation.navigate('Map', {email: item.email})}>
                <Text>{item.email}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliverItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 10,
  },
});

export default RoleScreen;