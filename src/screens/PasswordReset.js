import { Text, View, Image, TextInput, Platform } from 'react-native'
import { PrimaryButton, GhostButton} from '../components'
import React, { useState } from 'react'

import designSystemStyles from '../assets/styles/index'
import { AuthErrorCodes, getAuth, sendPasswordResetEmail } from 'firebase/auth'
import toast from '../components/Toast/Notifications';

import * as Sentry from 'sentry-expo'

import PropTypes from 'prop-types'

const PasswordReset = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const onReset = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email).then(() => {
      navigation.navigate('EmailSent')
    }).catch((error) => {
      switch(error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
          toast.error('Invalid email. Did you type it in well?')
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
    })
  } 

  return (
    <View style={designSystemStyles.container}>
      <View style={designSystemStyles.flexCentered}>
        <View style={designSystemStyles.contentColumn}>
          <View style={{gap: 10, alignItems: 'center'}}>
            <Image style={{width: 200, height: 40}} source={require('../assets/images/quasar_logo.png')}/>
            <Text style={designSystemStyles.heading}>Reset your password</Text>
          </View>
          <TextInput placeholder={'Email'} style={designSystemStyles.GhostTextInput} onChangeText={(email) => setEmail(email)} autoCorrect={false}/>
          <PrimaryButton title={'Send link'} onPress={() => onReset()}/>
          <Text style={{...designSystemStyles.bodyText, textAlign: 'center', width: 300}}>
            We&#39;ll send you a link so that you may reset your password.
          </Text>
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

PasswordReset.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default PasswordReset