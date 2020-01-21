import 'react-native-gesture-handler';
import React, { Component } from 'react';
import DoubleTap from './../DoubleTap';
import Loader from './../../Loader';
import Autolink from 'react-native-autolink';
import{getData} from './../../helper';
import { nearByPost } from './../../api';
import {userReportPost} from './../../api';
import {userLikePost} from './../../api';
import{deletePost} from './../../api';
import { View, Text, Image, Keyboard, FlatList, ScrollView, TouchableOpacity, Modal, Alert,Linking} from 'react-native';
import {Appbar,Card,withTheme} from 'react-native-paper';
import ActionSheet from 'react-native-actionsheet';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions } from 'react-navigation';
import styles from './styles';
import Comments from './../Comments'
import  Icon  from 'react-native-vector-icons/Ionicons'
import MaterialIcons from'react-native-vector-icons/MaterialIcons';
import OneSignal from 'react-native-onesignal';
import{sendNotification} from './../../api';
import{updateFCM} from './../../api';
import { Emojione } from 'react-emoji-render';
import {userBlock} from './../../api';

class Home extends Component {
      pinZoomLayoutRef=React.createRef();
    static navigationOptions = {
        drawerIcon: ()=>( 
          <Icon name="ios-home" size={24} />
        ),
    }
  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }
  serachView = () =>{
    this.props.navigation.navigate('Search');
  }
  showActionSheet = (item) => {
      let actions = parseInt(this.state.user.id) == parseInt(item.userData.id) ?
      [ 'Edit', 'Delete', 'Cancel' ] : [ 'Report','Block', 'Cancel' ];
      this.setState({ postSelected: item, postActions: actions }, ()=>{
          this.ActionSheet.show()
      })
  };
  navigateToUserprofile = async (user) => {
   let authUser = await getData("user");
    if(JSON.parse(authUser).id == user.id){
       this.props.navigation.navigate('MyProfileTab', { user });
    }else{
      this.props.navigation.navigate('UserProfile', { user });
    }
  }
  navigateComment= (post) =>{
    this.setState({ postSelected: post, showComments: true })
  }
  onRefresh = async() =>{
    let user = await getData("user");
    user = JSON.parse(user);
    this.setState({ isFetching: true }, function() { this.getNearByPost(user.id) });
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
      super(props);
     
     
      let requiresConsent = false;
      this.state = {
      
        user: {},
        action:'',
        timezone:'',
        page:'',
        first_name: '',
        FCM_TOKEN:'',
        id:'',
        posts : [],
        isFetching: false,
        items: [],
        public:'',
        private:'',
        refreshing:false,
        spinner: false,
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

    getNearByPost = (userid) => {
          let data = new FormData();
          data.append("action", "userNearByPost");
          data.append("user_id", userid);
          data.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
          data.append("page", "1");
          console.log(data);
          nearByPost("POST", data).then(data=>{
          this.setState({ isLoading: false,isFetching:false })
          console.log("Posts", data);
          this.setState({ posts: data.data,isFetching:false})
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
    Linking.removeEventListener('url', this.handleOpenURL);
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
      this.getNearByPost(JSON.parse(authUser).id)
    }
  })
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
    convertUnicode = (input) => {
      return input.replace(/\\u(\w{4,4})/g,function(a,b) {
        var charcode = parseInt(b,16);
        return String.fromCharCode(charcode);
      });
    }
    componentWillMount = async() =>{
      let user = await getData("user");
      user = JSON.parse(user);
      this.setState({ user })
      this.getNearByPost(user.id)
      this.props.navigation.addListener("willFocus",()=>{
        console.log("Getting Near By post");
        this.getNearByPost(user.id);
      });
      // OneSignal.removeEventListener('received', this.onReceived);
      // OneSignal.removeEventListener('opened', this.onOpened);
      // OneSignal.removeEventListener('ids', this.onIds);
     
      OneSignal.addEventListener('received', this.onReceived);
      OneSignal.addEventListener('opened', this.onOpened);
      OneSignal.addEventListener('ids', this.onIds);

    }
    async componentDidMount() {

      if (Platform.OS === 'android') {
        Linking.getInitialURL().then(url => {
          this.navigate(url);
        });
      } else {
          Linking.addEventListener('url', this.handleOpenURL);
        }
      var providedConsent = await OneSignal.userProvidedPrivacyConsent();
  
      this.setState({
        privacyButtonTitle: `Privacy Consent: ${
          providedConsent ? 'Granted' : 'Not Granted'
        }`,
        privacyGranted: providedConsent,
      });
  
      OneSignal.setLocationShared(true);
  
      OneSignal.inFocusDisplaying(2);
  
      this.onReceived = this.onReceived.bind(this);
      this.onOpened = this.onOpened.bind(this);
      this.onIds = this.onIds.bind(this);
      this.onLikePost = this.onLikePost.bind(this);
      this.onInAppMessageClicked = this.onInAppMessageClicked.bind(this);
     
 
    }
    componentWillReceiveProps = async (props) =>{
      let post = await this.props.navigation.getParam("post");
      let posts = this.state.posts;
      let user = await getData("user");
      user = JSON.parse(user);
      this.getNearByPost(user.id)
      
    }
    onLikePost = async(item) => {
        console.log(item)
        let user =  await getData("user");
        user = JSON.parse(user);
        this.getuserLikePost(user.id,item)
        this.setState(prevState => ({
        posts: prevState.posts.map(post => {
        if(post.id === item.id) 
        {
          return {
                  ...post,
                  is_liked: post.is_liked == 'y' ? 'n' : 'y',
                  total_like: post.is_liked == 'n' ? 
                  parseInt(post.total_like)+1 : parseInt(post.total_like)-1,
                  }
        }
          return post;
        })
      }))
    }
    getUserCommentList = (userid,post) => {
      let data = new FormData();
      data.append("action", "userCommentList");
      data.append("user_id", userid);
      data.append("post_id",post.id)
      data.append("timezone",  Intl.DateTimeFormat().resolvedOptions().timeZone);
      data.append("page", "1");
      console.log(data);
      userCommentList("POST", data).then(data=>{
      console.log(data);
      this.setState({ usercomments: data.data })
  })
}
deleteMyPost = async(post) => {
  let user = await getData("user");
  user = JSON.parse(user);
  let data = new FormData();
  data.append("action", "deletePost");
  data.append("user_id",user.id);
  data.append("post_id",this.state.postSelected.id);
  console.log(data);
  deletePost("POST", data).then(data=>{
    let newPosts = this.state.posts.filter(post=>{
      return post.id != this.state.postSelected.id;
    });
    this.setState({ posts: newPosts, isFetching: false })
  })
} 
handleOpenURL = (event) => { // D
  this.navigate(event.url);
}
navigate = (url) => { // E
  const { navigate } = this.props.navigation;
  const route = url.replace(/.*?:\/\//g, '');
  const id = route.match(/\/([^\/]+)\/?$/)[1];
  const routeName = route.split('/')[0];

  // if (routeName === 'people') {
  //   navigate('People', { id, name: 'chris' })
  // };
}   
 render() {
      const { posts} = this.state;
      return (
        <View style={{flex: 1}}>
            <Appbar.Header >
              <Appbar.Action icon="menu" onPress={this._openMenu} />
              <Appbar.Content titleStyle={styles.headerTitle} title="Home"/>
              <Appbar.Action icon ='search'  onPress={this.serachView}/>
              </Appbar.Header>
                  <View style={{flex:1}}>
                    <View >
                    <Card style={styles.postView}>
                      
                      <Loader loading={this.state.isLoading}></Loader>
                      { this.state.posts.length === 0 && 
                        (<Image  
                          style={styles.norecordImage}
                          source={require('./../../assets/images/NoRecordWOWWAO1.jpg')}/>) 
                        }
                        <FlatList 
                                style={styles.userPost}
                                extraData={this.state}
                                data={posts}
                                onRefresh={() => this.onRefresh()}
                                refreshing={this.state.isFetching}
                                renderItem={this.renderItem}
                                keyExtractor = {(item) => {
                                  return item.id;
                              }}/> 
                      </Card>
                    </View>   
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
      );
    }
    updateComments = (noComments, commentedPost) => {
          console.log("Number of comments "+noComments)
          this.setState({ showComments: false })
          this.setState(prevState => ({
          posts: prevState.posts.map(post => {
          if(post.id === commentedPost.id) 
          {
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
    if(index == 0) {
      if(parseInt(this.state.user.id) == parseInt(this.state.postSelected.userData.id)) {
        this.onEditPost()
      }else{
        this.reportPost();
      }  
    }
    else if (index == 1) {

      if(parseInt(this.state.user.id) == parseInt(this.state.postSelected.userData.id)) {
        this.deleteMyPost();
      }else{

        this.blockAlert();
      }
    }
  
  }

  onEditPost = () => {
    console.log(this.state.postSelected)
    this.props.navigation.navigate('NewPost',{ EditPost : { ...this.state.postSelected, editMode: true }})
  }


renderItem = ({item}) => {
 
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
              <Text style={styles.statusdiff}>
                  {item.diff}
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
                        name="dots-vertical" size={24} 
                      />     
            </TouchableOpacity>
            </View>
          <ActionSheet ref={o => (this.ActionSheet = o)}
                    title={''}
                    options={this.state.postActions}
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


  

  export default withTheme (Home);