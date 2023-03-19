import { Platform, Text, View } from 'react-native'
import React from 'react'
import designSystemStyles, { isMobile } from '../assets/styles'
import { GhostButton } from '../components'

import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types';
import { getAuth, signOut } from 'firebase/auth'
import { clearUser } from '../redux/userSlice'
import { clearQuizzes } from '../redux/quizzesSlice'
import { clearQuiz } from '../redux/quizSlice'
import { clearQuestions } from '../redux/questionsSlice'

import * as Sentry from 'sentry-expo'

const Account = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const onSignout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      dispatch(clearUser());
      dispatch(clearQuizzes());
      dispatch(clearQuiz());
      dispatch(clearQuestions());
    }).catch((error) => {
      Platform.OS == 'web'
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    });
  }

  return (
    <View style={designSystemStyles.container}>
      <View style={designSystemStyles.flexCentered}>
        <View style={designSystemStyles.contentColumn}>
          <View style={{gap: 10}}>
            <Icon name={'person-circle-outline'} size={120} color={'black'}/>
            <Text style={designSystemStyles.headingBold}>My account</Text>
            <Text style={designSystemStyles.bodyText}>{user.firstName} {user.lastName}</Text>
            <Text style={designSystemStyles.bodyText}>{user.email}</Text>
          </View>
          <GhostButton title='Change Password' onPress={() => navigation.navigate('PasswordResetAuth')}/>
          <GhostButton title='Delete Account' onPress={() => navigation.navigate('DeleteAccount')}/>
          { isMobile ? 
          <GhostButton title='Logout' onPress={() =>  onSignout()}/>
          : null}
        </View>
      </View>
    </View>
  )
}

Account.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default Account
