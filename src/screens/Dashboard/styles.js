import { Platform,StyleSheet } from 'react-native';


const styles = StyleSheet.create({
     
        header_main: {
            height:140,
            backgroundColor:'#2165db', 
            flexDirection: 'row',
            marginTop:Platform.OS === 'ios' ? -45 : 0
        },
        image_container1:{
            flex: 1,
            flexDirection: 'column',
            marginTop: 15,
            alignSelf:"center",
            padding:10,
        },
        
        header_text :{
            flex: 1,
            flexDirection: 'column',
            marginLeft:-15,
            marginTop: 15,
            alignSelf:"center"
        },
        inner_text:{
            color:'white', 
            fontSize:18, 
            alignItems:'flex-start'
        },
        logoutContainer: {
            marginHorizontal: 20,
            alignItems: 'center',
            flexDirection: 'row'
        },
        logoutText: {
            paddingLeft: 15,
            margin: 16,
            fontWeight: 'bold'
        }
       
      
});
  
  export default styles 