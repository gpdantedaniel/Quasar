import React, { useEffect, useState } from 'react'
import { Text, Touchable, View } from 'react-native'
import { GhostButton, PrimaryButton } from '../components'
import designSystemStyles from '../assets/styles'

import { useDispatch, useSelector } from 'react-redux'
import { clearQuiz, resetProgress, updateLastTaken } from '../redux/quizSlice'

import toast from 'react-hot-toast'
import { deleteQuiz } from '../redux/quizzesSlice'
import { TouchableOpacity } from 'react-native-web'
import { clearQuestions } from '../redux/questionsSlice'

const QuizPreview = ({ navigation }) => {
  const dispatch = useDispatch();
  const quiz = useSelector((state) => state.quiz);
  const questions = useSelector((state) => state.questions.questions);
  const [deleteArmed, setDeleteArmed] = useState(false);

  const creation = new Date(quiz.creation);
  const lastTaken = new Date(quiz.lastTaken);

  // Completed must always default to true if the last index is greater than the number of questions loaded
  const completed = !(quiz.lastQuestionIndex < questions.length);
  // Calculate the ratio of the last question's index to the total number of questions
  const progress = questions.length > 0 ? Number((quiz.lastQuestionIndex/questions.length*100)).toPrecision(3) : 0;
  // Calculate the ratio of points to the total number of questions
  const grade = questions.length > 0 ? Number((quiz.points/questions.length*100)).toPrecision(3) : 0;

  const onResetProgress = () => {
    const reset = dispatch(resetProgress({ quiz }));
    toast.promise(reset, {
      loading: 'Resetting quiz',
      success: 'Quiz reset!',
      error: 'Could not reset quiz',
    })
  };

  const onStart = async () => {
    // Warn the user that the quiz is empty
    if (questions.length === 0) {
      toast('This quiz is empty... Add some questions!', {icon: '🤔'})
      return
    }

    // Update Timestamp for indexing purposes
    await dispatch(updateLastTaken({ quiz }));
    completed ? await dispatch(resetProgress({ quiz })) : null;
    navigation.navigate('Quiz');
  }

  const onDelete = () => {
    console.log('executing delete');
    // Load screen before executing other operations
    navigation.navigate('Quizzes');

    const deleted = Promise.all([
      dispatch(deleteQuiz({ quiz })),
      dispatch(clearQuestions()),
      dispatch(clearQuiz()),
    ]);
    toast.promise(deleted, {
      loading: 'Deleting quiz...',
      success: 'Quiz deleted!',
      error: 'Could not delete quiz'
    })
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
        { deleteArmed ?
          <View style={designSystemStyles.panel}>
            <Text style={designSystemStyles.bodyText}>
              Are you sure you want to delete this quiz?
            </Text>
            <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
              <GhostButton title='Yes'style={{width: 150}} onPress={() => {onDelete(); setDeleteArmed(false)}}/>
              <GhostButton title='No' style={{width: 150}} onPress={() => setDeleteArmed(false)}/>
            </View>
          </View>
        : 
          <GhostButton title='Delete Quiz' style={{width: 200}} onPress={() => setDeleteArmed(true)}/> 
        }
        
        
      </View>
      <GhostButton title='<- Back' style={{width: 200}} onPress={() => navigation.goBack('Quizzes')}/>
    </View>
  )
}

export default QuizPreview