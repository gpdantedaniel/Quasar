import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { GhostButton, PrimaryButton } from '../components'
import designSystemStyles from '../assets/styles'

import { useDispatch, useSelector } from 'react-redux'
import { resetProgress, updateLastTaken } from '../redux/quizSlice'

import toast from 'react-hot-toast'

const QuizPreview = ({ navigation }) => {
  const dispatch = useDispatch();
  const quiz = useSelector((state) => state.quiz);
  const questions = useSelector((state) => state.questions.questions);

  const creation = new Date(quiz.creation);
  const lastTaken = new Date(quiz.lastTaken);

  // Completed must always default to true if the last index is greater than the number of questions loaded
  const completed = !(quiz.lastQuestionIndex < questions.length);
  // Calculate the ratio of the last question's index to the total number of questions
  const progress = Number((quiz.lastQuestionIndex/questions.length*100)).toPrecision(3);
  // Calculate the ratio of points to the total number of questions
  const grade = Number((quiz.points/questions.length*100)).toPrecision(3);

  const onDelete = () => {
    console.log('deleting');
  }

  const onResetProgress = () => {
    const reset = dispatch(resetProgress({ quiz }));
    toast.promise(reset, {
      loading: 'Resetting quiz',
      success: 'Succesfully reset quiz!',
      error: 'Could not reset quiz',
    })
  };

  const onStart = async () => {
    // Update Timestamp for indexing purposes
    await dispatch(updateLastTaken({ quiz }));
    completed ? await dispatch(resetProgress({ quiz })) : null;
    navigation.navigate('Quiz');
  }

  return (
    <View style={designSystemStyles.container}>
      <View style={{gap: 10}}>
        <View>
          <Text style={[designSystemStyles.bigHeadingBold]}>{quiz.name}</Text>
          <Text style={[designSystemStyles.subHeading, {color: '#7c7c7c'}]}>{quiz.topic}</Text>
        </View>
        <Text style={designSystemStyles.bodyText}>{quiz.description}</Text>
      </View>
      <View style={{borderBottomColor: 'black', borderBottomWidth: 1}}/>
      <View style={{flex: 1, gap: 20}}>
        <View style={{gap: 10}}>
          <Text style={designSystemStyles.bodyText}>
            Progress: {(quiz.lastQuestionIndex)} out of {questions.length} questions ({progress}%)
          </Text>
          <View style={designSystemStyles.progressBar}>
            <View style={[designSystemStyles.progressFill, {width: `${progress}%`}]}/>
          </View>
          <Text style={designSystemStyles.bodyText}>
            Grade: {(quiz.points)}/{questions.length} ({grade}%)
          </Text>
          <View style={designSystemStyles.progressBar}>
            <View style={[designSystemStyles.progressFill, {width: `${grade}%`}]}/>
          </View>
          <Text style={[designSystemStyles.bodyText, {fontSize: 14, color: '#7c7c7c'}]}>
            Created {creation.toLocaleString('default', {dateStyle: 'full'})} - 
            Last taken {lastTaken.toLocaleString('default', {dateStyle: 'full'})}
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
        <GhostButton title='Delete Quiz' style={{width: 200}} onPress={() => onDelete()}/>
      </View>
      <GhostButton title='<- Back' style={{width: 200}} onPress={() => navigation.goBack('Quizzes')}/>
    </View>
  )
}

export default QuizPreview