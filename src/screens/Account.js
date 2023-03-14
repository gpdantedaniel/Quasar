import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton } from '../components'

import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

const Account = ({ navigation }) => {
  const user = useSelector((state) => state.user);

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
        </View>
      </View>
    </View>
  )
}

 

export default Account