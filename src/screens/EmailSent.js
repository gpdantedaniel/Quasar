import { StyleSheet, Text, View, Image } from 'react-native'
import { GhostTextInput, PrimaryButton, GhostButton} from '../components'
import React from 'react'

import Icon from 'react-native-vector-icons/Ionicons'
import designSystemStyles from '../assets/styles/index'

const EmailSent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', gap: 20, alignItems: 'center', width: 300}}>
        <Icon name="mail-outline" color={'black'} size={120}/>
        <View style={{gap: 10}}>
          <Text style={{...designSystemStyles.heading, fontFamily: 'Inter-Bold', textAlign: 'center'}}>Check your mail</Text>
          <Text style={{...designSystemStyles.bodyText, textAlign: 'center'}}>We sent you a link! Make sure it didn’t end up in your spam.</Text>
        </View>
        <PrimaryButton style={{marginBottom: 40,}} title='Back to login' onPress={() => navigation.popToTop()}/>
      </View>
    </View>
  )
}

export default EmailSent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  }
})