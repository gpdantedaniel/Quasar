import React, { useState, } from 'react'
import { Text, View, TextInput, Platform } from 'react-native'
import { GhostButton, PrimaryButton } from '../components'
import designSystemStyles, { isMobile } from '../assets/styles'

import { getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

import * as Sentry from 'sentry-expo';

import { useDispatch } from 'react-redux'
import { createQuiz } from '../redux/quizzesSlice'
import { loadQuiz } from '../redux/quizSlice'
import { addQuestion, clearQuestions } from '../redux/questionsSlice'

import toast from '../components/Toast/Notifications'

import PropTypes from 'prop-types'

const QuizCreation = ({ navigation }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);

  const functions = getFunctions(getApp());
  const generateQuiz = httpsCallable(functions, 'generateQuiz');

  const onCreateQuiz = async () => {
    if (input === '') {
      toast('Add some text first!', {icon: '🤗'});
      return
    }

    // Outputs a unique Id for the toast
    const creationToast = toast.loading('Creating quiz');
    setProcessing(true);

    try {
      const { data } = await generateQuiz({ input });
      const descriptors = data.descriptors;
      const questions = data.questions;

      // Consider payload to be the quiz
      const { payload } = await dispatch(createQuiz({ descriptors }));
      dispatch(clearQuestions());
      await Promise.all(questions.map((question) => dispatch(addQuestion({ quiz: payload, data: question })) ));
      await dispatch(loadQuiz({ quiz: payload }));
      // Notify and load once the quiz has been created
      toast.success('Quiz created!', {id: creationToast})
      setProcessing(false);
      navigation.navigate('QuizPreview');
      
    } catch(error) {
      Platform.OS == 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
      toast.error('Could not create quiz. Try using more concise text', {id: creationToast})
      setProcessing(false);
    }
  }

  const onCreateFromScratch = () => {
    const descriptors = {
      name: "New quiz",
      topic: "A generic topic",
      description: "A generic description"
    }

    const creation = dispatch(createQuiz({ descriptors }));
    creation.then(async({ payload }) => {
      dispatch(clearQuestions());
      await dispatch(loadQuiz({quiz: payload}));
      navigation.navigate('EditQuiz');
    })
   
    toast.promise(creation, {
      loading: 'Creating quiz',
      success: 'Quiz ready!',
      error: 'Could not generate quiz. Try again later'
    })
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
      <View style={{flexDirection: 'row', gap: isMobile ? 10 : 20}}>
        <PrimaryButton title='Submit' style={{width: 200, flex: isMobile ? 1 : ''}} onPress={() => onCreateQuiz()}/>
        <GhostButton title='Create from scratch' style={{width: 200, flex: isMobile ? 1 : ''}} onPress={() => onCreateFromScratch()}/>
      </View>
      <GhostButton title='<- Back' style={{width: 200}} onPress={() => navigation.goBack()}/>
    </View> 
  )
}

QuizCreation.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default QuizCreation