import React, { useEffect } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuizzesScreen from '../Quizzes';
import QuizCreationScreen from '../QuizCreation';
import EditQuizScreen from '../EditQuiz';
import QuizPreviewScreen from '../QuizPreview';
import QuizScreen from '../Quiz';
import { useDispatch, useSelector } from 'react-redux';
import { reflectQuizUpdates } from '../../redux/quizzesSlice';

const Stack = createNativeStackNavigator();
const defaultScreenOptions = {headerShown: false,  animation: 'none'};

const QuizStack = () => {
  const dispatch = useDispatch();
  const quiz = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(reflectQuizUpdates({ quiz }))
  }, [quiz])

  return (
    <Stack.Navigator initialRouteName='Quizzes'>
      <Stack.Screen name='Quizzes' component={QuizzesScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='QuizCreation' component={QuizCreationScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='EditQuiz' component={EditQuizScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='QuizPreview' component={QuizPreviewScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='Quiz' component={QuizScreen} options={defaultScreenOptions}/>
    </Stack.Navigator>
  )
}

export default QuizStack