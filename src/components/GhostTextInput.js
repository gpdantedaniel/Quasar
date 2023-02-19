import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native'
import React from 'react'

const GhostTextInput = (props) => {
  return (
    <TextInput 
      placeholder={props.placeholder}
      onChangeText={props.onChangeText} 
      style={styles.textInput}  
    />
  )
}

export default GhostTextInput

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width: 300,
    backgroundColor: 'rgba(0,0,0,0)',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    outlineStyle: 'none',
    fontFamily: 'Inter-Regular',
  }
})