import React, { useEffect } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuizzesScreen from '../Quizzes';
import QuizCreationScreen from '../QuizCreation';
import EditQuizScreen from '../EditQuiz';
import QuizPreviewScreen from '../QuizPreview';
import QuizScreen from '../Quiz';
import { useDispatch, useSelector } from 'react-redux';
import { reflectQuizUpdates } from '../../redux/quizzesSlice';
import designSystemStyles, { isMobile } from '../../assets/styles';

const Stack = createNativeStackNavigator();
const defaultScreenOptions = {headerShown: false,  animation: 'none'};

const QuizStack = () => {
  const dispatch = useDispatch();
  const quiz = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(reflectQuizUpdates({ quiz }))
  }, [quiz])

  return (
    <Stack.Navigator
      initialRouteName='Quizzes'
      screenOptions={{
        headerTitleStyle: designSystemStyles.subHeading,
        headerStyle: {borderBottomColor: !isMobile ? '#fff' : '#d8d8d8'}
      }}>
      <Stack.Screen name='Quizzes' component={QuizzesScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='QuizCreation' component={QuizCreationScreen} options={{title: 'Quiz Creation'}}/>
      <Stack.Screen name='EditQuiz' component={EditQuizScreen} options={{title: 'Edit Quiz'}}/>
      <Stack.Screen name='QuizPreview' component={QuizPreviewScreen} options={{title: 'Quiz Preview'}}/>
      <Stack.Screen name='Quiz' component={QuizScreen} options={{title: 'Quiz'}}/>
    </Stack.Navigator>
  )
}

export default QuizStack