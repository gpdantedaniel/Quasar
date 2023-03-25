import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { GhostButton } from '../components'
import designSystemStyles, { isMobile } from '../assets/styles'
import Icon from 'react-native-vector-icons/Ionicons'

import { useDispatch, useSelector } from 'react-redux'
import { addQuestion, deleteQuestion, updateQuestion } from '../redux/questionsSlice'
import { resetProgress, setDescriptors } from '../redux/quizSlice'

import toast from '../components/Toast/Notifications'

import PropTypes from 'prop-types';
import { Image } from 'react-native'

const QuestionView = ({ quiz, question }) => {
  const dispatch = useDispatch();
  // A distinction needs to be made between questionText and the question Object for now
  const [questionText, setQuestionText] = useState(question.question);
  const [answer, setAnswer] = useState(question.answer);
  const [options, setOptions] = useState(question.options.join(';'));
  const [modified, setModified] = useState(false);

  useEffect(() => {
    // IMPORTANT: Reset the state values explicitly
    // Otherwise, they will persist despite "question" updating
    setQuestionText(question.question);
    setAnswer(question.answer);
    setOptions(question.options.join(';'));
    setModified(false);
  }, [question])

  const onSave = async () => {
    // For now, separating options by semicolons will suffice
    const splitOptions = options.split(';')
    .map((option) => option.trim())
    .filter((option) => option !== '')
    const update = {
      question: questionText,
      answer, 
      options: splitOptions
    };
    
    const saved = dispatch(updateQuestion({ quiz, question, update}))
    saved.then(() => {
      // Reload the options in case of unseen changes
      setOptions(splitOptions.join(';'))
      setModified(false)
    });
    toast.promise(saved, {
      loading: 'Saving...',
      success: 'Changes saved!',
      error: 'Could not save changes',
    })
  }

  const onDelete = () => {
    // Reset the progress as well in case of out-of-boundaries index
    const deleted = Promise.all([
      dispatch(deleteQuestion({ quiz, question })),
      dispatch(resetProgress({ quiz }))
    ])
    toast.promise(deleted, {
      loading: 'Deleting question...',
      success: 'Question deleted!',
      error: "Could not delete question"
    })
  }

  return (
    <View style={styles.questionItem}>
      <View style={{flexDirection: isMobile ? 'column-reverse' : 'row', gap: 20,}}>
        <View style={{flex: 1, gap: 20,}}>

          <View style={{flexDirection: isMobile ? 'column' : 'row', gap: 20}}>
            <View style={{flex: !isMobile ? 1 : ''}}>
              <Text style={designSystemStyles.bodyTextSmall}>Question</Text>
              <TextInput style={[designSystemStyles.GhostTextInput, {minWidth: 0}]} value={questionText} autoCorrect={false} onChangeText={(questionText) => {
                setQuestionText(questionText); setModified(true);
              }}/>
            </View>
            <View style={{flex: !isMobile ? 1 : ''}}>
              <Text style={designSystemStyles.bodyTextSmall}>Answer</Text>
              <TextInput style={[designSystemStyles.GhostTextInput, {minWidth: 0}]} value={answer} autoCorrect={false} onChangeText={(answer) => {
                setAnswer(answer); setModified(true);
              }}/>
            </View>
          </View>
          <View style={{flex: 1}}>
          <Text style={designSystemStyles.bodyTextSmall}>False options (Separate each with “;”)</Text>
            <TextInput style={[designSystemStyles.GhostTextInput, {minWidth: 0}]} value={options} autoCorrect={false} onChangeText={(options) => {
              setOptions(options); setModified(true);
            }}/>
          </View>
        </View>
        <View 
        style={{
          justifyContent: 'space-between', 
          flexDirection: isMobile ? 'row' : 'column', 
          alignItems: isMobile ? '' : 'flex-end', 
          width: !isMobile ? '' : '',
        }}>
          <TouchableOpacity onPress={() => onDelete()}>
            <Icon name={'trash-outline'} size={30} color={'black'}/>
          </TouchableOpacity>
          <GhostButton title='Save' 
            style={{width: 150, opacity: modified ? 1.0 : 0}} 
            disabled={!modified}
            onPress={() => {
              if (modified) {
                onSave();
                setModified(false);
              }
            }}
          />
        </View>
      </View>
    </View>
  )
}

QuestionView.propTypes = {
  quiz: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
}

