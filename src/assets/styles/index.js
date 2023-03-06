import { StyleSheet } from "react-native"

const designSystemStyles = StyleSheet.create({
  bodyTextSmall: {
    fontFamily: 'Inter-Regular',
    color: '#7c7c7c', 
    fontSize: 14,
  },
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
  bigHeadingBold: {
    fontFamily: 'Inter-Bold',
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
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'center',
    gap: 20,
    padding: 50,
  },
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
    maxWidth: 500,
  },
  progressFill: {
    backgroundColor: "#1C25FF", 
    height: 20,
  },
  separator: {
    borderBottomColor: 'black', 
    borderBottomWidth: 1
  },
  listView: {
    flex: 1,
    width: '100%',
    marginTop: -10, 
    marginBottom: -10,
    gap: 20, 
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%', 
    height: 60, 
    padding: 20,
    marginTop: 10, 
    marginBottom: 10, 
    borderRadius: 10, 
    backgroundColor: '#f7f7f7'
  },
})

export default designSystemStyles