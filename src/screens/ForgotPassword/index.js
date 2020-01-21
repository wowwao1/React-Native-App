import React, { Component } from 'react';
import { View, Text,TouchableWithoutFeedback,Keyboard, Image } from 'react-native';
import { TextInput ,Button,withTheme,Snackbar} from 'react-native-paper';
import styles from './styles';
import {userForgotPassword} from './../../api';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
 class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      action:'',
      isFetching: false,
      loading:false,
    };
    
  }
  navigateToLogin = () =>{
    this.props.navigation.navigate('Login');
}
handleForgotPass = () => {
   
  if(this.validateForgot()) {
    this.setState({
    visible : true,
    message : "Please enter the email addres"
    })
    return;
}   

this.setState({
    isLoading : true,
    visible:true,
    message : "Password Reset Link Sent To Your Email"
});

  let data = new FormData();
  data.append("action", "userForgotPassword");
  data.append("email", this.state.email);

  console.log(data);
  userForgotPassword("POST", data).then(data=>{
    alert("Password Reset Link Sent To Your Email")

  console.log(data);
  
})
}
componentDidMount = () =>{
  this.handleForgotPass()
}
validateForgot = () => {
  const email_address = this.checkField(this.state.email);
 
  
  if(email_address) {
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
    const { colors } = this.props.theme;
    return (
      <DismissKeyboard>
              <View style = {styles.container}>
                <Image  
                style={{ height: 100, width: 100, alignSelf: 'center' }}
                source={require('./../../assets/images/Appstore.jpg')}
                />
                <TextInput style={ styles.input }    
                    label='Enter your email ID'      
                    mode = "flat"
                    keyboardType="email-address"
                    autoCapitalize="none" 
                    value ={this.state.email}
                    onChangeText={email=>this.setState({email})}
                />
    
              
                <Button  mode="contained" style={styles.submitbutton} onPress={this.handleForgotPass}>Submit</Button>
                <View style={styles.forgotPassView}>
                    <Text mode="text" color="#858a8c" >You have already account? </Text>
                    <Text mode="text" color="#858a8c" onPress={this.navigateToLogin} style={{ color: colors.primary }}>Sign In</Text>
                </View>
                <Snackbar
                    duration={3000}
                    visible={this.state.visible}
                    onDismiss={() => this.setState({ visible: false })}>
                    {this.state.message}
            		</Snackbar>
               
              </View>
          </DismissKeyboard>
    );
  }
}
export default withTheme(ForgotPassword) 