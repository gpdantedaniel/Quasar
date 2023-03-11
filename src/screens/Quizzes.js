import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton, PrimaryButton } from '../components'
import { getAuth } from 'firebase/auth'
import { collection, doc, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { FlatList, ScrollView, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector, useDispatch } from 'react-redux'
import { loadQuiz, updateLastTaken } from '../redux/quizSlice'
import { getQuestions } from '../redux/questionsSlice'

const Quizzes = ({ navigation }) => {
  const [quizzes, setQuizzes] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log('quizzes: ', quizzes);

  const onSelectQuiz = (quiz) => {

    dispatch(loadQuiz(quiz));
    dispatch(getQuestions({user, quiz}));

    navigation.navigate('QuizPreview');
  }

  const getQuizzes = async() => {
    const auth = getAuth();
    const quizzesRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes');
    const q = query(quizzesRef, orderBy('lastTaken', 'desc'));

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;

    // Get all the quiz data, the document's id and change the Firestore Timestamps to Strings
    const quizzes = docs.map((doc) => ({...doc.data(), ...{docId: doc.id}})).map((quiz) => { 
      quiz.lastTaken = quiz.lastTaken.toDate().toString();
      quiz.creation = quiz.creation.toDate().toString();
      return quiz
    })

    return quizzes;
  }


  useEffect(() => {
    getQuizzes().then((quizzes) => {
      setQuizzes(quizzes);
    }).catch((error) => {
      console.log(error);
    });
  }, [])

  
  if (Object.keys(quizzes).length > 0) { return (
    <View style={designSystemStyles.container}>
      <Text style={designSystemStyles.bigHeadingBold}>My Quizzes</Text>
      <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'left', gap: 20}}>
        <FlatList
          style={designSystemStyles.listView}
          data={quizzes}
          renderItem={({index}) => 
            <TouchableOpacity 
            style={designSystemStyles.listItem} 
            onPress={() => onSelectQuiz(quizzes[index])}>
              <View style={{width: '40%'}}>
                <Text numberOfLines={1} style={designSystemStyles.bodyText}>
                  {quizzes[index].name}
                </Text>
                <Text numberOfLines={1} style={designSystemStyles.bodyTextSmall}>
                  {quizzes[index].topic}
                </Text>
              </View>
              <View style={{width: '50%', alignItems: 'left'}}>
                <Text numberOfLines={1} style={designSystemStyles.bodyText}>
                  {quizzes[index].description}
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Icon 
                  style={{alignSelf:'flex-end'}} 
                  name={'arrow-forward-circle-outline'} 
                  color={'black'} 
                  size={36}
                />
              </View>
            </TouchableOpacity>
          }
        />
      </View>
      <PrimaryButton title='+ Create quiz' onPress={() => navigation.navigate('QuizCreation')}/>
    </View>
  )}

  return (
    <View style={designSystemStyles.container}>
      <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>My Quizzes</Text>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20}}>
        <View style={{gap: 10, alignItems: 'center'}}>
          <Image source={require('../assets/images/desert_landscape.png')} style={{width: 300, height: 230}}/>
          <Text style={designSystemStyles.subHeading}>
            No quizzes around here yet...
          </Text>
          <Text style={designSystemStyles.subHeading}>
            Start by creating your first quiz!
          </Text>
        </View>
        <PrimaryButton title='+ Create quiz' onPress={() => navigation.navigate('QuizCreation')}/>
      </View>
    </View>
  )
}

export default Quizzes

const styles = StyleSheet.create({})