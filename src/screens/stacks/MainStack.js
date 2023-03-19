import React, { useEffect } from 'react'
import AccountStack from './AccountStack';
import QuizStack from './QuizStack';
import HelpAndContactScreen from '../HelpAndContact';
import { createVerticalNavigator } from '../../components'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { fetchUser } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
import { fetchQuizzes } from '../../redux/quizzesSlice';
import { isMobile } from '../../assets/styles';

const Vertical = createVerticalNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchQuizzes());
  })

  if (isMobile) {
    return ( 
      <Tab.Navigator 
        initialRouteName='QuizStack'
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: [{}, null]
      }}
      >
        <Tab.Screen name="QuizStack" component={QuizStack} options={{
          headerShown: false,
          tabBarIcon: () => (<Icon name="pencil" color={'black'} size={25}/>)
        }}/>
        <Tab.Screen name="HelpAndContact" component={HelpAndContactScreen} options={{
          headerShown: false,
          tabBarIcon: () => (<Icon name="mail-outline" color={'black'} size={25}/>)
        }}/>
        <Tab.Screen name="AccountStack" component={AccountStack} options={{
          headerShown: false,
          tabBarIcon: () => (<Icon name="person-circle-outline" color={'black'} size={25}/>)
        }}/>

      </Tab.Navigator>
    )
  }

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
      <Vertical.Screen name="HelpAndContact" component={HelpAndContactScreen} options={{
        title: 'Help & Contact',
        tabBarIcon: <Icon name="mail-outline" color={'black'} size={25}/>
      }}/>
    </Vertical.Navigator>
  )
}

export default MainStack