import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../App'
import Toast from 'react-native-toast-message';
import * as Crypto from 'expo-crypto';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = ({navigation}) => {
  const [email, setEamil] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirmpassword, setConfirmpassword] = useState('');
  const [role, setRole] = useState('Client');

  const handleRegister = async  () => {
    if(password == confirmpassword){
       try {
        const hashedPassword = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          password
        );
        // Insert user into the 'users' table
        const { data, error } = await supabase
          .from('users')
          .upsert([{ email, password: hashedPassword, role }], { onConflict: ['email'] });

        if (error) {
          console.error('Error registering user:', error.message);
        } else {
          Toast.show({
            type: 'Success',
            text1: 'Saved',
            text2: 'Welcome',
          });
          // Navigate to the next screen or perform any other action
          const userRole = role;
          navigation.navigate('Role', { userRole, email });
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    } else {
      console.log('Password missmatch');
      Alert.alert('Password Mismatch', 'The entered passwords do not match.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Register Screen</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Client" value="Client" />
        <Picker.Item label="Deliver" value="Deliver" />
      </Picker>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEamil(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="ConfirmPassword"
        value={confirmpassword}
        onChangeText={(text) => setConfirmpassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
  },
  picker: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
  },
});

export default RegisterScreen;