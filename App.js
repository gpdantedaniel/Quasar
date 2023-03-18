import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

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
import { getAnalytics, isSupported } from "firebase/analytics";
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

import * as Sentry from 'sentry-expo';

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
const analytics = isSupported() ? getAnalytics(app) : null;
const functions = getFunctions(app);

// DISABLE IN PRODUCTION
// connectFunctionsEmulator(functions, 'localhost', 5001);
// self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LcojA0lAAAAAHAYiBkcdg-tF6HNa6Bn71W5qKvM'),
  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true
});

Sentry.init({
  dsn: 'https://4497bf8e61014fc8995b2d0b45b64908@o4504855325114368.ingest.sentry.io/4504855332519936',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

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
