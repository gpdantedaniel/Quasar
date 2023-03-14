import React, { useEffect } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../Account';
import PasswordResetAuthScreen from '../PasswordResetAuth';
import PasswordResetScreen from '../PasswordReset'
import DeleteAccountScreen from '../DeleteAccount';

const Stack = createNativeStackNavigator();
const defaultScreenOptions = {headerShown: false}

const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName='Account'>
      <Stack.Screen name='Account' component={AccountScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='PasswordResetAuth' component={PasswordResetAuthScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='PasswordReset' component={PasswordResetScreen} options={defaultScreenOptions}/>
      <Stack.Screen name='DeleteAccount' component={DeleteAccountScreen} options={defaultScreenOptions}/>
    </Stack.Navigator>
  )
}

export default AccountStack