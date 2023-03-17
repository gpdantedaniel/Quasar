import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';

import { useFonts } from 'expo-font';
import designSystemStyles from './src/assets/styles/index'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login'
import SignUpScreen from './src/screens/SignUp';
import PasswordReset from './src/screens/PasswordReset';
import EmailSentScreen from './src/screens/EmailSent';
import MainStack from './src/screens/stacks/MainStack';
import HelpAndContactScreen from './src/screens/HelpAndContact';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics";
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { store } from './src/redux/store';
import { Provider } from 'react-redux';

import { Notifications } from './src/components/Toast/Notifications';

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
// const analytics = getAnalytics(app);
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
      <Provider store={store}>
        <NavigationContainer>
          <MainStack/>
        </NavigationContainer> 
        <Notifications/>
      </Provider>
    )
  }

  return (
    <View style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Login' component={LoginScreen} options={defaultScreenOptions}/>
          <Stack.Screen name='SignUp' component={SignUpScreen} options={defaultScreenOptions}/>
          <Stack.Screen name='PasswordReset' component={PasswordReset} options={defaultScreenOptions}/>
          <Stack.Screen name='EmailSent' component={EmailSentScreen} options={defaultScreenOptions}/>
          <Stack.Screen name='HelpAndContact' component={HelpAndContactScreen} options={defaultScreenOptions}/>

        </Stack.Navigator>
      </NavigationContainer>
      <Notifications/>
    </View>
  );
}
