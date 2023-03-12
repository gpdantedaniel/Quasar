import { StyleSheet, Text, View, Pressable} from 'react-native'
import React, { useEffect } from 'react'

import Icon from 'react-native-vector-icons/Ionicons';

import { createVerticalNavigator } from '../../components'
import AccountScreen from '../Account';
import QuizStack from './QuizStack';
import { getAuth } from 'firebase/auth';

import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';

import { loadUser } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
import { addQuiz, fetchQuizzes } from '../../redux/quizzesSlice';

const Vertical = createVerticalNavigator();

const MainStack = () => {
  const auth = getAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuizzes());


    const userDocRef = doc(getFirestore(), 'users', auth.currentUser.uid);
    getDoc(userDocRef).then((result) => { 
      if (result) {
        const data = result.data();
        // Convert Firestore Timestamp to primitive
        data.creation = data.creation.toDate().toString();
        // Add the document's id to the data
        data['docId'] = result.id;
        dispatch(loadUser(data));
      }
    });

    /*
    const quizzesColRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes');
    getDocs(quizzesColRef).then((docs) => {
      docs.forEach((doc) => {
        console.log('doc.id: ', doc.id);
        const data = doc.data()
        // Convert Firestore Timestamps to strings
        data.creation = data.creation.toDate().toString();
        data.lastTaken = data.lastTaken.toDate().toString();
        data['docId'] = doc.id;


        dispatch(addQuiz(data))

        console.log('doc.data: ', data);
      })
    });
    */

  }, [])

  return (
    <Vertical.Navigator>
      <Vertical.Screen name="QuizStack" component={QuizStack} options={{
        title: 'Quizzes',
        tabBarIcon: <Icon name="pencil" color={'black'} size={25}/>
      }}/>
      <Vertical.Screen name="Account" component={AccountScreen} options={{
        tabBarIcon: <Icon name="person-circle-outline" color={'black'} size={25}/>
        }}/>
      <Vertical.Screen name="Help & Contact" component={AccountScreen} options={{
        tabBarIcon: <Icon name="mail-outline" color={'black'} size={25}/>
      }}/>
    </Vertical.Navigator>

  )
}

export default MainStack

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  }

})