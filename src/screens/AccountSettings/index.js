import React, { Component } from 'react';
import { View, Text ,Image,Keyboard,Switch,Picker} from 'react-native';
import { DrawerActions } from 'react-navigation';
import {Appbar,Card,TextInput,Button,Snackbar} from 'react-native-paper';
import styles from './styles';
import theme from './../../theme';
import { ScrollView } from 'react-native-gesture-handler';
import { withTheme } from 'react-native-paper';
import {userChangePassword} from './../../api';
import{getData} from './../../helper';
import PasswordInputText from 'react-native-hide-show-password-input';
import ToggleSwitch from "toggle-switch-react-native";

 class AccountSettings extends Component {

  static navigationOptions = {
    drawerIcon: ({tintColor})=>( 
        <Image source={require('../../../src/assets/images/icons/accountsettings.png')} style={[theme.icon, {tintColor: tintColor}]} />
    )
}
  constructor(props) {
    super(props);
    this.state = {
      friendrequestaccept:false,
      friendrequestrecived:false,
      isOnBlueToggleSwitch: false,
      commentonpost:false,
      receivemessage:false,
      likeyourpost:false,
      followsyou:false,
      choosenIndex: 0 ,
      ShowPicker:false,
      old_password:'',
      new_password:'',
      user_id:'',
      c_password: '',
    };
  
  }
  
  onToggle(isOn) {
    console.log("Changed to " + isOn);
  }
  
  
  handleChangePassword = async() =>{
    let authUser = await getData("user")
    
    if(!this.validateChangePassword()){
      this.setState({
        visible : true,
        message : "Please fill all fields"
        })
        return true;
    }
    
    this.setState({
      visible : true,
      message: "Password Changed Successfully."  
  });
        let data = new FormData();
        data.append("action", "userChangePassword");
        data.append("old_password", this.state.old_password);
        data.append("new_password", this.state.new_password);
        data.append("user_id",JSON.parse(authUser).id);
     
        console.log(data);
        userChangePassword("POST", data).then(data=>{
          this.setState({ changepass: data.data })
        console.log("user", data);
       
        this.resetForm();
      })
     
  }
  resetForm = () => {
    this.setState({old_password: "", new_password: "",c_password:""});
}
  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }

  componentDidMount = async() => {
    let user = await getData("user");
    user = JSON.parse(user);
  
    
  }
  validateChangePassword = () => {
    const currentPass = this.checkField(this.state.old_password);
    const password  = this.checkField(this.state.new_password);
    const c_password = this.checkField(this.state.c_password);
    const user_id_text = this.checkField(this.state.user_id);
	
		
    
    if (this.state.new_password !== this.state.c_password){
     
    this.setState({
      visible: true,
      message: "Password and confirm password must match."
    })
   return true;
  }
    if(currentPass || password ||user_id_text||c_password) {
    return true;
    } 
   
    else {
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
      <View style={{backgroundColor:'#1da1f2'}}>
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={this._openMenu} />
          <Appbar.Content titleStyle={styles.headerTitle} title="Account Settings"/></Appbar.Header>
          <ScrollView >
          <View style={styles.container}>
            <View style = {styles.backgroundContainer}>
                <Image style={styles.imgsize} source = {require('../../assets/images/icons/accountSettingsWhite.png')} />
            </View> 
            <View style={styles.card}>
              <Card >  
              <Card.Title title="Change Password" />
              <Card.Content>
                <View>
                  <TextInput 
                      style={{backgroundColor:'white'}} 
                      placeholder='Old Password' 
                      value={this.state.old_password}
                      onChangeText = {old_password => this.setState({ old_password })}
                   />
                  <TextInput 
                      style={{backgroundColor:'white'}}
                      placeholder='New Password' 
                      value={this.state.new_password}
                      onChangeText = {new_password => this.setState({ new_password })}
                  />
                  <PasswordInputText 
                      label='Confirm New Password' 
                      value={this.state.c_password}  
                      onChangeText = {c_password => this.setState({ c_password })}
                  />
              </View>
              <View style={styles.savebtn}>
                  <Button  style={{borderRadius:20}}
                          mode='contained' uppercase={false} 
                          onPress={()=>this.handleChangePassword()}>
                          Submit
                 </Button>
                  <Button style={{marginHorizontal: 10,borderRadius:20}} 
                  mode='outlined' uppercase={false}>
                    Cancel
                  </Button>
              </View>
              <Snackbar
                      duration={4000}
                      visible={this.state.visible}
                      onDismiss={() => this.setState({ visible: false })}>
                      {this.state.message}
              </Snackbar>
            </Card.Content>
            </Card>
            </View>
            {/* <View style={styles.card2}>
            <Card >  
              <Card.Title title="Manage Push Notification" />
              <Card.Content>
              <View>
                    <ToggleSwitch style={styles.pushSwitch}
                        label="When friend request gets accepted"
                        onColor="#2196F3"
                        isOn={this.state.friendrequestaccept}
                        onToggle={friendrequestaccept => {
                        this.setState({ friendrequestaccept });
                        this.onToggle(friendrequestaccept);
                        }}
                    />
                    <ToggleSwitch style={styles.pushSwitch}
                        label="When you have received a friend request"
                        onColor="#2196F3"
                        isOn={this.state.friendrequestrecived}
                        onToggle={friendrequestrecived => {
                        this.setState({ friendrequestrecived });
                        this.onToggle(friendrequestrecived);
                        }}
                    />
                    <ToggleSwitch style={styles.pushSwitch}
                        label="When someone comments on your post"
                        onColor="#2196F3"
                        isOn={this.state.commentonpost}
                        onToggle={commentonpost => {
                        this.setState({ commentonpost });
                        this.onToggle(commentonpost);
                        }}
                    />
                    <ToggleSwitch style={styles.pushSwitch}
                        label="When you receive a message"
                        onColor="#2196F3"
                        isOn={this.state.receivemessage}
                        onToggle={receivemessage => {
                        this.setState({ receivemessage });
                        this.onToggle(receivemessage);
                        }}
                    />
                    <ToggleSwitch style={styles.pushSwitch}
                        label="When someone like your post"
                        onColor="#2196F3"
                        isOn={this.state. likeyourpost}
                        onToggle={likeyourpost => {
                        this.setState({ likeyourpost });
                        this.onToggle(likeyourpost);
                        }}
                    />
                     <ToggleSwitch style={styles.pushSwitch}
                        label="When someone follows you"
                        onColor="#2196F3"
                        isOn={this.state.followsyou}
                        onToggle={followsyou => {
                        this.setState({ followsyou });
                        this.onToggle(followsyou);
                        }}
                    />
            </View>
              <Text style={styles.textStyle}>Select Language</Text>  
              <Picker style={styles.pickerStyle}  
                      selectedValue={this.state.language}  
                      onValueChange={(itemValue, itemPosition) =>  
                      this.setState({language: itemValue, choosenIndex: itemPosition})}>  
              <Picker.Item label="English" value="english" />  
              <Picker.Item label="Chinese" value="chinese" />  
              </Picker>  
                <Button  style={{borderRadius:20,height:40,width:80,alignSelf:'center'}} mode='contained' uppercase={false}>Save</Button>
            </Card.Content>
            </Card>
            <Card>
            <Card.Content> 
            <View style={styles.DeactiveView}>
                    <Text mode="text" color="#858a8c" >Want to deactive the account? </Text>
                    <Text mode="text" color="#858a8c" style={{ color: colors.primary }} >Click here</Text>
              </View>
              </Card.Content>
              </Card>
            </View> */}
          </View>
        </ScrollView>
    </View>
    );
  }
}
export default withTheme(AccountSettings);