import {Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const GhostButton = ({title, style, onPress}) => {
  return (
    <TouchableOpacity style={{...styles.primaryButton, ...style}} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default GhostButton

/*
shadow: 'black',
shadowOffset: {
  width: 2, 
  height: 2,
},
shadowOpacity: 1,
shadowRadius: 1,
*/

const styles = StyleSheet.create({
  primaryButton: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgb(0, 0, 0, 0)',
    borderWidth: 2,
    borderColor: 'black',
    shadow: 'black',
    shadowOffset: {
      width: 2, 
      height: 2,
    },
    shadowOpacity: .15,
    shadowRadius: 4,
  },

  primaryButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
})