import React from 'react'
import { Image, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { PrimaryButton } from '../components'
import designSystemStyles, { isMobile } from '../assets/styles'
import Icon from 'react-native-vector-icons/Ionicons'

import { useSelector, useDispatch } from 'react-redux'
import { loadQuiz } from '../redux/quizSlice'
import { fetchQuestions } from '../redux/questionsSlice'

import PropTypes from 'prop-types'

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
                onPress={() => onSelectQuiz(quizzes[parseInt(index)])}>
                <View style={{width: isMobile ? '90%' : '30%'}}>
                  <Text numberOfLines={1} style={designSystemStyles.bodyText}>
                    {quizzes[parseInt(index)].name}
                  </Text>
                  <Text numberOfLines={1} style={designSystemStyles.bodyTextSmall}>
                    {quizzes[parseInt(index)].topic}
                  </Text>
                </View>
                { !isMobile ? 
                <View style={{width: '60%'}}>
                  <Text numberOfLines={1} style={designSystemStyles.bodyText}>
                    {quizzes[parseInt(index)].description}
                  </Text>
                </View>
                : null }
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
        <PrimaryButton 
          title='+ Create quiz' 
          onPress={() => navigation.navigate('QuizCreation')}
          style={{alignSelf: isMobile ? 'center' : ''}}
        />
      </View>
    )
  }

  return (
    <View style={designSystemStyles.container}>
      <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>My Quizzes</Text>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20}}>
        <View style={{gap: 10, alignItems: 'center'}}>
          <Image source={require('../assets/images/cactus.jpg')} style={{width: 200, height: 200}}/>
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

Quizzes.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default Quizzes