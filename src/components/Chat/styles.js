import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    container: {
      flex: 1
    },
    loader: {
      paddingTop: 20
    },
  
    header_right: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around"
    },
  
    header_button_container: {
      marginRight: 10
    },
    header_button: {
  
    },
    header_button_text: {
      color: '#FFF'
    },
  
    sendLoader: {
      marginRight: 10,
      marginBottom: 10
    },
    customActionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    buttonContainer: {
      padding: 10
    },
    modal: {
  
      backgroundColor: '#FFF'
    },
    close: {
      alignSelf: 'flex-end',
      marginBottom: 10
    },
    modal_header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10
    },
    modal_header_text: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    modal_body: {
      marginTop: 20,
      padding: 20
    },
    centered: {
      alignItems: 'center'
    },
    list_item_body: {
      flex: 1,
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-between"
    },
    list_item: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    list_item_text: {
      marginLeft: 10,
      fontSize: 20,
      color: 'white',
      marginVertical: 5,
    },
    status_indicator: {
      width: 10,
      height: 10,
      marginTop: 12,
      borderRadius: 10,
      marginLeft: 5,
    },
    online: {
      backgroundColor: '#1FF31F'
    },
    offline: {
      backgroundColor: '#606060'
    },
  
    footerContainer: {
      marginTop: 5,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
    },
    footerText: {
      fontSize: 14,
      color: '#aaa',
      flexDirection: 'row'
    },
    pic: {
      flexDirection: 'row',
      borderRadius: 30,
      width: 40,
      height: 40,
      marginLeft: 10,
  
    },
});
  

export default styles;