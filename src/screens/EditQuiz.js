import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import designSystemStyles from '../assets/styles'
import { TextInput } from 'react-native-web'
import { GhostButton, PrimaryButton } from '../components'

const EditQuiz = () => {
  return (
    <View style={styles.container}>
      <Text style={[designSystemStyles.bigHeading, {fontFamily: 'Inter-Bold'}]}>Edit Quiz</Text>
      <Text style={designSystemStyles.heading}>Quiz Information</Text>

      <View>
        <View style={{gap: 20}}>
          <View style={{flexDirection: 'row', gap: 20}}>
            <TextInput style={designSystemStyles.BoxedTextInput} placeholder='Quiz name'/>
            <TextInput style={designSystemStyles.BoxedTextInput} placeholder='Topic'/>
          </View>
          <TextInput style={designSystemStyles.BoxedTextInput} placeholder='Description'/>
        </View>
      </View>
      <View style={{borderBottomColor: 'black', borderBottomWidth: 1}}/>
      
      <View style={{flex: 1}}>
        <Text style={designSystemStyles.heading}>Questions</Text>
      </View>

      <View style={{flexDirection: 'row', gap: 24}}>
        <PrimaryButton title='Save' style={{width: 150,}} />
        <GhostButton title='Cancel' style={{width: 150}}/>
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
  }
})