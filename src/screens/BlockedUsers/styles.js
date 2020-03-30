import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
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
    marginTop: 10,
    fontWeight: '400',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  unblockbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',

  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  norecordImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    //marginVertical:10
  },
});
export default styles;