import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuizzesScreen from '../Quizzes';
import QuizCreationScreen from '../QuizCreation';
import EditQuizScreen from '../EditQuiz';

const Stack = createNativeStackNavigator();
const defaultScreenOptions = {headerShown: false,  animation: 'none'};

const QuizStack = () => {
  return (
    <Stack.Navigator initialRouteName='Quizzes'>
      <Stack.Screen name='Quizzes' component={QuizzesScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='QuizCreation' component={QuizCreationScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='EditQuiz' component={EditQuizScreen} options={defaultScreenOptions}/>
    </Stack.Navigator>
  )
}

export default QuizStack

const styles = StyleSheet.create({})