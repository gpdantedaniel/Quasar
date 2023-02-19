import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton } from '../components'

const Account = () => {
  return (
    <View style={styles.container}>
      <Text style={{...designSystemStyles.heading, fontFamily: 'Inter-Bold',}}>My Account</Text> 
      <View style={{gap: 10,}}>
        <Text style={designSystemStyles.bodyText}>First name: Dante Daniel</Text>
        <Text style={designSystemStyles.bodyText}>Last name: Garcia Perez</Text>
        <Text style={designSystemStyles.bodyText}>Email: gp.dantedaniel@gmail.com</Text>
      </View>
      <GhostButton title='Change Password'/>
      <GhostButton title='Delete Account'/>
    </View>
  )
}

export default Account

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'center',
    gap: 20,
    padding: 50,
  }
})