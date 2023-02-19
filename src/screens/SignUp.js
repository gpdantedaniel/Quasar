import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import { GhostTextInput, PrimaryButton, GhostButton} from '../components'
import React, { useState } from 'react'

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'

import designSystemStyles from '../assets/styles/index'




const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName ] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUp = () => {
    const auth = getAuth(); 
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      setDoc(doc(getFirestore(), "users", userCredential.user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        creation: Timestamp.now(),
      }).catch((error) => {
        console.log(error);
      })
    }).catch((error) => {
      console.log(error)
    })
  }


  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', gap: 20, alignItems: 'center', width: 300}}>
        <View style={{gap: 10}}>
          <Image style={{width: 200, height: 40}} source={require('../assets/images/quasar_logo.png')}/>
          <Text style={designSystemStyles.heading}>Create your account</Text>
        </View>
        <TextInput style={designSystemStyles.GhostTextInput} placeholder={'First name'} onChangeText={(firstName) => setFirstName(firstName)}/>
        <TextInput style={designSystemStyles.GhostTextInput} placeholder={'Last name'} onChangeText={(lastName) => setLastName(lastName)}/>
        <TextInput style={designSystemStyles.GhostTextInput} placeholder={'Email'} onChangeText={(email) => setEmail(email)}/>
        <TextInput style={designSystemStyles.GhostTextInput} placeholder={'Password'} onChangeText={(password) => setPassword(password)} secureTextEntry={true}/>
        <PrimaryButton title='Sign up' onPress={() => onSignUp()}/>
        <Text style={{...designSystemStyles.bodyText, textAlign: 'center'}}>By signing up, you agree to our Terms and Privacy Policy.</Text>
      </View>
      <GhostButton style={{marginBottom: 40}} title='<- Back' onPress={() => navigation.goBack()}/>

    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  }
})