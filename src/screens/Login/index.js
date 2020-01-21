import React, { Component } from 'react';
import { View, Text, AsyncStorage, TouchableWithoutFeedback,Keyboard,Image, ActivityIndicator, KeyboardAvoidingView,Platform } from 'react-native';
import { TextInput ,Button,Snackbar} from 'react-native-paper';
import styles from './styles';
import { withTheme } from 'react-native-paper';
import { loginUser } from './../../api';
import {storeData, getData} from './../../helper';
import { ScrollView } from 'react-native-gesture-handler';
import PasswordInputText from 'react-native-hide-show-password-input';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
 class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email :'',
      password :'',
      isLoading : false,
      visible: false,
      message : ''  ,
      first_name: '',
      last_name: '', 
      action:'',
      device:'',
      device_token:''
    };
  }
navigateToForgotpass = () =>{
    this.props.navigation.navigate('ForgotPassword');
}
navigateToPhonenumber = () =>{
  this.props.navigation.navigate('Phonenumber');
}
navigateToDashboard = () =>{
  this.props.navigation.navigate('Dashboard');
}
handleLogin = async () => {

  if(this.validateLogin()) {
      this.setState({
      visible : true,
      message : "Please fill all fields",
      })
      return;
  }   

  this.setState({
      isLoading : true
  });
  
  let data = new FormData();
  data.append("action", "login");
  data.append("email", this.state.email);
  data.append("password", this.state.password);
  data.append("device", Platform.OS == "ios" ? "iOS" : "Android");
  data.append("device_token", "");
  let user = await loginUser("POST", data);
  console.log("LoginUserData:",user);
  if(user.status){
    await AsyncStorage.setItem("user",JSON.stringify(user.data));
    this.navigateToDashboard();
  }else{
    this.setState({
      visible : true,
      isLoading : false,
      message : user.message
      })
  }
  
}
validateLogin = () => {
const email_address = this.checkField(this.state.email);
const pass = this.checkField(this.state.password);
  if(email_address || pass) {
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
                  source={require('./../../assets/images/Appstore.jpg')}/>
                <Image  
                  style={styles.logoImage}
                  source={require('./../../assets/images/newwowwao1logo.png')}/>
                <KeyboardAvoidingView behavior='position' 
                  keyboardVerticalOffset={keyboardVerticalOffset}>
                  <TextInput style={ styles.input }    
                      label='Enter your email ID/Mobile number'      
                      mode = "flat"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={this.state.email}
                      onChangeText = {email => this.setState({ email })} 
                  />
                  <PasswordInputText 
                      label='Enter Password'
                      mode = "flat"
                      value={this.state.password}
                      onChangeText = {password => this.setState({ password })}
                  />
                   </KeyboardAvoidingView>
                    <Text mode="text" color="#858a8c" onPress={this.navigateToForgotpass} style={[styles.forgotbutton, {color: colors.primary}]}>Forgot password?</Text>
                    <Button  
                            mode="contained" 
                            style={styles.loginbutton} 
                            onPress={this.handleLogin}>
                            SIGN IN
                            {/* <View 
                                  style={{ position: 'relative', top:"50%",right: 0, left: 0 }}>
                                  <ActivityIndicator 
                                      animating={this.state.isLoading}  
                                      color="#ffffff" 
                                  />
                            </View> */}
                    </Button>
                    <Snackbar
                      duration={2500}
                      visible={this.state.visible}
                      onDismiss={() => this.setState({ visible: false })}>
                      {this.state.message}
                    </Snackbar>
                    <View style={styles.signUpView}>
                        <Text mode="text" color="#858a8c" >Don't have an account? </Text>
                        <Text mode="text" color="#858a8c" style={{ color: colors.primary }} onPress={this.navigateToPhonenumber}>Create account</Text>
                    </View>
              </View>
          </DismissKeyboard>
    );
  }
}
export default withTheme(Login) 