const EditQuiz = () => {
  const dispatch = useDispatch();
  const quiz = useSelector((state) => state.quiz);
  const questions =  useSelector((state) => state.questions.questions);

  // All descriptors are set in states
  const [name, setName] = useState(quiz.name);
  const [topic, setTopic] = useState(quiz.topic);
  const [description, setDescription] = useState(quiz.description);  
  const [descriptorsModified, setDescriptorsModified] = useState(false);

  const onSaveDescriptors = () => {
    const descriptors = {name, topic, description};
    const saved = dispatch(setDescriptors({ quiz, descriptors }))
    saved.then(() => setDescriptorsModified(false));
    toast.promise(saved, {
      loading: 'Saving...',
      success: 'Changes saved!',
      error: 'Could not save',
    })
  }

  const onAddQuestion = () => {
    const creation = dispatch(addQuestion({ quiz, data: {
      question: "A generic question",
      answer: "A generic answer",
      options: ["False option 1", "False option 2", "False option 3"]
    }}))
    toast.promise(creation, {
      loading: 'Adding question...',
      success: 'Question added!',
      error: 'Could not create question'
    })
  }

  return (
    <View style={designSystemStyles.container}>
      { !isMobile ? 
      <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>Edit Quiz</Text>
      : null }
      <View style={{flexDirection: !isMobile ? 'row' : 'column', gap: 20, alignItems: isMobile ? '' : 'flex-end'}}>
        <View style={{gap: 20, flex: 1}}>
          <View style={{flexDirection: !isMobile ? 'row' : 'column', gap: 20, width: isMobile ? '100%' : ''}}>
            <View>
              <Text style={designSystemStyles.bodyTextSmall}>Quiz name</Text>
              <TextInput style={designSystemStyles.GhostTextInput} value={name} onChangeText={(name) => {
                setDescriptorsModified(true); setName(name)
              }}/>
            </View>
            <View>
              <Text style={designSystemStyles.bodyTextSmall}>Topic</Text>
              <TextInput style={designSystemStyles.GhostTextInput} value={topic} onChangeText={(topic) => {
                setDescriptorsModified(true); setTopic(topic)
              }}/>
            </View>
          </View>
          <View>
            <Text style={designSystemStyles.bodyTextSmall}>Description</Text>
            <TextInput style={[designSystemStyles.GhostTextInput]} value={description} onChangeText={(description) => {
              setDescriptorsModified(true); setDescription(description)
            }}/>
          </View>
        </View>
        <GhostButton 
          title='Save' 
          style={{width: 150, opacity: descriptorsModified ? 1.0 : 0}} 
          disabled={!descriptorsModified}
          onPress={() => onSaveDescriptors()}
        />
      </View>
      <View style={{flex: 1, gap: 20, height: isMobile ? 500 : 0}}>
        <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
          <Text style={designSystemStyles.heading}>Questions</Text>
          <GhostButton title={isMobile ? '+ Add' : '+ Add question'} style={{width: 200}} onPress={() => onAddQuestion()}/>
        </View>
        {questions.length > 0 
        ?
        <FlatList
        horizontal={isMobile}
        data={questions}
        renderItem={({item}) => <QuestionView quiz={quiz} question={item}/> }
        style={[designSystemStyles.listView]}
        />
        : 
        <View style={{gap: 10, alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Image source={require('../assets/images/cactus.jpg')} style={{width: 100, height: 100}}/>
          <Text style={designSystemStyles.subHeading}>
            This quiz is empty...
          </Text>
          <Text style={designSystemStyles.subHeading}>
            Add a question!
          </Text>
        </View>
        }
      </View>
    </View>
  )
}

EditQuiz.propTypes = {}

export default EditQuiz

const styles = StyleSheet.create({
  questionItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 20,
    marginTop: isMobile ? 0 : 10,
    marginBottom: isMobile ? 0 : 10,
    marginRight: isMobile ? 10 : 0,
    marginLeft: isMobile ? 10 : 0,
  },
})

/*
<View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
  <Text style={designSystemStyles.heading}>Questions</Text>
  { isMobile ? 
  <TouchableOpacity>
    <Icon name={'add-circle-outline'} color={'black'} size={30}/>
  </TouchableOpacity>
  : <GhostButton title={isMobile ? 'Add' : 'Add question'} style={{width: 200}} onPress={() => onAddQuestion()}/>}
</View>
*/