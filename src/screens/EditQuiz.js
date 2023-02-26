import { StyleSheet, Text, View, TextInput, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import designSystemStyles from '../assets/styles'
import { GhostButton, PrimaryButton } from '../components'
import Icon from 'react-native-vector-icons/Ionicons'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore'
import { useSelector } from 'react-redux'


const QuestionItem = ({ questionObject, quiz }) => {
  const [questionId, setQuestionId] = useState(questionObject.id || '')
  const [question, setQuestion] = useState(questionObject.question || '');
  const [answer, setAnswer] = useState(questionObject.answer || '');
  const [options, setOptions] = useState(questionObject.options.concat(';') ||'');

  console.log('questionitem question: ', questionObject);

  const onSave = async () => {
    const auth = getAuth();
    const questionsRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId, 'questions');

    const newQuestion = {
      question, 
      answer, 
      options: options.split(';')
    };

    const docRef = await addDoc(questionsRef, newQuestion);
    console.log('docRef: ', docRef);
  }

  return (
    <View style={styles.questionItem}>
      <View style={{flexDirection: 'row', gap: 40,}}>
        <View style={{flex: 1, gap: 20,}}>

          <View style={{flexDirection: 'row', gap: 20}}>
            <View>
              <Text style={[designSystemStyles.bodyText, {fontSize: 14, color: '#7c7c7c'}]}>Question</Text>
              <TextInput style={[designSystemStyles.GhostTextInput, {width: 400,}]} value={question} onChangeText={(question) => setQuestion(question)}/>

            </View>
            <View>
              <Text style={[designSystemStyles.bodyText, {fontSize: 14, color: '#7c7c7c'}]}>Answer</Text>
              <TextInput style={[designSystemStyles.GhostTextInput, {width: 400,}]} value={answer} onChangeText={(answer) => setAnswer(answer)}/>

            </View>
          </View>
          <View>
            <Text style={[designSystemStyles.bodyText, {fontSize: 14, color: '#7c7c7c'}]}>False options (Separate options using a semicolon “;”)</Text>
            <TextInput style={[designSystemStyles.GhostTextInput, {width: '100%',}]} value={options} onChangeText={(options) => setOptions(options)}/>
          </View>

        </View>
        <View style={{justifyContent: 'space-between', alignItems: 'flex-end', width: 150,}}>
          <Icon name={'trash-outline'} size={30} color={'black'}/>
          <GhostButton title='Save' style={{width: 150}} onPress={() => onSave()}/>

        </View>
      </View>
    </View>
  )
}


const EditQuiz = ({ navigation }) => {
  const quiz = useSelector((state) => state.quiz);
  const questions = useSelector((state) => state.questions.questions);
  console.log('quiz: ', quiz);
  console.log('questions: ', questions);
  

  const [name, setName] = useState(quiz.name);
  const [topic, setTopic] = useState(quiz.topic);
  const [description, setDescription] = useState(quiz.description);  
    
  return (
    <View style={styles.container}>
      <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>Edit Quiz</Text>

      <View>
        <View style={{gap: 20}}>
          <View style={{flexDirection: 'row', gap: 20}}>
            <View>
              <Text style={[designSystemStyles.bodyText, {fontSize: 14, color: '#7c7c7c'}]}>Quiz name</Text>
              <TextInput style={designSystemStyles.GhostTextInput} value={name} onChangeText={(name) => setName(name)}/>

            </View>
            <View>
              <Text style={[designSystemStyles.bodyText, {fontSize: 14, color: '#7c7c7c'}]}>Topic</Text>
              <TextInput style={designSystemStyles.GhostTextInput} value={topic} onChangeText={(topic) => setTopic(topic)}/>

            </View>
          </View>
          <View>
            <Text style={[designSystemStyles.bodyText, {fontSize: 14, color: '#7c7c7c'}]}>Description</Text>
            <TextInput style={[designSystemStyles.GhostTextInput, {width: 620,}]} value={description} onChangeText={(description) => setDescription(description)}/>
          </View>
        </View>
      </View>      
      <View style={{flex: 1, gap: 20}}>
        <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
          <Text style={designSystemStyles.heading}>Questions</Text>
          <GhostButton title='+ Add Question' style={{width: 200,}}/>
        </View>

        <FlatList
          data={questions}
          renderItem={({item}) => <QuestionItem questionObject={item} quiz={quiz}/> }
          style={{paddingTop: -10, paddingBottom: -10}}
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
  },
})