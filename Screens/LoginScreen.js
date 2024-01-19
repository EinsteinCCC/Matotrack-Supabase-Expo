import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity  } from 'react-native';
import { supabase } from '../App'; 
import * as Crypto from 'expo-crypto';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {
      try {
        // Check if the user exists in the 'users' table    
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('email', email);

        if (error) {
          console.error('Error signing in:', error.message);
        } else {
          if (data.length > 0) {
       
            const user = data[0];
            // Extract the hashed password from the fetched user
            const hashedPasswordFromDatabase = user.password;
    
            // Compare the entered password with the hashed password from the database
            const passwordMatches = await Crypto.digestStringAsync(
              Crypto.CryptoDigestAlgorithm.SHA256,
              password
            ) === hashedPasswordFromDatabase;
    
            if (passwordMatches) {
              
              Toast.show({
                type: 'error',
                text1: 'Invalid Password',
                text2: 'The entered password is incorrect.',
              });
              // Navigate to the next screen or perform any other action
              const userRole = user.role;
              navigation.navigate('Role', { userRole, email });
            } else {
              console.log('Invalid password');
            }
          } 
           else {
            console.log('Invalid email or password');
          }
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
  };

  return (
    <View style={styles.container}>
      <Text>Type your email and password</Text>
      <TextInput
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Button  title="Login" onPress={handleLogin} />
      <View style={styles.middle}>
        <Text>You don't have got account?   </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerTxt}>Register</Text>
        </TouchableOpacity>
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
  middle: {
    marginTop:20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerTxt:{
   color: 'red'
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
  },
});

export default LoginScreen;