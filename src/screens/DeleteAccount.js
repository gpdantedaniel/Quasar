import { Platform, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton } from '../components'
import Icon from 'react-native-vector-icons/Ionicons'

import { AuthErrorCodes, deleteUser, EmailAuthProvider, getAuth, reauthenticateWithCredential } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getApp } from 'firebase/app'

import * as Sentry from 'sentry-expo';

import { useDispatch } from 'react-redux'
import { clearUser } from '../redux/userSlice'
import { clearQuiz } from '../redux/quizSlice'
import { clearQuizzes } from '../redux/quizzesSlice'
import { clearQuestions } from '../redux/questionsSlice'

import toast from '../components/Toast/Notifications'

import PropTypes from 'prop-types';

const DeleteAccount = ({ navigation }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');

  const onDeleteAccount = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);

    const functions = getFunctions(getApp());
    const deleteUserData = httpsCallable(functions, 'deleteUserData');
    
    reauthenticateWithCredential(user, credential).then(() => {
      // Delete the data first as auth is required
      deleteUserData().then(() => {
        // The app should redirect the user to non-authenticated screens
        deleteUser(user).then(() => {
          dispatch(clearUser());
          dispatch(clearQuiz());
          dispatch(clearQuizzes());
          dispatch(clearQuestions());
        }).catch((error) => {
          Platform.OS === 'web' 
          ? Sentry.Browser.captureException(error)
          : Sentry.Native.captureException(error)
        })
      }).catch((error) => {
        Platform.OS === 'web' 
        ? Sentry.Browser.captureException(error)
        : Sentry.Native.captureException(error)
        toast.error('Something went wrong. Please try again.')
      })
    }).catch((error) => {
      switch(error.code) {
        case AuthErrorCodes.INVALID_PASSWORD:
          toast.error('Wrong password. Did you type it in well?')
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
            <Icon name={'warning-outline'} size={120} color={'black'}/>
            <Text style={designSystemStyles.headingBold}>Delete your account</Text>
            <Text style={designSystemStyles.bodyText}>To delete your account, you must provide your password</Text>
          </View>
          <TextInput placeholder={'Password'} style={designSystemStyles.GhostTextInput} onChangeText={(password) => setPassword(password)} secureTextEntry={true} autoCorrect={false}/>
          <GhostButton title='Delete Account' onPress={() => onDeleteAccount()}/>
          <Text style={{...designSystemStyles.bodyText, textAlign: 'center', textDecorationLine: 'underline'}} onPress={() => navigation.navigate('PasswordReset')}>
            Forgot password?
          </Text>
        </View>
      </View>
      <GhostButton style={{alignSelf: 'center'}} title='<- Back' onPress={() => navigation.goBack()}/>
    </View>
  )
}

DeleteAccount.propTypes = {
  navigation: PropTypes.object.isRequired
}
 

export default DeleteAccount