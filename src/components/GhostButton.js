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

const styles = StyleSheet.create({
  primaryButton: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 40,
    borderRadius: 25,
    backgroundColor: 'rgb(0, 0, 0, 0)',
    borderWidth: 2,
    borderColor: 'black',
  },

  primaryButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
})