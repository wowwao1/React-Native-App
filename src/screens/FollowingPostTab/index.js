import React, { Component } from 'react';
import { View, Text ,Image,Keyboard,StyleSheet,TouchableOpacity,FlatList,ScrollView,Modal,Alert} from 'react-native';
import { DrawerActions } from 'react-navigation';
import {Appbar,Card,Avatar,List, Button,icon} from 'react-native-paper';
import styles from './styles';
import ActionSheet from 'react-native-actionsheet';
import Loader from './../../Loader';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DoubleTap from './../DoubleTap';
import {userFollowPost} from './../../api';
import {userLikePost} from './../../api';
import{getData} from './../../helper';
import Autolink from 'react-native-autolink';
import Comments from './../Comments'
import {userReportPost} from './../../api';
import MaterialIcons from'react-native-vector-icons/MaterialIcons';
import{sendNotification} from './../../api';
import{updateFCM} from './../../api';
import OneSignal from 'react-native-onesignal';
import {userBlock} from './../../api';
class FollowingPostTab extends React.Component {
  pinZoomLayoutRef=React.createRef();
  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }
  navigateToUserprofile = () => {
    this.props.navigation.navigate('UserProfile');
    }
    // navigateComment= () =>{
    //   this.props.navigation.navigate('Comments');
    // }
    showActionSheet = (item) => {
      this.setState({ postSelected: item }, this.ActionSheet.show())
    };
  _refresh = () => {
    return new Promise((resolve) => {
      setTimeout(()=>{resolve()}, 2000)
    });
  }
  blockAlert = (user) => {  
    Alert.alert(  
      'Block User',  
      'You really want block this user?',  
        [  
            {  
                text: 'Cancel',  
                onPress: () => console.log('Cancel Pressed'),  
                style: 'cancel',  
            },  
              {text: 'Block', onPress: () => this.blockUser(user)},  
        ]  
    );  
  }
  constructor(props) {
    let requiresConsent = false;
    super(props);
    this.state = {
      user_id:'',
      action:'',
      timezone:'',
      page:'',
      first_name: '',
      posts : [],
      isFetching: false,
      items: [],
      loading:true,
      public:'',
      private:'',
      showComments: false,
      postSelected: {},
      userPicked: {},
      postActions : [],
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
  serachView = () =>{
    this.props.navigation.navigate('Search');
  }
    getFollowersPosts = (userid) => {
      let data = new FormData();
      data.append("action", "userFollowPost");
      data.append("user_id", userid);
      data.append("timezone",  Intl.DateTimeFormat().resolvedOptions().timeZone);
      data.append("page", "1");
     
      console.log(data);
      userFollowPost("POST", data).then(data=>{
      this.setState({ isLoading: false })
      console.log(data);
      this.setState({ posts: data.data, isFetching:false })
  })
}
sendPostLikeNotification = async(post) => {
  let authUser = await getData('user');
  let data = new FormData();
  data.append("action", "sendNotification");
  data.append("user_id", JSON.parse(authUser).id);
  data.append("friend_id",post.userData.id);
  data.append("friend_token",post.userData.FCM_TOKEN);
  data.append("user_name",JSON.parse(authUser).first_name);
  data.append("notification_action","post_like" );
  console.log(data);
  sendNotification("POST", data).then(data=>{
  this.setState({ isLoading: false,isFetching:false })
  console.log("LikeNotification", data);
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

getuserLikePost = (userid,post) => {
  let data = new FormData();
  data.append("action", "userLikePost");
  data.append("user_id", userid);
  data.append("post_id", post.id);
  console.log("POST LIKED", post.is_liked);
  if(post.is_liked=='n'){
    data.append("like_action", "Like");
    this.sendPostLikeNotification(post)
  }
  else{
    data.append("like_action", "Unlike")
  }
  console.log(data);
  userLikePost("POST", data).then(data=>{
  console.log("Posts", data);
})
}
getUserCommentList = (userid,post) => {
  let data = new FormData();
  data.append("action", "userCommentList");
  data.append("user_id", userid);
  data.append("post_id",post.id)
  data.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
  data.append("page", "1");
  console.log(data);
  userCommentList("POST", data).then(data=>{
  console.log(data);
  this.setState({ usercomments: data.data })
})
}
onCommentPost = async(item) => {
  console.log(item)
  let user =  await getData("user");
  user = JSON.parse(user);
  this.getUserCommentList(user.id,item)
  this.setState( prevState => ({
    userposts: prevState.userposts.map(post => {
      if(post.id === item.id) {
        return {
          ...post,
         
          total_comment: post.comment == 'n' ? parseInt(post.total_comment)+1 : parseInt(post.total_comment)-1,
        }
      }
      return post;
    })
  }))
}
onRefresh = async() =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.setState({ isFetching: true }, function() { this.getFollowersPosts(user.id) });
}
convertUnicode = (input) => {
  return input.replace(/\\u(\w{4,4})/g,function(a,b) {
    var charcode = parseInt(b,16);
    return String.fromCharCode(charcode);
  });
}
navigateComment= (post) =>{
  this.setState({ postSelected: post, showComments: true })
}

navigateToUserprofile = (user) => {
  this.props.navigation.navigate('UserProfile', { user });
}
componentWillMount = async() =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.getFollowersPosts(user.id)
  
}

onLikePost = async(item) => {
  console.log(item)
  let user =  await getData("user");
  user = JSON.parse(user);
  this.getuserLikePost(user.id,item)
  this.setState(prevState => ({
    posts: prevState.posts.map(post => {
      if(post.id === item.id) {
        return {
          ...post,
          is_liked: post.is_liked == 'y' ? 'n' : 'y',
          total_like: post.is_liked == 'n' ? parseInt(post.total_like)+1 : parseInt(post.total_like)-1,
        }
      }
      return post;
    })
  }))
}
reportPost = async() => {
  let authUser = await getData('user');
  let data = new FormData();
  data.append("action", "userReportPost");
  data.append("user_id",JSON.parse(authUser).id);
  data.append("post_id", this.state.postSelected.id);
  data.append("post_user_id",JSON.parse(authUser).id);
  console.log(data);
  let response = await userReportPost("POST", data);

  console.log("Posts", data);
  if(response.status==true){
    Alert.alert("Post Reported Successfully!");
  }
  else{
    Alert.alert("Post Already Reported By You!");
  }
}
blockUser = async() => {
  let authUser = await getData('user');
  let data = new FormData();
  data.append("action", "userBlock");
  data.append("sender_id", JSON.parse(authUser).id);
  data.append("receiver_id",this.state.postSelected.userData.id );
  data.append("block_action","Block")
  console.log(data);
  userBlock("POST", data).then(data=>{
    if(data.status) {
     
      this.setState({ posts: data.data ,isFetching:false})
      this.getFollowersPosts(JSON.parse(authUser).id)
    }
  })
}
render() {
  const { posts} = this.state;

  return (
    <View style={{flex: 1}}>
        <Appbar.Header >
          <Appbar.Action icon="menu" onPress={this._openMenu} />
          <Appbar.Content titleStyle={styles.headerTitle} title="Home"/>
          </Appbar.Header>
          <View style={{flex:1}}>
              <View >
                <Card style={styles.postView}>
                  <View>
                  <Loader loading={this.state.isLoading}></Loader>
                    { this.state.posts.length === 0 && 
                      (<Image  
                        style={styles.norecordImage}
                        source={require('./../../assets/images/NoRecordWOWWAO1.jpg')}/>) 
                    }
                    <FlatList 
                            style={styles.userPost}
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            extraData={this.state}
                            data={posts}
                            keyExtractor = {(item) => {
                              return item.id;
                          }}
                          renderItem={this.renderItem}
                          
                          />
                  </View>
                  </Card>   
                </View>
                <Modal 
                  animationType="slide"
                  transparent={false}
                  visible={this.state.showComments}
                  onRequestClose={() => {
                    console.log('Modal has been closed.');
                  }}
                >
                  <Comments  post={this.state.postSelected} onModalClose={(noComments, post)=> this.updateComments(noComments, post) } />
                </Modal>
          </View>
        </View>
  );
}

updateComments = (noComments, commentedPost) => {
  console.log("Number of comments "+noComments)
  this.setState({ showComments: false })
  this.setState(prevState => ({
    posts: prevState.posts.map(post => {
      if(post.id === commentedPost.id) {
        return {
          ...post,
          total_comment: noComments
        }
      }
      return post;
    })
  }))
}

chooseOption = (index) =>{
  if(index == 0){
      this.reportPost();
  }
  else if (index == 1) {
      this.blockAlert();
    }
  
  
}
renderItem = ({item}) => {
  var optionArray = [
    'Report ',
    'Block',
    'Cancel'
    
  ];
  
  
return (
      
  <View >   
  <View >
      <Loader 
        loading={this.state.isLoading}>
      </Loader>
      <TouchableOpacity onPress={()=>this.navigateToUserprofile(item.userData)}>
          <Image  source={{ uri: item.userData.profile_img }} style={styles.pic} />
      </TouchableOpacity>
      <Text style={styles.nameTxt1} numberOfLines={1} 
          >{item.userData.first_name}
      </Text>
      <Text style={styles.dateTxt}>
        {item.post_date}
      </Text> 
    <View style={styles.combine}>
    <View style={styles.privacyImage}>
      { item.post_type == "Public" ? 
        <MaterialIcons
          
          name="public" size={15} />    
        :
        <EvilIcons
           
            name="lock" size={28} /> 
      }
  </View>
  <TouchableOpacity  
          onPress={()=>this.showActionSheet(item)}>
              <MaterialCommunityIcons
               style={styles.verticalImg}
                name="dots-vertical" size={24} />     
      </TouchableOpacity>
    </View>
 
  <ActionSheet ref={o => (this.ActionSheet = o)}

            title={''}

            options={optionArray}

            cancelButtonIndex={4}

            destructiveButtonIndex={1}

            onPress={(index)=> this.chooseOption(index)}/>
  
  
  <View style={styles.postTextSize}>
      <Autolink 
          numberOfLines={0} 
          ellipsizeMode={'tail'} 
           text ={this.convertUnicode(item.post_text).replace(/(\r\n|\r|\\n)/gm, '')}>
      </Autolink>
     
  </View>
  <ScrollView maximumZoomScale={5} 
        scrollEnabled={true}
        minimumZoomScale={1} 
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
   
  <DoubleTap 
        onDoubleTap={() =>this.onLikePost(item)}>
        { item.image.length > 0 && 
          <Image source={{ uri: item.image[0].path }} 
              style={styles.postImage} 
              resizeMode="cover" />  }
 
  </DoubleTap>
  
  </ScrollView>
  <View style={styles.iconRow}>
  <View style={{flexDirection:'row'}}>
  <TouchableOpacity  onPress={()=>this.onLikePost(item)}>
      <Image
            source={(item.is_liked=== 'y') ?
            require('../../assets/images/icons/heart.png') : 
            require('../../assets/images/icons/heart-outline.png')}
            style={styles.heartIcon}
            resizeMode="cover"/>
  </TouchableOpacity>

  <Text style={{marginLeft: 9,marginTop: 2}}>
        {item.total_like}
  </Text>
  <TouchableOpacity onPress={()=>this.navigateComment(item)}>
        <EvilIcons name="comment" size={30} 
            style={{marginLeft: 30}} 
        />
  </TouchableOpacity>
      <Text style={{marginLeft: 9,marginTop: 2,}}>
            {item.total_comment}
      </Text>
  </View>
</View>
  </View>

</View>

);
}

}
export default FollowingPostTab;