import { StyleSheet, Text, View } from 'react-native'
import React, { useState }from 'react'
import designSystemStyles from '../assets/styles'
import { TextInput } from 'react-native-web'
import { GhostButton, PrimaryButton } from '../components'

import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";

import { useSelector, useDispatch } from 'react-redux'
import { addQuestions, loadQuiz } from '../redux/quizSlice'
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { addQuestion } from '../redux/questionsSlice'

import { createQuiz } from '../redux/quizzesSlice'

import toast from 'react-hot-toast';


const QuizCreation = ({ navigation }) => {
  const [processing, setProcessing] = useState(false);
  const [baseText, setBaseText] = useState('');
  const dispatch = useDispatch();

  const onCreateQuiz = () => {

    if (baseText === '') {
      toast('Put in some text first!');
      return
    } 

    try {
      setProcessing(true);
      const functions = getFunctions(getApp());
      const generateQuiz = httpsCallable(functions, 'generateQuiz');
      
      generateQuiz({baseText: baseText}).then(async(result) => {
        const data = JSON.parse(result.data);
        const questions = data.questions;
        const descriptors = data.descriptors;
        
        console.log(questions);
        console.log(descriptors);

        const creation = await dispatch(createQuiz({ descriptors }));
        const quiz = creation.payload;
        console.log('quiz: ', quiz)
        
        dispatch(loadQuiz({ quiz }));
        await questions.forEach(async (question) => {
          await dispatch(addQuestion({ quiz, data: question }))
        })

        navigation.navigate('QuizPreview');
      }).catch((error) => {
        console.log(error);
      })

    } catch(error) { 
      toast.error('Could not generate quiz... Try again later');
      setProcessing(false);

      console.log(error) 
    }
  }


  if (processing) { return (
    <View style={designSystemStyles.container}>
      <View style={{gap: 10}}>
        <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>Creating Quiz</Text>
        <Text style={designSystemStyles.subHeading}>Please wait while your quiz is being created. Do not close this window.</Text>
      </View>
      <View style={{borderBottomColor: 'black', borderBottomWidth: 1}}/>
      <View style={{flex: 1}}/>
    </View>
  )}

  return (
    <View style={designSystemStyles.container}>
      <View style={{gap: 10}}>
        <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>Quiz Creation</Text>
        <Text style={designSystemStyles.subHeading}>Add your text in the box below and we’ll turn it into questions!</Text>
      </View>
      <TextInput
        editable
        multiline
        autoComplete={false}
        autoCorrect={false}
        style={[designSystemStyles.bodyText, designSystemStyles.inputTextBox]}
        onChangeText={(baseText) =>  setBaseText(baseText)}
      />
      <View style={{flexDirection: 'row', gap: 20}}>
        <PrimaryButton title='Submit' style={{width: 200}} onPress={() => onCreateQuiz()}/>
        <GhostButton title='Create from scratch' style={{width: 200}}/>
      </View>
      <GhostButton title='<- Back' style={{width: 200}} onPress={() => navigation.goBack()}/>
    </View> 
  )
}

export default QuizCreation