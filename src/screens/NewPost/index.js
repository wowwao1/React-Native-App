import React, { Component } from 'react';
import { View, 
  Text ,
  Keyboard,
  TouchableOpacity,
  Image,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator} from 'react-native';
import {Appbar, Card,TextInput,Snackbar,RadioButton} from 'react-native-paper';
import styles from './styles';
import {addPost} from './../../api';
import { getData } from '../../helper';
import {editPost} from './../../api';
import{userDeletePostImage} from './../../api';
import Loader from './../../Loader';
import ImagePicker from 'react-native-image-picker';
import EvilIcons from'react-native-vector-icons/EvilIcons';
import MaterialIcons from'react-native-vector-icons/MaterialIcons';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class NewPost extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user_id:'',
      action:'',
      public:'',
      private:'',
      userposts:'',
      post_type:'Public',
      post_text:'',
      addPost:'',
      description:'',
      visible: false,
      avatarSource: null,
      isLoading: false,
      ImageSource: null,
      editMode: false,
      
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
        const source = { uri: response.uri };
        //const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log(source)
        this.setState({
          avatarSource: source,
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


  navigateToHome = () =>{
    console.log("POSTA .. GOING BACK")
    this.props.navigation.setParams({EditPost: null });
    this.props.navigation.goBack() 
}


componentDidMount = async() => {
  this.props.navigation.addListener("willFocus",()=>{
    if(this.props.navigation.getParam("EditPost")) {
      let post = this.props.navigation.getParam("EditPost");
      this.setState({
        post_type: post.post_type,
        description: post.post_text,
        editMode: true
      })
    } else {
      this.setState({
        post_type: 'Public',
        description: "",
        editMode: false
      })
    }
  });
  let user = await getData("user");
  user = JSON.parse(user);
  this.askCameraRollPermission();
}


handlePost = async() =>{
    let user = await getData("user");
    if(this.validatePost()){
      this.setState({
        visible : true,
        message : "Please fill the description"
        })
        return;
    }   


    this.setState({
      isLoading : true
    });

   
    

    if(!this.state.editMode) {
      let body = {
        "action" :  "addPost" ,
        "user_id" : JSON.parse(user).id,
        "post_type" : this.state.post_type,
        "post_text" : this.state.description,
      }
      let data = this.createFormData(this.state.avatarSource, body);
      console.log("POST Data",data);
      addPost("POST", data).then(data=>{
        this.setState({ isLoading: false })
        this.setState({ addpost: data.data })
        this.props.navigation.navigate('Home', { post : null });
        this.resetForm();
      })
    } else {
      //EDIT POST
      let body = {
        "action" :  "editPost" ,
        "user_id" : JSON.parse(user).id,
        "post_type" : this.state.post_type,
        "post_text" : this.state.description,
        "post_id": this.props.navigation.getParam("EditPost").id
      }
      let data = this.createFormData(this.state.avatarSource, body);
        editPost("POST", data).then(data=>{
          console.log("EDIT DATA",data)
        this.setState({ isLoading: false })
        this.setState({ addpost: data.data })
        this.props.navigation.navigate('Home', { post : null });
        this.resetForm();
      })
    }

    
  }
  createFormData = (photo, body) => {
    const data = new FormData();

    if(photo) {
      data.append("post_image[0]", {
        name: "test",
        type: "image/png",
        uri:
          Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
      });
    }

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    return data;
  };
  validatePost = () => {
    const description_text = this.checkField(this.state.description);
    if(description_text && this.state.avatarSource == null) {
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
    resetForm = () => {
      this.setState({description:'', avatarSource: null});
  }

  editPOST = async() =>{
  let user = await getData("user");
   
  let body = {
    "action" : "editPost",
    "user_id" : this.props.navigation.getParam("EditPost").id,
    "post_type" : this.props.navigation.getParam("EditPost").post_type,
    "post_text" : this.props.navigation.getParam("EditPost").post_text, 
  }
  let data = this.createFormData(this.state.avatarSource, body);
console.log("DATABODY",body)
 
}


  deletePostImage = (userid) => {
    let data = new FormData();
    data.append("action", "userDeletePostImage");
    data.append("user_id", userid);
    data.append("img_id", "1");
    console.log(data);
    userDeletePostImage("POST", data).then(data=>{
    this.setState({ isLoading: false,isFetching:false })
    console.log("Posts", data);
    this.setState({ deleteImage: data.data,isFetching:false})

  })
}
  render() {
    return (
      <DismissKeyboard>
          <View style = { styles.MainContainer }>
            <Appbar.Header>
            <Appbar.BackAction 
                icon="back"
                onPress={this.navigateToHome} 
            />
            <Appbar.Content 
               
                title="Whats on your mind"/>
               
             <Appbar.Action 
                  icon="send"
                  onPress={()=>this.handlePost()} />
              <ActivityIndicator animating={this.state.isLoading} color="#ffffff" />
            </Appbar.Header>
          <View style={styles.card}>
          <Card >  
              <View  style={styles.txtDescription}>
                  <TextInput style={{height:'auto'}}
                        placeholder='Enter Description'
                        mode='outlined'
                        multiline={true}
                        value={this.state.description}
                        onChangeText = {description => this.setState({ description })}>
                  </TextInput>
              <View>
              <TouchableOpacity 
                  onPress={()=> this.showActionSheet()} 
                  style={styles.button} >
                <Image style={styles.profileCameraImage} 
                source={require('../../assets/images/icons/circleCamera2.png')}
                />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
     </View>
    <View >
       <Text style={styles.postSelect}>Select Post</Text>
    </View>
    <RadioButton.Group
        onValueChange={post_type => this.setState({ post_type })}
        value={this.state.post_type}
    >
    <View style={{ flexDirection: 'row'}}>
      <RadioButton  style={styles.publicPost}
                    value="Public"
      />
    <Text style={{marginTop: 10}}>
        Public
    </Text>
    <MaterialIcons
            style={styles.publicPost}
            name="public" size={20} />   

    <RadioButton  style={styles.Unfilledround}
                  value="Private"
                  
    />
    <Text style={{marginTop: 12}}>
          Private
    </Text>
    <EvilIcons
            style={styles.publicPost}
            name="lock" size={28} />   
     
    </View>
   </RadioButton.Group>
   {/* <View style={ styles.bottomView} >   
      <TouchableOpacity onPress={this.handlePost}>
          <Text style={{color:'white',fontSize:16}}
                uppercase={false}>
                  Post
          </Text>
          <View style={{ position: 'absolute', 
              top:"50%",
              right: 0, 
              left: 0 }}>
            
          </View>
        </TouchableOpacity>
      </View> */}
      <Snackbar
          duration={2100}
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}>
          {this.state.message}
      </Snackbar>
      <View style={styles.container}>
          <View style={[styles.avatar, styles.avatarContainer ]}>
              <Image style={styles.avatar} 
                source={this.state.avatarSource} 
              />
              {/* <TouchableOpacity style={styles.clearImage}>
                  <MaterialIcons name="cancel" size={20} /> 
              </TouchableOpacity> */}
          </View>
      </View>
  </View> 
</DismissKeyboard>
  );
 }
 
}

export default NewPost;