import { Text, View, Image, TextInput } from 'react-native'
import { PrimaryButton, GhostButton} from '../components'
import React, { useState } from 'react'

import designSystemStyles from '../assets/styles/index'
import { getAuth, signInWithEmailAndPassword,AuthErrorCodes } from 'firebase/auth'
import toast from '../components/Toast/Notifications'

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
    signInWithEmailAndPassword(auth, email, password).then((result) => {
      console.log(result);
    }).catch((error) => {
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

export default Login