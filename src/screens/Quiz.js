import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton } from '../components'

const Quiz = ({ route, navigation }) => {

  const quiz = route.params.quiz;
  
  return (
    <View style={designSystemStyles.container}>
       <View>
        <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>{quiz.name}</Text>
        <Text style={[designSystemStyles.subHeading, {color: '#7c7c7c'}]}>{quiz.topic}</Text>
      </View>
      <View style={{gap: 10}}>
        <Text style={designSystemStyles.bodyText}>
          Progress: 20 questions out of 25 answered
        </Text>
        <View style={designSystemStyles.progressBar}>
          <View style={[ designSystemStyles.progressFill, {width: '50%'}]}/>
        </View>
      </View>
      <View style={designSystemStyles.separator}/>
      <View style={{flex: 1}}>
        <Text style={designSystemStyles.bodyText}>Question 21: When was Quasar first developed?</Text>
      </View>
      <GhostButton title='<- Back' style={{width: 200}} onPress={() => navigation.goBack()}/>
    </View>
  )
}

export default Quiz

const styles = StyleSheet.create({})