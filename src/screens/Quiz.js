import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton } from '../components'
import { useSelector } from 'react-redux'

const Quiz = ({ route, navigation }) => {

  const user = useSelector((state) => state.user)
  const quiz = useSelector((state) => state.quiz);
  const questions = useSelector((state) => state.questions.questions);
  
  const progress = Number((quiz.lastQuestionIndex + 1)/questions.length*100).toPrecision(3);

  console.log('user: ', user);
  console.log('quiz: ', quiz);
  console.log('questions: ', questions);
  
  return (
    <View style={designSystemStyles.container}>
       <View>
        <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>{quiz.name}</Text>
        <Text style={[designSystemStyles.subHeading, {color: '#7c7c7c'}]}>{quiz.topic}</Text>
      </View>
      <View style={{gap: 10}}>
        <Text style={designSystemStyles.bodyText}>
          Progress: {(quiz.lastQuestionIndex + 1)} out of {questions.length} questions
        </Text>
        <View style={designSystemStyles.progressBar}>
          <View style={[ designSystemStyles.progressFill, {width: `${progress}%`}]}/>
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