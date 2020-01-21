import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  profileInfo: {
        justifyContent:'flex-start',
        marginVertical: 60,
        marginHorizontal: 10,
        
    },
    actions: {
      flex: 1, 
      padding: 5, 
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'lightgray',
      borderWidth: 1,
      borderRadius: 2
    },
    profileFirstName:{
      fontWeight:'400',
      fontSize:12,
      textAlign:'justify'
    },
    aboutProfile:{
      fontWeight:'100',
      fontSize:10,
      textAlign:'justify',
      padding:5,
      paddingBottom:5,
      width:'100%'
    },
    avtarimage: {
        position: 'relative', 
        top:10 ,
        alignSelf:'flex-start',
        marginLeft:5,
    },
    
    followbtn:{
      marginVertical: 15,
      justifyContent:'center',
      marginRight: 10,
      width:150
    },
    messagebtn:{
        marginVertical: 15,
        justifyContent:'center'
    },
    blockbtn:{
        marginVertical: 20,
        justifyContent:'center',
        marginLeft: 20
    },
    name:{ 
          flexDirection: 'row', 
          justifyContent:'space-around',
          marginTop:-60,
          marginLeft: 100,
        },

        row: {
          flexDirection: 'row',
          alignItems: 'center',
          borderColor: '#DCDCDC',
          backgroundColor: '#fff',
          borderBottomWidth: 0.7,
          marginTop:10,
          height:'100%',
          width:'100%',
          flex:1
      },
      pic: {
          flexDirection: 'row',
          borderRadius: 30,
          width: 45,
          height: 45,
          marginLeft:10
      },
      
      nameTxt1: {
        flexDirection: 'row',
        marginLeft: 80,
        fontWeight: '400',
        color: '#222',
        fontSize: 14,
        width:'auto',
        marginTop:-40
      },
      statusdiff:{
        marginLeft:170,
        marginTop: -10,
        fontSize:8
      },
      imgpublic:{
        height:15,
        width:15,
        marginLeft: 290,
        marginTop: -10
      },
      
      dateTxt: {
        flexDirection:'row',
        fontWeight: '100',
        color: '#606060',
        fontSize: 9,
        marginLeft: 80,
        marginTop:'auto',
      
      },
      postTextSize:{
        fontFamily:'fontAwesome',
        width:'auto',
        height:'auto',
        marginLeft:10,
        paddingTop: 15,
        paddingBottom:5
      },
      postImage:{
        minWidth: '100%',
        height: 'auto',
        aspectRatio: 1,
       
      },
      combine:{
        position:'absolute',
        right:0,
        top:0
      },
      verticalImg:{
        right:20,
       
      },
      privacyImage:{
       right:40,
        top:20
      },
      userPost:{
        textAlign:'center'
      },
      iconRow: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        marginTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
      },
      heartIcon: {
        width: 20,
        height: 20,
      },
      pulstab:{
        height:70,
        width:70,
        resizeMode: 'contain'
      },
      spinnerTextStyle: {
        color: '#FFF'
      },
      norecordImage:{
        width:'100%',
        height:300,
        alignSelf:'center',
        marginVertical:50
      },
      status_indicator: {
        width: 10,
        height: 10,
        marginTop: 12,
        borderRadius: 10,
        marginLeft: 5,
      },
      norecordImage:{
        width:'100%',
        height:'100%',
        alignSelf:'center',
        //marginVertical:10
      },
      });  
      export default styles;