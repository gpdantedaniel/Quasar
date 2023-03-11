import { StyleSheet, Text, View } from 'react-native'
import React, { useState }from 'react'
import designSystemStyles from '../assets/styles'
import { TextInput } from 'react-native-web'
import { GhostButton, PrimaryButton } from '../components'

import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";

import { useSelector, useDispatch } from 'react-redux'
import { addQuestions, createQuiz } from '../redux/quizSlice'
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { addQuestion } from '../redux/questionsSlice'

// const functions = getFunctions(getApp());
// connectFunctionsEmulator(functions, "localhost", 5001);

const QuizCreation = ({ navigation }) => {
  console.log('QuizCreation rendered');
  const user = useSelector((state) => state.user);
  const [awaitingQuestions, setAwaitingQuestions] = useState(false);
  const [baseText, setBaseText] = useState('');
  const dispatch = useDispatch();

  const onCreateQuiz = () => {
    // Change screen to loading screen
    setAwaitingQuestions(true);
    const functions = getFunctions(getApp());
    const generateQuiz = httpsCallable(functions, 'generateQuiz');
    
    generateQuiz({baseText: baseText}).then((result) => {

      const questions = JSON.parse(result.data);
      
      console.log(questions);

      dispatch(createQuiz({user, questions})).then((result) => {
        const quiz = result.payload.data;
        console.log(result);


        questions.forEach((question) => {
          dispatch(addQuestion({user, quiz, data: question}))
        })
        navigation.navigate('EditQuiz');

      })

      /*
      const quiz = {
        name: "New Quiz",
        topic: "Topic Name",
        description: "A quiz about something!",
        lastTaken: Timestamp.now(),
        creation: Timestamp.now(),
        lastQuestionIndex: 0,
        points: 0,
      };

      
      const quizzesColRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes');

      addDoc(quizzesColRef, quiz).then(({ docId }) => {

        const questionsColRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', docId, 'questions');

        questions.forEach((question) => {
          addDoc(questionsColRef, question);
        })

      })
      */
    

      // navigation.navigate('EditQuiz');
            // dispatch(addQuestions(data));


    }).catch((error) => {
      console.log(error);
    })
  }


  if (awaitingQuestions) { return (
    <View style={styles.container}>
      <View style={{gap: 10}}>
        <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>Creating Quiz</Text>
        <Text style={designSystemStyles.subHeading}>Please wait while your quiz is being created. Do not close this window.</Text>
      </View>
      <View style={{borderBottomColor: 'black', borderBottomWidth: 1}}/>
      <View style={{flex: 1}}/>
    </View>
  )}

  return (
    <View style={styles.container}>
      <View style={{gap: 10}}>
        <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>Quiz Creation</Text>
        <Text style={designSystemStyles.subHeading}>Add your text in the box below and we’ll turn it into questions!</Text>
      </View>
      <TextInput
        editable
        multiline
        autoComplete={false}
        autoCorrect={false}
        style={[designSystemStyles.bodyText, {flex: 1, borderWidth: 1, borderColor: 'black', borderRadius: 10, outlineStyle: 'none', padding: 20}]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'center',
    gap: 20,
    padding: 50,
  }
})