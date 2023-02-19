import { StyleSheet, Text, View, Image } from 'react-native'
import { GhostTextInput, PrimaryButton, GhostButton} from '../components'
import React from 'react'

import designSystemStyles from '../assets/styles/index'

const PasswordRecovery = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', gap: 20, alignItems: 'center', width: 300,}}>
        <View style={{gap: 10}}>
          <Image style={{width: 200, height: 40}} source={require('../assets/images/quasar_logo.png')}/>
          <Text style={designSystemStyles.heading}>Password Recovery</Text>
        </View>
        <GhostTextInput placeholder={'Email'}/>
        <PrimaryButton title={'Send link'} onPress={() => navigation.navigate('EmailSent')}/>
        <Text style={{...designSystemStyles.bodyText, textAlign: 'center'}}>We'll send you a link so that you may reset your password.</Text>
        <Text style={{...designSystemStyles.bodyText, textAlign: 'center', textDecorationLine: 'underline'}} onPress={() => navigation.navigate('PasswordRecovery')}>Help & Contact</Text>
      </View>
      <GhostButton style={{marginBottom: 40,}} title='<- Back' onPress={() => navigation.goBack()}/>
    </View>
  )
}

export default PasswordRecovery

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  }
})