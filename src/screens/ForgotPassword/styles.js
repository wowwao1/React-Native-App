import { StyleSheet } from 'react-native';

const styles = StyleSheet.create ({
    container : {
        flex : 1,
        justifyContent : 'center',
        margin : 12,
    },
    input:{
        backgroundColor:"white",
        marginTop:35,
    },
    submitbutton:{  
        marginTop : 20,
        padding:5,
    },

   forgotPassView:{
       marginVertical: 30,
       flexDirection: 'row',
       justifyContent: 'center'
   },
   logoImage: {
       marginVertical: 10,
        width: '100%',
        height: 22,
        resizeMode: 'contain'    
   }
})

export default styles;