import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    paddingLeft: 10,
  },
  pic: {
    borderRadius: 30,
    width: 45,
    height: 45,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '300',
    color: '#222',
    fontSize: 14,
    width: 250,
    marginTop: 18,
  },
  mblTxt: {
    fontWeight: '400',
    color: 'white',
    fontSize: 13,
    backgroundColor: '#2165db',


  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#696969',
    fontSize: 15,
    marginHorizontal: 10,
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 10,
  },
  norecordImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    //marginVertical:10
  },
});
export default styles;