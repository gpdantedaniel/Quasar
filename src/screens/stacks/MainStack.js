import React, { useEffect } from 'react'
import AccountStack from './AccountStack';
import QuizStack from './QuizStack';
import { createVerticalNavigator } from '../../components'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { fetchUser } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
import { fetchQuizzes } from '../../redux/quizzesSlice';

const Vertical = createVerticalNavigator();
// const Tab = createBottomTabNavigator();

const MainStack = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchQuizzes());
  })

  /*
  if (false) {
    return ( 
      <Tab.Navigator 
        initialRouteName='Quizzes'
        screenOptions={{
          tabBarShowLabel: false,
          // tabBarActiveTintColor: '#F2BE5C',
          // tabBarInactiveTintColor: 'white',
          tabBarStyle: [{}, null]
      }}
      >
        <Tab.Screen name="QuizStack" component={QuizStack} options={{
          headerShown: false,
          tabBarIcon: () => (<Icon name="pencil" color={'black'} size={25}/>)
        }}/>
        <Tab.Screen name="Account" component={AccountScreen} options={{
          headerShown: false,
          tabBarIcon: () => (<Icon name="person-circle-outline" color={'black'} size={25}/>)
          }}/>
        <Tab.Screen name="Help & Contact" component={AccountScreen} options={{
          headerShown: false,
          tabBarIcon: () => (<Icon name="mail-outline" color={'black'} size={25}/>)
        }}/>
      </Tab.Navigator>
    )
  }
  */

  return (
    <Vertical.Navigator>
      <Vertical.Screen name="QuizStack" component={QuizStack} options={{
        title: 'Quizzes',
        tabBarIcon: <Icon name="pencil" color={'black'} size={25}/>
      }}/>
      <Vertical.Screen name="AccountStack" component={AccountStack} options={{
        title: 'Account',
        tabBarIcon: <Icon name="person-circle-outline" color={'black'} size={25}/>
        }}/>
      <Vertical.Screen name="Help & Contact" component={AccountStack} options={{
        tabBarIcon: <Icon name="mail-outline" color={'black'} size={25}/>
      }}/>
    </Vertical.Navigator>
  )
}

export default MainStack