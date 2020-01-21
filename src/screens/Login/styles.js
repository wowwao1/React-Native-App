import { StyleSheet } from 'react-native';

const styles = StyleSheet.create ({
    container : {
        flex : 1,
        justifyContent : 'center',
        margin : 12,
    },
    input:{
        backgroundColor:"white",
        marginTop:5,
    },
    loginbutton:{  
        marginTop : 20,
        padding:5,
    },
   forgotbutton:{
        textAlign : 'right',
        fontSize : 12,
        marginTop : 20
   },
   signUpView:{
       marginVertical: 20,
       flexDirection: 'row',
       justifyContent: 'center'
   },
   logoImage: {
       marginVertical: 33,
        width: '100%',
        height: 22,
        resizeMode: 'contain'
   }
})

export default styles;