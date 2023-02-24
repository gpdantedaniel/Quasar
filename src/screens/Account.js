import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton } from '../components'

import { useSelector } from 'react-redux'
import { selectUserState } from '../redux/userSlice'

const Account = () => {
  const user = useSelector((state) => state.user);
  console.log('user: ', user);

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={{...designSystemStyles.heading, fontFamily: 'Inter-Bold',}}>My Account</Text> 
        <View style={{gap: 10,}}>
          <Text style={designSystemStyles.bodyText}>First name: {user.firstName}</Text>
          <Text style={designSystemStyles.bodyText}>Last name: {user.lastName}</Text>
          <Text style={designSystemStyles.bodyText}>Email: {user.email}</Text>
        </View>
        <GhostButton title='Change Password'/>
        <GhostButton title='Delete Account'/>
      </View>
    )
  }
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