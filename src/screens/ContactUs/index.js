import React, { Component } from 'react';
import { View, Text ,Image,Keyboard,TouchableWithoutFeedback} from 'react-native';
import { DrawerActions } from 'react-navigation';
import {Appbar,Card,TextInput, Button,Snackbar} from 'react-native-paper';
import styles from './styles';
import theme from './../../theme';
import{userContactUs} from './../../api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
 class ContactUs extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor})=>( 
        <Image source={require('../../../src/assets/images/icons/contactus.png')} style={[theme.icon, {tintColor: tintColor}]} />
    )
}
  constructor(props) {
    super(props);
    this.state = {
      firstname:'',
      lastname:'',
      email:'',
      subject:'',
      first_name: '',
      posts : [],
      message: false,
      isFetching: false,
      items: [],
      
      refreshing:false
    };
  }
  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }
  handleContactUs = () =>{
    if(this.validateConatctUs()){
      this.setState({
        visible : true,
        messageText : "Please fill all fields"
        })
        return;
    }
    
    this.setState({
      visible : true,
      messageText: "Thank you! Your message has been successfully sent."  
  });
      
        let data = new FormData();
        data.append("action", "userContactUs");
        data.append("firstname", this.state.firstname);
        data.append("lastname", this.state.lastname);
        data.append("email", this.state.email);
        data.append("subject", this.state.subject);
        data.append("message", this.state.message);
        console.log(data);
        userContactUs("POST", data).then(data=>{
          this.setState({ contactus: data.data })
        console.log("user", data);
       
        this.resetForm();
      })
     
  }
  resetForm = () => {
    this.setState({firstname: "", lastname: "", email: "",subject:"",message:""});
}
  componentDidMount = async() => {
 
    this.getuserContactUs()
  }
  validateConatctUs = () => {
    const firstname_text = this.checkField(this.state.firstname);
    const lastname_text  = this.checkField(this.state.lastname);
    const email_text = this.checkField(this.state.email);
    const subject_text = this.checkField(this.state.subject);
    const message_text = this.checkField(this.state.message);
    if(firstname_text || lastname_text ||email_text||subject_text||message_text) {
    return true;
    } else {
    return false;
    }
    }
    checkField = (field) => {
      if(field == "" || field == undefined || field == null) {
      return true;
      } else {
      return false;
      }
    }
  render() {
    return (
      <DismissKeyboard>
        
          <View style={{flex:1}}>
         
            <Appbar.Header>
            <Appbar.Action icon="menu" onPress={this._openMenu} />
            <Appbar.Content titleStyle={styles.headerTitle} title="Contact Us"/>
            </Appbar.Header>
           
              <View style={styles.container}>
                
              <View style = {styles.backgroundContainer}>
                
                  <Image style={styles.imgsize} source = {require('../../assets/images/icons/contactus.png')} />
                  </View>
               
                <View style={styles.card}>
                <KeyboardAwareScrollView>
                <Card >  
                <Card.Title title="Get In Touch" />
                <Card.Content>
                
                    <View style={{flexDirection: 'row',alignItems: 'flex-start',height:70}}>
                   
                      <View style={styles.inputWrap}>
                     
                      <TextInput style={styles.inutFirstname}
                                  placeholder='First name' 
                                  value={this.state.firstname}
                                  onChangeText = {firstname => this.setState({ firstname })}
                      />
                    </View>
                    <View style={styles.inputWrap}>
                        <TextInput style={styles.inputLastname} 
                                      placeholder=' Last name' 
                                      value={this.state.lastname}
                                      onChangeText = {lastname => this.setState({ lastname })}
                        />
                        </View>    
                        </View>
                        <View style={styles.inputothercomponent} >
                            <TextInput style={{backgroundColor:'white'}}  
                                      placeholder=' Enter your email' 
                                      value={this.state.email}
                                      onChangeText = {email => this.setState({ email })}
                            />
                            <TextInput style={{backgroundColor:'white'}}  
                                      placeholder=' Enter your subject'
                                      value={this.state.subject} 
                                      onChangeText = {subject => this.setState({ subject })}
                            />
                               
                            
                                <TextInput multiline={true} 
                                  
                                        mode='outlined' 
                                        style={{backgroundColor:'white', height:'auto',marginVertical: 20,}}  
                                        placeholder=' Enter your message' 
                                        value={this.state.message} 
                                        onChangeText = {message => this.setState({ message })}
                                />
                           
                      
                        </View>
                       
                        <Button mode='contained' 
                                uppercase={false} 
                                style={styles.submitbtn} 
                                onPress={this.handleContactUs}>
                                  Submit
                        </Button>
                       
                </Card.Content>
                
                <Snackbar
                      duration={4000}
                      visible={this.state.visible}
                      onDismiss={() => this.setState({ visible: false })}>
                      {this.state.messageText}
              </Snackbar>
              
              </Card>
              </KeyboardAwareScrollView>
            </View>
           
        </View>
         
  </View>

  </DismissKeyboard>
  );
 }
}
export default ContactUs;
