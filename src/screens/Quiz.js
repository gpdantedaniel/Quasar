import { StyleSheet, Text, View, CheckBox, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton, PrimaryButton } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { updateProgress } from '../redux/quizSlice'

const OptionCheckbox = ({ value, selection, viewingAnswer, answer, onPress }) => { 

  return (
    <View style={{
      marginTop: 10, 
      marginBottom: 10, 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 10,
      // Remain opaque if viewingAnswer AND the value is the answer
      opacity: (viewingAnswer && value !== answer ? 0.5 : 1),
      }}>

      <TouchableOpacity 
        style={{width: 25, height: 25, borderRadius: 5, borderColor: 'black', borderWidth: 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}
        onPress={() => { 
          console.log('clicked!'); 
          onPress() ;
        }}>       
      
        { value === selection || ( viewingAnswer && value === answer) ? 
          <View style={{
            backgroundColor: (viewingAnswer 
              ? ( answer === value 
                ? 'green'
                : 'red'
                )
              : 'rgb(28, 37, 255)'
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


const Quiz = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user)
  const quiz = useSelector((state) => state.quiz);
  const questions = useSelector((state) => state.questions.questions);
  const question = questions[quiz.lastQuestionIndex];

  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [viewingAnswer, setViewingAnswer] = useState(false);
  const [selection, setSelection] = useState('');
  
  const isCorrect = question.answer == selection;
  console.log('question.answer: ', question.answer);
  console.log('selection: ', selection);
  console.log('isCorrect: ', isCorrect);

  
  useEffect(() => {
    setShuffledOptions(
      [...question.options, question.answer].sort((a, b) => 0.5 - Math.random())
    )
  }, [question])
  


  console.log('user: ', user);
  console.log('quiz: ', quiz);
  console.log('questions: ', questions);

  
  // The ratio of answered questions to total question
  const progress = Number((quiz.lastQuestionIndex)/questions.length*100).toPrecision(3);


  
  const onCheck = () => {
    if (selection !== '') {
      setViewingAnswer(true);
      console.log('isCorrect: ', isCorrect);
    } else {
      console.log('NO ANSWER SELECTED');
    }
  }

  const onNext = () => {
    dispatch(updateProgress({user, quiz, questions, isCorrect}))
    setViewingAnswer(false);
    setSelection('');

    // If the user reached the end
    if (!(quiz.lastQuestionIndex < questions.length - 1)) {
      navigation.navigate('QuizPreview');
    }
  }

  // Shuffle the options and list them out after

  
  return (
    <View style={designSystemStyles.container}>
       <View>
        <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>{quiz.name}</Text>
        <Text style={[designSystemStyles.subHeading, {color: '#7c7c7c'}]}>{quiz.topic}</Text>
      </View>
      <View style={{gap: 10}}>
        <Text style={designSystemStyles.bodyText}>
          Progress: {(quiz.lastQuestionIndex + 1)} out of {questions.length} questions
        </Text>
        <View style={designSystemStyles.progressBar}>
          <View style={[ designSystemStyles.progressFill, {width: `${progress}%`}]}/>
        </View>
      </View>
      <View style={designSystemStyles.separator}/>
      <View style={{flex: 1, gap: 20}}>
        <Text style={designSystemStyles.subHeading}>{ question.question }</Text>
        <FlatList
          data={shuffledOptions}
          renderItem={({item}) => 
            <OptionCheckbox value={item} selection={selection} viewingAnswer={viewingAnswer} answer={question.answer} onPress={() => { 
              if (!viewingAnswer) {
                selection === item ? setSelection('') : setSelection(item);
              }
            }}/>
          }
          style={{ marginTop: -10, marginBottom: -10, flexGrow: 0,}}
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