import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton, PrimaryButton } from '../components'

const Quizzes = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>My Quizzes</Text>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20}}>
        <View style={{gap: 10, alignItems: 'center'}}>
          <Image source={require('../assets/images/desert_landscape.png')} style={{width: 300, height: 230}}/>
          <Text style={designSystemStyles.subHeading}>
            Need to study quickly for a test?
          </Text>
          <Text style={designSystemStyles.subHeading}>
            Create or open a quiz!
          </Text>
        </View>
        <PrimaryButton title='+ Create quiz' onPress={() => navigation.navigate('QuizCreation')}/>
        <GhostButton title='Open from device'/>
        <Text style={[designSystemStyles.bodyText, {color: '#666'}]}>Cloud storage coming soon!</Text>
      </View>
    </View>
  )
}

export default Quizzes

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