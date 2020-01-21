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
      width:170,
      marginVertical:10
    },
    mblTxt: {
      fontWeight: '400',
      color: 'white',
      fontSize: 13,
      backgroundColor:'#2165db',
     

    },
    horizontalDots:{
        right:20,
        marginVertical:10
    },
    msgContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    msgTxt: {
      fontWeight: '400',
      color: 'grey',
      fontSize: 12,
      marginLeft: 15,
    },
    norecordImage:{
      width:'100%',
      height:'100%',
      alignSelf:'center',
      //marginVertical:10
    },
  }); 
  export default styles;