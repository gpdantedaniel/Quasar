import React, { useState } from 'react'
import { Text, View, Image, TextInput, Platform } from 'react-native'
import { PrimaryButton, GhostButton} from '../components'
import toast from '../components/Toast/Notifications'

import designSystemStyles from '../assets/styles/index'
import { getAuth, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth'

import * as Sentry from 'sentry-expo';

import PropTypes from 'prop-types'

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {

    if (email === '') { 
      toast.error('Please provide an email!');
      return
    }

    if (password === '') {
      toast.error('Please provide a password!');
      return
    }

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      switch(error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
          toast.error('Invalid email. Did you type it in well?')
          break;
        case AuthErrorCodes.INVALID_PASSWORD:
          toast.error('Wrong password. Did you type it in well?')
          break;
        case AuthErrorCodes.USER_DELETED:
          toast.error('Email not found. Did you type it in well?')
          break;
        default:
          Platform.OS === 'web' 
          ? Sentry.Browser.captureException(error)
          : Sentry.Native.captureException(error)
          toast.error('Something went wrong. Please try again.')
          break;
      }
    });
  }

  return (
    <View style={designSystemStyles.container}>
      <View style={designSystemStyles.flexCentered}>
        <View style={designSystemStyles.contentColumn}>
          <View style={{gap: 10}}>
            <Image style={{width: 200, height: 40}} source={require('../assets/images/quasar_logo.png')}/>
            <Text style={designSystemStyles.heading}>Studying Made Easy</Text>
          </View>
            <TextInput placeholder={'Email'} style={designSystemStyles.GhostTextInput} onChangeText={(email) => setEmail(email)}/>
            <TextInput placeholder={'Password'} style={designSystemStyles.GhostTextInput} onChangeText={(password) => setPassword(password)} secureTextEntry={true}/>
            <PrimaryButton title={'Login'} onPress={() => onLogin()}/>
            <Text style={{...designSystemStyles.bodyText, textDecorationLine: 'underline'}} onPress={() => navigation.navigate('PasswordReset')}>Forgot Password?</Text>
        </View>
      </View>
      <GhostButton style={{alignSelf: 'center'}} title='Create account' onPress={() => navigation.navigate('SignUp')}/>
    </View>
  )
}

Login.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default Login