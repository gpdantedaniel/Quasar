import React, { useState } from 'react'
import { Text, View, TextInput } from 'react-native'
import { PrimaryButton, GhostButton} from '../components'

import designSystemStyles from '../assets/styles/index'
import { AuthErrorCodes, EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import Icon from 'react-native-vector-icons/Ionicons'
import toast from '../components/Toast/Notifications'

const PasswordResetAuth = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword ] = useState('');

  const onChangePassword = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    reauthenticateWithCredential(user, credential).then(() => {
      updatePassword(user, newPassword).then(() => {
        navigation.navigate('Account');
      }).catch((error) => {
        console.log(error);
        toast.error('Something went wrong. Please try again.')
      })
    }).catch((error) => {
      switch(error.code) {
        case AuthErrorCodes.INVALID_PASSWORD:
          toast.error('Wrong password. Did you type it in well?')
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
            <Icon name={'ios-key-outline'} size={120} color={'black'}/>
            <Text style={designSystemStyles.headingBold}>
              Change your password
            </Text>
            <Text style={designSystemStyles.bodyText}>
              To change your password, you must provide your current password.
            </Text>
          </View>
          <TextInput placeholder={'Current password'} style={designSystemStyles.GhostTextInput} onChangeText={(currentPassword) => setCurrentPassword(currentPassword)} secureTextEntry={true}/>
          <TextInput placeholder={'New password'} style={designSystemStyles.GhostTextInput} onChangeText={(newPassword) => setNewPassword(newPassword)} secureTextEntry={true}/>
          <PrimaryButton title={'Change password'} onPress={() => onChangePassword()}/>
          <Text style={{...designSystemStyles.bodyText, textAlign: 'center', textDecorationLine: 'underline'}} onPress={() => navigation.navigate('PasswordReset')}>
            Forgot password?
          </Text>
        </View>
      </View>
      <GhostButton style={{alignSelf: 'center'}} title='<- Back' onPress={() => navigation.goBack()}/>
    </View>
  )
}

export default PasswordResetAuth

