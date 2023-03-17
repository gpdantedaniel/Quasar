import React from 'react'
import { Text, View, } from 'react-native'
import { GhostButton} from '../components'
import Icon from 'react-native-vector-icons/Ionicons'
import designSystemStyles from '../assets/styles/index'

const HelpAndContact = ({ navigation, route }) => {
  const back = route.params ? route.params.back : false;
  return (
    <View style={designSystemStyles.container}>
      <View style={designSystemStyles.flexCentered}>
        <View style={designSystemStyles.contentColumn}>
          <Icon name="mail-outline" color={'black'} size={120}/>
          <View style={{gap: 10}}>
            <Text style={designSystemStyles.headingBold}>Help & contact</Text>
            <Text style={designSystemStyles.bodyText}>Do you have questions? Contact us at the email below!</Text>
          </View>
          <Text style={designSystemStyles.subHeading}>help@quasarapp.ca</Text>
        </View>
      </View>
      { back ? <GhostButton style={{alignSelf: 'center'}} title='<- Back' onPress={() => navigation.goBack()}/> : null}
    </View>
  )
}

export default HelpAndContact
