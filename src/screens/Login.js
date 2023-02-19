import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import { GhostTextInput, PrimaryButton, GhostButton} from '../components'
import React, { useState } from 'react'

import designSystemStyles from '../assets/styles/index'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', gap: 20, alignItems: 'center'}}>
        <View style={{gap: 10}}>
          <Image style={{width: 200, height: 40}} source={require('../assets/images/quasar_logo.png')}/>
          <Text style={designSystemStyles.heading}>Studying Made Easy</Text>
        </View>

        <TextInput placeholder={'Email'} style={designSystemStyles.GhostTextInput} onChangeText={(email) => setEmail(email)}/>
        <TextInput placeholder={'Password'} style={designSystemStyles.GhostTextInput} onChangeText={(password) => setPassword(password)} secureTextEntry={true}/>
        <PrimaryButton title={'Login'} onPress={() => onLogin()}/>
        <Text style={{...designSystemStyles.bodyText, textDecorationLine: 'underline'}} onPress={() => navigation.navigate('PasswordRecovery')}>Forgot Password?</Text>
      </View>
      <GhostButton style={{marginBottom: 40,}} title='Create account' onPress={() => navigation.navigate('SignUp')}/>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  }
})