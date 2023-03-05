import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton, PrimaryButton } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { resetProgress, updateLastTaken } from '../redux/quizSlice'

const QuizPreview = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const quiz = useSelector((state) => state.quiz);
  const questions = useSelector((state) => state.questions.questions);
  const completed = !(quiz.lastQuestionIndex < questions.length - 1);
  const dispatch = useDispatch();

  console.log('quiz: ', quiz);

  useEffect(() => {}, [quiz, questions]);

  const onResetProgress = () => {
    dispatch(resetProgress({user, quiz}))
  };


  const onStart = () => {
    // Update Timestamp for indexing purposes
    dispatch(updateLastTaken({user, quiz}));
    if (completed) {
      dispatch(resetProgress({user, quiz})).then(() => {
        navigation.navigate('Quiz');
      })
    } else {
      navigation.navigate('Quiz');
    }
  }


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
            Progress: {(quiz.lastQuestionIndex)} out of {questions.length} questions
          </Text>
          <View style={designSystemStyles.progressBar}>
            <View style={[designSystemStyles.progressFill, {width: `${progress}%`}]}/>
          </View>
          <Text style={designSystemStyles.bodyText}>
            Current mark: {(quiz.points)}/{questions.length}
          </Text>
          <View style={designSystemStyles.progressBar}>
            <View style={[designSystemStyles.progressFill, {width: `${mark}%`}]}/>
          </View>
          <Text style={[designSystemStyles.bodyText, {fontSize: 14, color: '#7c7c7c'}]}>
            Created February 14th, 2023 - Last taken February 16th, 2023
          </Text>
        </View>
        <PrimaryButton 
          title={(completed
          ? 'Restart'
          : (quiz.lastQuestionIndex > 0
            ? 'Resume'
            : 'Start')
            )
          }
          style={{width: 200}}
          onPress={() => onStart()}
        />
        <GhostButton title='Reset Quiz' style={{width: 200}} onPress={() => onResetProgress()}/>
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