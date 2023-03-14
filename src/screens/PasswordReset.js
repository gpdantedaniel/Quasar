import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import { GhostTextInput, PrimaryButton, GhostButton} from '../components'
import React, { useState } from 'react'

import designSystemStyles from '../assets/styles/index'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

const PasswordReset = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const onReset = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email).then(() => {
      navigation.navigate('EmailSent')
    }).then((error) => {
      console.log(error);
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
          <TextInput placeholder={'Email'} style={designSystemStyles.GhostTextInput} onChangeText={(email) => setEmail(email)}/>
          <PrimaryButton title={'Send link'} onPress={() => onReset()}/>
          <Text style={{...designSystemStyles.bodyText, textAlign: 'center', width: 300}}>We'll send you a link so that you may reset your password.</Text>
          <Text style={{...designSystemStyles.bodyText, textAlign: 'center', textDecorationLine: 'underline'}} onPress={() => navigation.navigate('PasswordRecovery')}>Help & Contact</Text>
        </View>
      </View>
      <GhostButton style={{alignSelf: 'center'}} title='<- Back' onPress={() => navigation.goBack()}/>
    </View>
  )
}

export default PasswordReset