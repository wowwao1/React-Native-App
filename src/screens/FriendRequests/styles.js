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
    width: 60,
    height: 60,


  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 20,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
    paddingTop: 20,
    alignSelf: 'center'
  },


  btnConfirm: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    alignSelf: 'center',
    textTransform: "capitalize"
  },
  norecordImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',

  },
});
export default styles;