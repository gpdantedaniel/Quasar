import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { GhostButton } from '../components'
import designSystemStyles from '../assets/styles'
import Icon from 'react-native-vector-icons/Ionicons'

import { useDispatch, useSelector } from 'react-redux'
import { addQuestion, deleteQuestion, updateQuestion } from '../redux/questionsSlice'
import { resetProgress, setDescriptors } from '../redux/quizSlice'

import { toast } from 'react-hot-toast'

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
      <View style={{flexDirection: 'row', gap: 40,}}>
        <View style={{flex: 1, gap: 20,}}>

          <View style={{flexDirection: 'row', gap: 20}}>
            <View>
              <Text style={designSystemStyles.bodyTextSmall}>Question</Text>
              <TextInput style={[designSystemStyles.GhostTextInput, {width: 400,}]} value={questionText} onChangeText={(questionText) => {
                setQuestionText(questionText); setModified(true);
              }}/>

            </View>
            <View>
              <Text style={designSystemStyles.bodyTextSmall}>Answer</Text>
              <TextInput style={[designSystemStyles.GhostTextInput, {width: 400,}]} value={answer} onChangeText={(answer) => {
                setAnswer(answer); setModified(true);
              }}/>
            </View>
          </View>
          <View>
            <Text style={designSystemStyles.bodyTextSmall}>False options (Separate options using a semicolon “;”)</Text>
            <TextInput style={[designSystemStyles.GhostTextInput, {width: '100%',}]} value={options} onChangeText={(options) => {
              setOptions(options); setModified(true);
            }}/>
          </View>

        </View>
        <View style={{justifyContent: 'space-between', alignItems: 'flex-end', width: 150,}}>
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


const EditQuiz = ({ navigation }) => {
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
      <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>Edit Quiz</Text>

      <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 20}}>
        <View style={{gap: 20,}}>
          <View style={{flexDirection: 'row', gap: 20}}>
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
            <TextInput style={[designSystemStyles.GhostTextInput, {width: 620}]} value={description} onChangeText={(description) => {
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
      <View style={{flex: 1, gap: 20}}>
        <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
          <Text style={designSystemStyles.heading}>Questions</Text>
          <GhostButton title='+ Add Question' style={{width: 200}} onPress={() => onAddQuestion()}/>
        </View>
        <FlatList
          data={questions}
          renderItem={({item}) => <QuestionView quiz={quiz} question={item}/> }
          style={designSystemStyles.listView}
        />
      </View>
      <GhostButton title='<- Back' style={{width: 200}} onPress={() => navigation.goBack()}/>
    </View>
  )
}

export default EditQuiz

const styles = StyleSheet.create({
  questionItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
  },
})