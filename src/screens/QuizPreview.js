import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton, PrimaryButton } from '../components'
import { useSelector } from 'react-redux'

const QuizPreview = ({ navigation }) => {
  const quiz = useSelector((state) => state.quiz);
  const questions = useSelector((state) => state.questions.questions);

  // Calculate the ratio of the last question's index to the total number
  const progress = questions.length > 0 ? Number((quiz.lastQuestionIndex/questions.length*100).toPrecision(2)) : 0;
  // Calculate the ratio of points to the total number
  const mark = questions.length > 0 ? Number((quiz.points/questions.length*100).toPrecision(2)) : 0;

  return (
    <View style={styles.container}>
      <View style={{gap: 10}}>
        <View>
          <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>{quiz.name}</Text>
          <Text style={[designSystemStyles.subHeading, {color: '#7c7c7c'}]}>{quiz.topic}</Text>
        </View>
        <Text style={designSystemStyles.bodyText}>{quiz.description}</Text>
      </View>
      <View style={{borderBottomColor: 'black', borderBottomWidth: 1}}/>
      <View style={{flex: 1, gap: 20}}>
        <View style={{gap: 10}}>
          <Text style={designSystemStyles.bodyText}>
            Progress: 20 questions out of 25 answered
          </Text>
          <View style={designSystemStyles.progressBar}>
            <View style={[designSystemStyles.progressFill, {width: `${progress}%`}]}/>
          </View>
          <Text style={designSystemStyles.bodyText}>
            Current mark: 18/25
          </Text>
          <View style={designSystemStyles.progressBar}>
            <View style={[designSystemStyles.progressFill, {width: `${mark}%`}]}/>
          </View>
          <Text style={[designSystemStyles.bodyText, {fontSize: 14, color: '#7c7c7c'}]}>
            Created February 14th, 2023 - Last taken February 16th, 2023
          </Text>
        </View>
        <PrimaryButton title='Start' style={{width: 200}} onPress={() => navigation.navigate('Quiz')}/>
        <GhostButton title='Reset Quiz' style={{width: 200}}/>
        <GhostButton title='Edit Quiz' style={{width: 200}} onPress={() => navigation.navigate('EditQuiz')}/>
        <GhostButton title='Delete Quiz' style={{width: 200}}/>
      </View>
      <GhostButton title='<- Back' style={{width: 200}} onPress={() => navigation.goBack('Quizzes')}/>
    </View>
  )
}

export default QuizPreview

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