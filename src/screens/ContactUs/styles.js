import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'relative',
    backgroundColor: '#1da1f2',
    height: 200,
  },
  container: {
    overflow: 'visible',
  },
  imgsize: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    marginTop: 30,
  },
  inputWrap: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginHorizontal: 5
  },
  card: {
    position: 'relative',
    margin: 10,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: 'gray',
    shadowOpacity: 1,
    elevation: 3,
    backgroundColor: "#FFF",
    top: -100
  },
  inutFirstname: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputLastname: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputothercomponent: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  submitbtn: {
    height: 40,
    width: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 10,
  },
  backview: {
    height: 200,
    backgroundColor: 'blue'
  }
});
export default styles;