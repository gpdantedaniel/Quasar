import React, { useState } from 'react'
import { Text, View, Image, TextInput, Platform } from 'react-native'
import { PrimaryButton, GhostButton} from '../components'
import designSystemStyles from '../assets/styles/index'

import { AuthErrorCodes, createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'

import * as Sentry from 'sentry-expo'

import toast from '../components/Toast/Notifications'

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName ] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUp = () => {
    const auth = getAuth(); 
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      setDoc(doc(getFirestore(), "users", userCredential.user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        creation: Timestamp.now(),
      }).catch((error) => {
        Platform.OS === 'web' 
        ? Sentry.Browser.captureException(error)
        : Sentry.Native.captureException(error)
      })
    }).catch((error) => {
      switch(error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
          toast.error('Invalid email. Did you write your email properly?');
          break;
        case AuthErrorCodes.WEAK_PASSWORD:
          toast.error('This password is weak! Make it at least 6 characters long please.');
          break;
        case AuthErrorCodes.EMAIL_EXISTS:
          toast.error('This email is already in use!');
          break;
        default:
          Platform.OS === 'web' 
          ? Sentry.Browser.captureException(error)
          : Sentry.Native.captureException(error)
          toast.error('Something went wrong. Please try again.')
          break;
      }
    })
  }
  
  return (
    <View style={designSystemStyles.container}>
      <View style={designSystemStyles.flexCentered}>
        <View style={designSystemStyles.contentColumn}>
          <View style={{gap: 10}}>
            <Image style={{width: 200, height: 40}} source={require('../assets/images/quasar_logo.png')}/>
            <Text style={designSystemStyles.heading}>Create your account</Text>
          </View>
          <TextInput style={designSystemStyles.GhostTextInput} placeholder={'First name'} onChangeText={(firstName) => setFirstName(firstName)}/>
          <TextInput style={designSystemStyles.GhostTextInput} placeholder={'Last name'} onChangeText={(lastName) => setLastName(lastName)}/>
          <TextInput style={designSystemStyles.GhostTextInput} placeholder={'Email'} onChangeText={(email) => setEmail(email)}/>
          <TextInput style={designSystemStyles.GhostTextInput} placeholder={'Password'} onChangeText={(password) => setPassword(password)} secureTextEntry={true}/>
          <PrimaryButton title='Sign up' onPress={() => onSignUp()}/>
          <Text style={{...designSystemStyles.bodyText}}>By signing up, you agree to our Terms and Privacy Policy.</Text>
          <Text 
            style={{...designSystemStyles.bodyText, textDecorationLine: 'underline'}} 
            onPress={() => navigation.navigate('HelpAndContact', {back: true})}>
              Help & Contact
          </Text>
        </View>
      </View>
      <GhostButton style={{alignSelf: 'center'}} title='<- Back' onPress={() => navigation.goBack()}/>

    </View>
  )
}

export default SignUp