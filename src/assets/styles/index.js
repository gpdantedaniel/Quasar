import { StyleSheet } from "react-native"

const designSystemStyles = StyleSheet.create({
  bodyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  subHeading: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
  },
  heading: {
    fontFamily: 'Inter-Regular',
    fontSize: 21,
  },
  bigHeading: {
    fontFamily: 'Inter-Regular',
    fontSize: 24,
  },
  GhostTextInput: {
    height: 40,
    width: 300,
    backgroundColor: 'rgba(0,0,0,0)',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    outlineStyle: 'none',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  BoxedTextInput: {
    height: 40,
    width: 300,
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    outlineStyle: 'none',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    padding: 10,
  }
})

export default designSystemStyles