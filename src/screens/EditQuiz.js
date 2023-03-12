import { StyleSheet, Text, View, TextInput, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton, PrimaryButton } from '../components'
import Icon from 'react-native-vector-icons/Ionicons'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, doc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { addQuestion, updateQuestion } from '../redux/questionsSlice'
import { setDescriptors } from '../redux/quizSlice'
import { toast } from 'react-hot-toast'


const QuestionView = ({ data, user, quiz, dispatch }) => {
  const [question, setQuestion] = useState(data.question);
  const [answer, setAnswer] = useState(data.answer);
  const [options, setOptions] = useState(data.options.join(';'));
  const [modified, setModified] = useState(false);

  const onSave = async () => {
    const update = {
      question,
      answer, 
      options: options.split(';')
    };

    const saved = dispatch(updateQuestion({user, quiz, docId: data.docId, data: update}))
    saved.then(() => setModified(false));
    toast.promise(saved, {
      loading: 'Saving...',
      success: 'Changes saved!',
      error: 'Could not save',
    })
  }

  return (
    <View style={styles.questionItem}>
      <View style={{flexDirection: 'row', gap: 40,}}>
        <View style={{flex: 1, gap: 20,}}>

          <View style={{flexDirection: 'row', gap: 20}}>
            <View>
              <Text style={designSystemStyles.bodyTextSmall}>Question</Text>
              <TextInput style={[designSystemStyles.GhostTextInput, {width: 400,}]} value={question} onChangeText={(question) => {
                setQuestion(question); setModified(true);
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
          <Icon name={'trash-outline'} size={30} color={'black'}/>
          <GhostButton title='Save' style={{width: 150, opacity: modified ? 1.0 : 0}} onPress={() => {
            if (modified) {
              onSave();
              setModified(false);
            }
          }}/>
        </View>
      </View>
    </View>
  )
}


const EditQuiz = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const quiz = useSelector((state) => state.quiz);
  const questions = useSelector((state) => state.questions.questions);

  const dispatch = useDispatch();

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
    const result = dispatch(addQuestion({user, quiz, data: {
      question: "New question",
      answer: "answer",
      options: ["option1", "option2", "option3", "option4"]
    }}))

    toast.promise(result, {
      loading: 'Creating question...',
      success: 'Question created!',
      error: 'Could not create question'
    })
  }

  return (
    <View style={styles.container}>
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
          renderItem={({item}) => <QuestionView data={item} user={user} quiz={quiz} dispatch={dispatch}/> }
          style={{ paddingRight: 20, borderRadius: 10}}
        />

      </View>

      <View style={{flexDirection: 'row', gap: 24}}>
        <GhostButton title='<- Back' style={{width: 200}} onPress={() => navigation.goBack()}/>
      </View>
    </View>
  )
}

export default EditQuiz

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'center',
    gap: 20,
    padding: 50,
  },
  questionItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
  },
})