import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton } from '../components'

import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { deleteUser, EmailAuthProvider, getAuth, reauthenticateWithCredential } from 'firebase/auth'

import { getFunctions, httpsCallable } from 'firebase/functions'
import { clearUser } from '../redux/userSlice'
import { clearQuiz } from '../redux/quizSlice'
import { clearQuizzes } from '../redux/quizzesSlice'
import { clearQuestions } from '../redux/questionsSlice'
import { getApp } from 'firebase/app'

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
          console.log(error);
        })
      }).catch((error) => {
        console.log(error);
      })
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
          <TextInput placeholder={'Password'} style={designSystemStyles.GhostTextInput} onChangeText={(password) => setPassword(password)} secureTextEntry={true}/>
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

 

export default DeleteAccount