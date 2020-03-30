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
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
    marginVertical: 10
  },

  horizontalDots: {
    marginHorizontal: -50,
    marginVertical: 10
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    width: '100%',
    color: 'grey',
    fontSize: 12,
    paddingLeft: 18,
    alignItems: 'flex-start'
  },
  readStatus: {
    justifyContent: 'flex-end',
    position: 'absolute',
    paddingLeft: 100
  },
  norecordImage: {
    width: '50%',
    height: 200,
    alignSelf: 'center',
    marginVertical: 100
  }
});
export default styles;