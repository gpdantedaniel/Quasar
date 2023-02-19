import { StyleSheet, Text, View, Pressable} from 'react-native'
import React from 'react'

import Icon from 'react-native-vector-icons/Ionicons';

import { createVerticalNavigator } from '../../components'
import AccountScreen from '../Account';
import QuizStack from './QuizStack';

const Vertical = createVerticalNavigator();

const MainStack = () => {
  return (
    <Vertical.Navigator>
      <Vertical.Screen name="QuizStack" component={QuizStack} options={{
        title: 'Quizzes',
        tabBarIcon: <Icon name="pencil" color={'black'} size={25}/>
      }}/>
      <Vertical.Screen name="Account" component={AccountScreen} options={{
        tabBarIcon: <Icon name="person-circle-outline" color={'black'} size={25}/>
        }}/>
      <Vertical.Screen name="Help & Contact" component={AccountScreen} options={{
        tabBarIcon: <Icon name="mail-outline" color={'black'} size={25}/>
      }}/>
    </Vertical.Navigator>

  )
}

export default MainStack

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  }

})