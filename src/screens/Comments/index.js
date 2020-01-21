

import React, { Component } from 'react';
import { View, Text,SafeAreaView,TouchableWithoutFeedback,Keyboard, Alert } from 'react-native';
import {Appbar,Card} from 'react-native-paper';
import { ScrollView } from 'react-native';
import CommentList from './../CommentList';
 import CommentInput from './../CommentInput';
 import styles from './styles';
 import{getData} from './../../helper';
import { userCommentList, addComment } from './../../api';
import Loader from './../../Loader';
import OneSignal from 'react-native-onesignal';
import{sendNotification} from './../../api';
import{updateFCM} from './../../api';
const DismissKeyboard = ({ children }) => (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {children}
        </TouchableWithoutFeedback>
    );
 class Comments extends Component {
  constructor(props) {
    super(props);
    let requiresConsent = false;
    this.state = { 
      comments : [],
      post: {},
      value: '',
      cmnt_time:'',
      total_reply:[],
      isLoading : false,
      BadgeCount:'0',
      initialOpenFromPush: 'Did NOT open from push',
      inAppIsPaused: true,
      requirePrivacyConsent: requiresConsent,
    };
    OneSignal.init('ee5169a7-d089-4de3-98c4-4c6bc8378925', {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.getPermissionSubscriptionState((status) =>{
      console.log("STATUS",status);
    });
  }

  

  closeComments = () =>{
    this.props.onModalClose(this.state.comments.length, this.state.post);
  }

getUserCommentList = (userid) => {
  let data = new FormData();
  data.append("action", "userCommentList");
  data.append("user_id", userid);
  data.append("post_id",this.state.post.id)
  data.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
  data.append("page", "1");

  console.log(data);

  userCommentList("POST", data).then(response=>{
  console.log(response)
  this.setState({ comments: response.data },()=>{
    this.setState({ isLoading: false })
    console.log("User comments");
    console.log(this.state.comments) 
  })
})
}
componentDidMount = async() =>{
    this.setState({ post: this.props.post })
    
    let user = await getData("user");
    user = JSON.parse(user);
    this.getUserCommentList(user.id)
  }

  onUserPost = async () => {
    let user = await getData("user");
    let data = new FormData();
    data.append("action", "addComment");
    data.append("post_id", this.state.post.id);
    data.append("cmnt_text", this.state.value)
    data.append("post_user_id", this.state.post.userData.id);
    data.append("user_id", JSON.parse(user).id);
    data.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

    userCommentList("POST", data).then(response=>{
      
        if(response.status) {
        
          this.onComment();
          
        } else {
          Alert.alert("Error", "Something has went wrong");
        }
    })
  }

  onComment =  async () => {
    let user = await getData("user");
    let newComments = this.state.comments;
    // let commentsTime = this.state.cmnt_time;
    // let replyCount = this.state.total_reply
    this.sendPostCommentNotification()
    newComments.push({
      id : `${parseInt(this.state.post.id) + 1}`,
      userData : JSON.parse(user),
      comment : this.state.value,
      // cmnt_time:this.state.value,
      // total_reply:this.state.value
      
    });

    this.setState(
      { comments: newComments, 
        value: '' ,
      },
      // {
      //   cmnt_time:commentsTime,
      //   value:'',
      // },
      // {
      //   total_reply:replyCount,
      //   value:'',
      // },
      ()=> {
        //console.log(this.state.comments)
      });
  }
  sendPostCommentNotification = async() => {
    let authUser = await getData('user');
    let data = new FormData();
    data.append("action", "sendNotification");
    data.append("user_id", JSON.parse(authUser).id);
    data.append("friend_id",this.state.post.userData.id);
    data.append("friend_token",this.state.post.userData.FCM_TOKEN);
    data.append("user_name",JSON.parse(authUser).first_name);
    data.append("notification_action","post_cmnt" );
    console.log(data);
    sendNotification("POST", data).then(data=>{
    this.setState({ isLoading: false,isFetching:false })
    console.log("PostNotification", data);
  })
}

  componentWillUnmount() {
    //OneSignal.init('ee5169a7-d089-4de3-98c4-4c6bc8378925');

  // OneSignal.addEventListener('received', this.onReceived);
  // OneSignal.addEventListener('opened', this.onOpened);
  // OneSignal.addEventListener('ids', this.onIds);
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  
  }

  onReceived(notification) {
    console.log("Notification received: ", notification.payload);
   // let {BadgeCount} = this.state;
    // let  data  = notification.payload.additionalData;
    // console.log("DATA",data)
    // BadgeCount++;
   //this.setState({ BadgeCount:BadgeCount }) 
  }
decrementBadgeCount(){
  let {BadgeCount} = this.state;
  BadgeCount--;
  this.setState({ BadgeCount }) 
}
  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

   onIds = async(device) => {
    console.log('Device information: ', device);
  console.log('player id: ', device.userId);
 

    this.updateFCM(device).bind(this);
  
  }

  updateFCM = async (device) => {

    console.log("Updating FCM");
    console.log(device);
    let authUser = await getData('user');
    let data = new FormData();
    data.append("action", "updateFCM");
    data.append("user_id", JSON.parse(authUser).id);
    data.append("token",device.userId);
  


    console.log(data);
    updateFCM("POST", data).then(data=>{
    this.setState({ isLoading: false,isFetching:false })
    console.log("FCMTOKEN IS UPDATED", data);
    })
  }

  render() {
    console.log("Re Rendering");
    return (
        <DismissKeyboard>
      <View style={{flex: 1}}>
           
        <Appbar.Header>
          <Appbar.Content 
              titleStyle={styles.headerTitle} 
              title="Comments"/>
          <Appbar.Action 
            icon="close"
            onPress={this.closeComments} 
        />
        </Appbar.Header>
              <ScrollView >
             
              <CommentInput placeholder = "Leave a Comment" 

                onComment={()=> this.onUserPost()}
                onChangeText={(input)=> this.setState({value: input })}      
                value={this.state.value}
             />
              <SafeAreaView >
              <Loader loading={this.state.isLoading}></Loader>
                { this.state.comments.length > 0  &&  
                  <CommentList 
                    comments={this.state.comments}
                  
                  />
                }
           </SafeAreaView>
           
       
        </ScrollView>
      </View>
      </DismissKeyboard>
    );
  }
}
 export default Comments;