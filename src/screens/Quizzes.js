import React from 'react'
import { Image, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { PrimaryButton } from '../components'
import designSystemStyles from '../assets/styles'
import Icon from 'react-native-vector-icons/Ionicons'

import { useSelector, useDispatch } from 'react-redux'
import { loadQuiz } from '../redux/quizSlice'
import { fetchQuestions } from '../redux/questionsSlice'

const Quizzes = ({ navigation }) => {
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quizzes.quizzes).slice().sort((a, b) => {
    // Sort the quizzes by date in descending order
    return new Date(b.lastTaken) - new Date(a.lastTaken);
  })

  const onSelectQuiz = async (quiz) => {
    await dispatch(loadQuiz({ quiz }));
    await dispatch(fetchQuestions({ quiz }));
    navigation.navigate('QuizPreview');
  }

  // If there are any quizzes to display
  if (quizzes.length > 0) { 
    return (
      <View style={designSystemStyles.container}>
        <Text style={designSystemStyles.bigHeadingBold}>My Quizzes</Text>
        <View style={{flex: 1, justifyContent: 'flex-start', gap: 20}}>
          <FlatList
            style={designSystemStyles.listView}
            data={quizzes}
            renderItem={({index}) => 
              <TouchableOpacity 
                style={designSystemStyles.listItem} 
                onPress={() => onSelectQuiz(quizzes[index])}>
                <View style={{width: '30%'}}>
                  <Text numberOfLines={1} style={designSystemStyles.bodyText}>
                    {quizzes[index].name}
                  </Text>
                  <Text numberOfLines={1} style={designSystemStyles.bodyTextSmall}>
                    {quizzes[index].topic}
                  </Text>
                </View>
                <View style={{width: '60%'}}>
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
    )
  }

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
            Start by creating your a quiz!
          </Text>
        </View>
        <PrimaryButton title='+ Create quiz' onPress={() => navigation.navigate('QuizCreation')}/>
      </View>
    </View>
  )
}

export default Quizzes