import { Text, View } from 'react-native'
import { PrimaryButton } from '../components'
import React from 'react'

import Icon from 'react-native-vector-icons/Ionicons'
import designSystemStyles from '../assets/styles/index'

import PropTypes from 'prop-types'

const EmailSent = ({ navigation }) => {
  return (
    <View style={designSystemStyles.container}>
      <View style={designSystemStyles.flexCentered}>
        <View style={designSystemStyles.contentColumn}>
          <Icon name="mail-outline" color={'black'} size={120}/>
          <View style={{gap: 10}}>
            <Text style={designSystemStyles.headingBold}>Check your mail</Text>
            <Text style={designSystemStyles.bodyText}>We sent you a link! Make sure it didn’t end up in your spam.</Text>
          </View>
          <PrimaryButton title='Back to login' onPress={() => navigation.popToTop()}/>
        </View>
      </View>
    </View>
  )
}

EmailSent.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default EmailSent