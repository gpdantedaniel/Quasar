import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { GhostButton, PrimaryButton } from '../components'
import designSystemStyles from '../assets/styles'
import Icon from 'react-native-vector-icons/Ionicons'

import { useDispatch, useSelector } from 'react-redux'
import { updateProgress } from '../redux/quizSlice'

import { toast } from 'react-hot-toast'

const OptionCheckbox = ({ value, answer, selection, viewingAnswer, onPress }) => { 
  return (
    <View style={[
      designSystemStyles.quizOption, 
      {opacity: (viewingAnswer && value !== answer ? 0.5 : 1)}      
    ]}>

      <TouchableOpacity 
        style={designSystemStyles.checkbox}
        onPress={() => { 
          onPress() ;
        }}>       
        { value === selection || ( viewingAnswer && value === answer) ? 
          <View style={{
            backgroundColor: (viewingAnswer 
              ? ( answer === value 
                ? 'green'
                : 'red'
                )
              : '#1C25FF'
            ), 
            width: '100%', 
            alignItems: 'center', 
            justifyContent: 'center'}}>
            <Icon 
              name={'checkmark'} 
              color={'white'} 
              size={20}/>
          </View>
        : null }
      </TouchableOpacity>

      <Text style={designSystemStyles.bodyText}>
        { value }
      </Text>
    </View>
  )
}

const Quiz = ({ navigation }) => {
  const dispatch = useDispatch();
  const quiz = useSelector((state) => state.quiz);
  const questions = useSelector((state) => state.questions.questions);
  const question = questions[quiz.lastQuestionIndex];

  // Keep the options in a React State since the screen reloads on every action
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [viewingAnswer, setViewingAnswer] = useState(false);
  const [selection, setSelection] = useState('');

  // Calculate the ratio of the last question's index to the total number of questions
  const progress = Number((quiz.lastQuestionIndex/questions.length*100)).toPrecision(3);
  const isCorrect = question.answer === selection;
  
  useEffect(() => {
    setShuffledOptions(
      [...question.options, question.answer].sort(() => 
        // Sort the elements randomly
        (0.5 - Math.random())
      )
    )
  }, [question])
  
  const onCheck = () => {
    if (selection === '') {
      toast('Select an answer!', {icon: '🤗'})
      return
    }
    setViewingAnswer(true);
  }

  const onNext = async () => {
    // If the maximum index has been reached
    if (quiz.lastQuestionIndex >= (questions.length - 1)) {
      navigation.navigate('QuizPreview');
    } 

    // Be very careful here, effects on state must come after changing screen
    // Otherwise, an index out of boundaries error may occurr at the end
    await dispatch(updateProgress({ quiz, isCorrect, length: questions.length}))
    setViewingAnswer(false);
    setSelection('');
  }

  return (
    <View style={designSystemStyles.container}>
      <View>
        <Text style={[designSystemStyles.bigHeadingBold]}>{quiz.name}</Text>
        <Text style={[designSystemStyles.subHeading, {color: '#7c7c7c'}]}>{quiz.topic}</Text>
      </View>
      <View style={{gap: 10}}>
        <Text style={designSystemStyles.bodyText}>
          Progress: {quiz.lastQuestionIndex} out of {questions.length} questions
        </Text>
        <View style={designSystemStyles.progressBar}>
          <View style={[ designSystemStyles.progressFill, {width: `${progress}%`}]}/>
        </View>
      </View>
      <View style={designSystemStyles.separator}/>
      <View style={{flex: 1, gap: 20}}>
        <Text style={designSystemStyles.subHeading}>
          Question {quiz.lastQuestionIndex + 1}: {question.question}
        </Text>
        <FlatList
          data={shuffledOptions}
          renderItem={({item}) => 
            <OptionCheckbox 
              value={item} 
              answer={question.answer} 
              selection={selection} 
              viewingAnswer={viewingAnswer}  
              onPress={() => { 
                if (!viewingAnswer) {
                  selection === item ? setSelection('') : setSelection(item);
                }
              }}
            />
          }
          style={{ marginTop: -10, marginBottom: -10, flexGrow: 0}}
        />
        {viewingAnswer ? 
          <View style={{gap: 20}}>
            <GhostButton title='Next ->' style={{width: 200}} onPress={() => onNext()}/>
            <View style={{
              padding: 20, 
              backgroundColor: ( isCorrect
                ? '#ccffcc'
                : '#ffcccc'
              ), 
              borderRadius: 10, 
              gap: 10, 
              alignSelf: 'baseline',
              }}>
              <Text style={designSystemStyles.bodyText}>
                { isCorrect
                  ? 'Hooray! The answer is:'
                  : 'Woops! The answer is:'
                }
              </Text>
              <Text style={designSystemStyles.bodyText}>{question.answer}</Text>
            </View>
          </View>
          
          : <PrimaryButton title='Check' style={{width: 200}} onPress={() => onCheck()}/>
        }
      </View>
      <GhostButton title='<- Back' style={{width: 200}} onPress={() => navigation.goBack()}/>
    </View>
  )
}

export default Quiz

const styles = StyleSheet.create({

})