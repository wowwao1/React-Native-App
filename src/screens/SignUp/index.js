import React, { Component } from 'react';
import { View,TouchableWithoutFeedback,Keyboard, Image,Text, Platform,ActivityIndicator,KeyboardAvoidingView} from 'react-native';
import { TextInput ,Button,withTheme,Snackbar} from 'react-native-paper';
import styles from './styles';
import {createAccount} from './../../api';
import { StackActions } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import PasswordInputText from 'react-native-hide-show-password-input';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
 class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname:'',
      lastname:'',
      email:'',
      password:'',
      phonecode:'',
      phonenumber:'',
      device:'',
      device_token:'',
      c_password:'',
      isLoading : false,

    };
  }
  navigateToLogin = () =>{
      this.props.navigation.navigate('Login');
  }
  profileSignup = async () =>{
    if(this.validateSignup()){
      this.setState({
        visible : true,
        message : "Please fill all fields"
        })
        return;
    }
    this.setState({
      isLoading : true
  });
  
    let data = new FormData();
    data.append("action", "signup");
    data.append("firstname", this.state.firstname);
    data.append("lastname", this.state.lastname);
    data.append("email", this.state.email);
    data.append("password", this.state.password);
    data.append("phonecode", "+"+this.props.navigation.getParam('country').callingCode);
    data.append("phonenumber", this.props.navigation.getParam('phone_no'));
    data.append("device", Platform.OS == "ios" ? "iOS" : "Android");
    data.append("device_token", "123");

    console.log(data);
    let response = await createAccount("POST", data);
    console.log(response);
    if(response.status) {
      this.setState({
        visible : true,
        message: "Thanks you. Your account has been successfully created."  
      },()=>{
        this.props.navigation.dispatch(StackActions.popToTop());
      });
    } else {
      this.setState({
        visible : true,
        message: response.message  
      });
    }
}


  validateSignup = () => {
    const firstname_text = this.checkField(this.state.firstname);
    const lastname_text  = this.checkField(this.state.lastname);
    const email_text = this.checkField(this.state.email);
    const password  = this.checkField(this.state.password);
    const c_password = this.checkField(this.state.c_password);

    if (this.state.password !== this.state.c_password){
      this.setState({
        visible: true,
        message: "Password and confirm password must match."
      })
      return true;
    }
    else if(firstname_text || lastname_text ||email_text||password||c_password) {
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
        
          <ScrollView  >
          <Image 
            style={{ height: 80, width: 80, alignSelf: 'center',marginTop :80,}}
            source={require('./../../assets/images/Appstore.jpg')}/>
           
           <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
           <View style={styles.inputfields}>
                <TextInput style={{backgroundColor:'white'}}
                label='First name'      
                mode = "flat"
                keyboardType="default"
                autoCapitalize="none" 
                value={this.state.firstname}
                onChangeText={firstname=>this.setState({ firstname })}
                />

                <TextInput style={{backgroundColor:'white'}}
                        label='Last name'      
                        mode = "flat"
                        keyboardType="default"
                        autoCapitalize="none" 
                        value={this.state.lastname}
                        onChangeText={lastname=>this.setState({ lastname })}
                />
   
                <TextInput style={{backgroundColor:'white',marginTop: 10,}}
                label='Email ID'      
                mode='flat'
                keyboardType="email-address"
                autoCapitalize="none" 
                value={this.state.email}
                onChangeText={email=>this.setState({email})}
                />
               
                <TextInput style={{backgroundColor:'white',marginTop: 10,}}
                label='Enter Password'      
                mode='flat'
                keyboardType="default"
                autoCapitalize="none" 
                value={this.state.password}
                onChangeText={password=>this.setState({password})}
                />

                <PasswordInputText
                label='Confirm Password'      
                mode='flat'
                keyboardType="default"
                autoCapitalize="none" 
                value={this.state.c_password}
                onChangeText={c_password=>this.setState({c_password})}
                />

        </View>
        </KeyboardAvoidingView>
        <Button  mode="contained" style={styles.nextbutton}onPress={this.profileSignup}>SIGN UP
          <View 
              style={{ position: 'absolute', top:"50%",right: 0, left: 0 }}>
              <ActivityIndicator 
                  animating={this.state.isLoading}  
                  color="#ffffff" />
        </View>
        
        </Button>
        <View style={styles.loginView}>
                    <Text mode="text" color="#858a8c" >You have already account? </Text>
                    <Text mode="text" color="#858a8c" onPress={this.navigateToLogin} style={{ color: colors.primary }}>Sign In</Text>
                    
        </View>
                <Snackbar
                      duration={3000}
                      visible={this.state.visible}
                      onDismiss={() => this.setState({ visible: false })}>
                      {this.state.message}
                </Snackbar>    
                </ScrollView>  
        </View>
       
        </DismissKeyboard>
    );
  }
}
export default withTheme(SignUp);