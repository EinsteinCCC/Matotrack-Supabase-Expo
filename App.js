import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import LoginScreen from "./Screens/LoginScreen";
import RoleScreen from "./Screens/RoleScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import MapScreen from "./Screens/MapScreen";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// Initialize Supabase client
//Kevins credentials
//const supabaseUrl = "https://wpilreiyigroeqmsedas.supabase.co"; //Kevin's old
//const supabaseKey =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWxyZWl5aWdyb2VxbXNlZGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMyNjE5MDQsImV4cCI6MjAxODgzNzkwNH0.qH8KwmprW3BqDsUc4K3aUhMVgqMOxsk32FZFVG_Xr4I"; //Kevin's

//Albert credentials
const supabaseUrl = "https://mruhzeblyqjgcqveznrb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydWh6ZWJseXFqZ2NxdmV6bnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0MTc2NjAsImV4cCI6MjAyMDk5MzY2MH0.Bma3CHhEgJVTNDvv2z90hwU3_JSv5VWT70Xikb8Asz4";

export const supabase = createClient(supabaseUrl, supabaseKey);

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Role" component={RoleScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
