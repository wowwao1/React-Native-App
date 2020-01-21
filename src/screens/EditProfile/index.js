import React, { Component } from 'react';
import { View, Text ,Image,Keyboard,StyleSheet,TouchableOpacity,FlatList,ScrollView,numberOfLines,ActivityIndicator} from 'react-native';
import { DrawerActions } from 'react-navigation';
import {Appbar,Avatar,Button,TextInput,Snackbar} from 'react-native-paper';
import theme from './../../theme';
import styles from './styles';
import { Card } from 'react-native-elements';
import{getData} from './../../helper';
import {userEditProfile} from './../../api';
import{userEditPicture} from './../../api';
import ImagePicker from 'react-native-image-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
 class EditProfile extends Component {
    _openMenu = () => {
        Keyboard.dismiss();
        this.props.navigation.navigate('MyProfileTab');
      }
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: '',
      first_name:'',
      email:'',
      phone_no:'',
      about:'',
      profile_img:'',
      editMode: false,
      isLoading: false,
    };
  }
  showActionSheet = () => {
    //this.ActionSheet.show();
    console.log("Here called")
    const options = {
      Width: 300,
      Height: 200,
      quality: 100,
      title: 'Select Image',
      allowsEditing: true,
      multiple: true,
    };
     ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source =  response ;
        //const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log(source)
        this.setState({
          avatarSource: source.uri
      
        },()=>{
          this.EditProfilePic()
        });
        
      }
    });
	};
  
  askCameraRollPermission = async () => {
    request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
      console.log(result)
    });
	};

	askCameraPermission = async () => {
    request(PERMISSIONS.IOS.CAMERA).then(result => {
      console.log(result)
    });
	};

  submitProfile = async() =>{
    Keyboard.dismiss();
    let user = await getData("user");
    user = JSON.parse(user);
    this.editMyProfile(user.id)
  }

  editMyProfile = (userid) => {
    console.log(userid);
    let data = new FormData();
    data.append("action", "userEditProfile");
    data.append("user_id", userid);
    data.append("first_name", this.state.first_name);
    data.append("city", "1");
    data.append("state", "2");
    data.append("country", "in");
    data.append("city_lat", "2");
    data.append("city_long", "1");
    data.append("phone_no", this.state.phone_code+''+this.state.phone_no);
    data.append("about",this.state.about);
    data.append("email",this.state.email);
    console.log(data);
    userEditProfile("POST", data).then(data=>{
    this.setState({ isLoading: false })
    console.log("Posts", data);
    this.setState({ editprofile: data.data,refreshing:false })
    this.props.navigation.navigate('MyProfileTab', { EditProfile : null });

  })

}

EditProfilePic = async () =>{
    let user = await getData("user");
    let body = {
      "action" :  "userEditPicture" ,
      "user_id" :  JSON.parse(user).id,
      "picture_type" : "Profile", 
    }
    let data = this.createFormData(this.state.avatarSource, body);
    userEditPicture("POST", data).then(data=>{
      this.setState({ isLoading: false })
      console.log("ProfilePic", data);
    })
}

createFormData = (photo, body) => {
  const data = new FormData();

  if(photo) {
    data.append("image_upload", {
      name: "test",
      type: "image/png",
      uri:
        Platform.OS === "android" ? photo : photo.replace("file://", "")
    });
  }

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  return data;
};

componentDidMount = async () =>{
  console.log(user)
  let user = await getData("user");
  user = JSON.parse(user);
  let profile = this.props.navigation.getParam("EditProfile");
  console.log("Img",profile.profile_img)
  this.setState({
    first_name: profile.first_name,
    about: profile.about,
    email:profile.email,
    phone_no:profile.phone_code+ '' +profile.phone_no,
    avatarSource:profile.profile_img,
  
    editMode: true
  })

  console.log("Profile",profile)
  this.askCameraRollPermission();
}

  render() {
    return (
        <View >
        <Appbar.Header>
        <Appbar.Action icon="close" onPress={this._openMenu} />
      
        <Appbar.Content 
          titleStyle={styles.headerTitle} 
          title="Edit Profile"/>
            <Appbar.Action icon='done'
              onPress={()=> this.submitProfile()}
        />
         <ActivityIndicator animating={this.state.isLoading} color="#ffffff" />
        </Appbar.Header>
        <View >   
            <ScrollView >
                  <View >
                  <TouchableOpacity>
                      <Avatar.Image size={80}
                          
                          source={{ uri: this.state.avatarSource }}
                          style={styles.avtarimage} 
                      />
                  </TouchableOpacity>
                  <View style={styles.btnBorder}>
                      <TouchableOpacity onPress={()=> this.showActionSheet()}>
                          <Button  
                              uppercase={false} 
                              mode='text'>
                              Change Profile Photo
                          </Button>
                      </TouchableOpacity>
                  </View>
                </View>
                  <View style={styles.txtInput}>
                    <TextInput 
                        label='Name'
                        style={{backgroundColor:'white'}}
                        value={this.state.first_name}
                        onChangeText={first_name =>this.setState({first_name})}
                    />  
                </View>
                <View  style={styles.bioInput} >
                  <TextInput multiline={true} 
                      numberOfLines={Platform.OS === 'ios' ? 
                      null : numberOfLines}
                      mode='outlined' 
                      label='Bio'
                      style={styles.bioInput} 
                      value={this.state.about}
                      onChangeText={about =>this.setState({about})}
                  />
                </View>
               <View >
                <Text style={{padding: 15,}}>
                  Private Information
                </Text>
                <TextInput 
                    label='Email'
                    style={{backgroundColor:'white'}}
                    autoCapitalize="none"
                    value={this.state.email}
                    onChangeText={email =>this.setState({email})}
                />
                <TextInput 
                    label='Phone'
                    style={{backgroundColor:'white'}}
                    value={this.state.phone_no}
                    onChangeText={phone_no =>this.setState({phone_no})}
                />
                  <Snackbar
                      duration={3000}
                      visible={this.state.visible}
                      onDismiss={() => this.setState({ visible: false })}>
                      {this.state.message}
                </Snackbar>
              </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
export default EditProfile;