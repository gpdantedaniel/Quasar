import React, { useState } from 'react'
import { Text, View, TextInput } from 'react-native'
import { GhostButton, PrimaryButton } from '../components'
import designSystemStyles from '../assets/styles'

import { getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

import { useDispatch } from 'react-redux'
import { createQuiz } from '../redux/quizzesSlice'
import { loadQuiz } from '../redux/quizSlice'
import { addQuestion } from '../redux/questionsSlice'

import toast from 'react-hot-toast';

const QuizCreation = ({ navigation }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);

  const functions = getFunctions(getApp());
  const generateQuiz = httpsCallable(functions, 'generateQuiz');

  const onCreateQuiz = () => {
    if (input === '') {
      toast('Put some text in first!');
      return
    }
    setProcessing(true);

    try {
      const create = async() => {
        const result = await generateQuiz({baseText: input});
        const descriptors = result.data.descriptors;
        const questions = result.data.questions;

        const quizCreation = await dispatch(createQuiz({ descriptors }));
        const quiz = quizCreation.payload;

        await dispatch(loadQuiz({ quiz }));
        await Promise.all(questions.map((question) => 
          // Await all the questions before moving on
          dispatch(addQuestion({ quiz, data: question }))
        ));

        return
      }

      // This should be a promise
      const creation = create();
      creation.then(() => {
        setProcessing(false);
        navigation.navigate('QuizPreview');
      }).catch((error) => {
        console.log(error);
        setProcessing(false);
      })
            
      toast.promise(creation, {
        loading: 'Creating quiz',
        success: 'Quiz ready!',
        error: 'Could not generate quiz. Try again later'
      })

    } catch(error) {
      console.log(error);
      toast.error('Could not generate quiz. Try again later');
      setProcessing(false);
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
        onChangeText={(input) =>  setInput(input)}
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