import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GhostButton, GhostTextInput, PrimaryButton } from './src/components';


import { useFonts } from 'expo-font';
import designSystemStyles from './src/assets/styles/index'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login'
import SignUpScreen from './src/screens/SignUp';
import PasswordRecoveryScreen from './src/screens/PasswordRecovery';
import EmailSentScreen from './src/screens/EmailSent';
import MainStack from './src/screens/stacks/MainStack';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics";
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

import { Toaster } from 'react-hot-toast';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKBxuS5jYBz7Glk_zcIMXBxH9w6N11WDI",
  authDomain: "quasar-9e1cf.firebaseapp.com",
  projectId: "quasar-9e1cf",
  storageBucket: "quasar-9e1cf.appspot.com",
  messagingSenderId: "607423668359",
  appId: "1:607423668359:web:5e67dab4e58acf0e375822",
  measurementId: "G-4W2MFZD4KR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app);
connectFunctionsEmulator(functions, 'localhost', 5001);

const Stack = createNativeStackNavigator();
const defaultScreenOptions = {headerShown: false,  animation: 'none'};

export default function App() {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [fontsLoaded] = useFonts({
    'Inter-Bold': require('./src/assets/fonts/Inter/Inter-Bold.otf'),
    'Inter-Regular': require('./src/assets/fonts/Inter/Inter-Regular.otf')
  });  

  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthLoaded(true);
        setLoggedIn(true);
      } else {
        setAuthLoaded(true);
        setLoggedIn(false);
      }
    })
  }, [auth])

  // Make sure Auth & Fonts are loaded
  if (!authLoaded || !fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (loggedIn) {
    return (
      <View style={{flex: 1}}>
        <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            ...designSystemStyles.bodyText, 
            ...designSystemStyles.toast
          }
        }}/>
        <Provider store={store}>
          <NavigationContainer>
            <MainStack/>
          </NavigationContainer>    
        </Provider>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={LoginScreen} options={defaultScreenOptions}/>
        <Stack.Screen name='SignUp' component={SignUpScreen} options={defaultScreenOptions}/>
        <Stack.Screen name='PasswordRecovery' component={PasswordRecoveryScreen} options={defaultScreenOptions}/>
        <Stack.Screen name='EmailSent' component={EmailSentScreen} options={defaultScreenOptions}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
});
