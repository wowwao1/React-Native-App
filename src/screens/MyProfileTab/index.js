import React, { Component } from 'react';
import { View, Text ,Image,Keyboard,StyleSheet,TouchableOpacity,FlatList,ScrollView,RefreshControl,Modal} from 'react-native';
import { DrawerActions } from 'react-navigation';
import {Appbar,Card,Avatar,List, Button,icon} from 'react-native-paper';
import styles from './styles';
import ActionSheet from 'react-native-actionsheet';
import Loader from './../../Loader';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DoubleTap from './../DoubleTap';
import {userProfile} from './../../api';
import {userPost} from './../../api';
import {userLikePost} from './../../api';
import{deletePost} from './../../api';
import{getData} from './../../helper';
import Autolink from 'react-native-autolink';
import Comments from './../Comments'
class MyProfileTab extends React.Component {
 
  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }
  showActionSheet = (item) => {
    this.setState({ postSelected: item }, this.ActionSheet.show())
  };
  constructor(props) {
    super(props);
    this.state = {
      user_id:'',
      action:'',
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
      userposts:''
    };
  }
  getUserProfile = (userid) => {
   
    let data = new FormData();
    data.append("action", "userProfile");
    data.append("sender_id", "56");
    data.append("receiver_id",userid);
    console.log(data);
    userProfile("POST", data).then(data=>{
    this.setState({ isLoading: false })
    console.log(data);
    this.setState({ posts: data.data })

  })
}
componentWillReceiveProps = async (props) =>{
  let profile = await this.props.navigation.getParam("EditProfile");
  console.log("UpdateProfile",profile)
  let user = await getData("user");
  user = JSON.parse(user);
  this.getUserProfile(user.id)
  this.props.navigation.addListener("willFocus",()=>{
    console.log("UPDATING Profile");
    this.getUserProfile(user.id)
  });
  
}
getUserPost = (userid) => {
   
  let data = new FormData();
  data.append("action", "userPost");
  data.append("sender_id","56" );
  data.append("receiver_id",userid);
  data.append("page","1");
  data.append("timezone",Intl.DateTimeFormat().resolvedOptions().timeZone);
  console.log(data);
  userPost("POST", data).then(data=>{
  console.log(data);
  this.setState({ userposts: data.data,isFetching:false})

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
    let newPosts = this.state.userposts.filter(post=>{
      return post.id != this.state.postSelected.id;
    });
    this.setState({ isLoading: false })
    this.setState({ userposts: newPosts, isFetching: false })
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
  }
  else{
    data.append("like_action", "Unlike")
  }
  console.log(data);
  userLikePost("POST", data).then(data=>{
  console.log("Posts", data);
  

})
}
onLikePost = async(item) => {
  console.log(item)
  let user =  await getData("user");
  user = JSON.parse(user);
  this.getuserLikePost(user.id,item)   
  this.setState( prevState => ({
    userposts: prevState.userposts.map(post => {
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
onRefresh = async() =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.setState({ isFetching: true }, function() { this.getUserPost(user.id) });
}
 

componentWillMount = async() =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.getUserProfile(user.id)
  this.getUserPost(user.id)
  this.props.navigation.addListener("willFocus",()=>{
    console.log("UPDATING Profile");
    this.getUserProfile(user.id)
  });
}


convertUnicode = (input) => {
  return input.replace(/\\u(\w{4,4})/g,function(a,b) {
    var charcode = parseInt(b,16);
    return String.fromCharCode(charcode);
  });
}
navigateToEditProfile = async(user) =>{
  console.log("USER",user);
  this.props.navigation.navigate('EditProfile',{ EditProfile:user });
}
navigateComment= (post) =>{
 
  this.setState({ postSelected: post, showComments: true })
}
componentDidMount = async () =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.getUserProfile(user.id);
  this.getUserPost(user.id)
  
}
componentWillMount = async() =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.getUserProfile(user.id);
  this.getUserPost(user.id)
}

 render() {
  const { posts,userposts } = this.state;

  return (
   
          <View style={{flex: 1}}>
              <Appbar.Header>
              <Appbar.Action icon="menu" onPress={this._openMenu} />
              <Appbar.Content titleStyle={styles.headerTitle} title="My Profile"/>
              </Appbar.Header>

                <ScrollView style={{flex: 1}}>
                    <Loader loading={this.state.isLoading}></Loader>
                  <View style={styles.avtarimage}>
                      <Avatar.Image size={80} source={{ uri: posts.profile_img }}  />
                  </View>
                  <View style={styles.name}>
                  <View>
                    <Text style={{textAlign:'center'}}>{posts.total_follower}</Text>
                    <Text>Followers</Text>
                  </View>
                  <View>
                    <Text style={{textAlign:'center'}}>{posts.total_follower}</Text>
                    <Text>Following</Text>
                  </View>
                  <View>
                    <Text style={{textAlign:'center'}}>{posts.total_follower}</Text>
                    <Text>Friends</Text>
                  </View>
                  </View>
                    <View style={styles.profileInfo}>
                  <View >
                  <Text 
                      style={{fontWeight:'400',
                      fontSize:14,
                      textAlign:'justify',
                      padding: 2}}
                  >
                    {posts.first_name}
                  </Text>
                    <Text style={{fontWeight:'100',fontSize:12,textAlign:'justify',padding: 2,}}>
                      {posts.about}
                    </Text>
                  <Text style={{fontWeight:'100',fontSize:10,textAlign:'justify'}}>
                        {posts.phone_no}
                  </Text>
                  </View>
                  <TouchableOpacity>
                      <View style={styles.editProfileBtn}>
                        <Button  
                            uppercase={false} 
                            mode='outlined' 
                            onPress={()=>this.navigateToEditProfile(posts)}>
                            Edit Profile
                        </Button>
                      </View>
                  </TouchableOpacity>
                  </View>
                  <View style={{flex:1}}>
                      <Card style={styles.postView}>
                        <View>
                        <Loader loading={this.state.isLoading}></Loader>
                          { this.state.userposts.length === 0 && 
                            (<Image  
                              style={styles.norecordImage}
                              source={require('./../../assets/images/NoRecordWOWWAO1.jpg')}/>) 
                          }
                            <FlatList 
                                style={styles.userPost}
                                data={userposts}
                                onRefresh={() => this.onRefresh()}
                                refreshing={this.state.isFetching}
                                keyExtractor = {(item) => {
                                return item.id;
                                }}
                                renderItem={this.renderItem}
                              
                            />
                        </View>
                      </Card>   
          </View>
          </ScrollView>
          <Modal 
              animationType="slide"
              transparent={false}
              visible={this.state.showComments}
              onRequestClose={() => {
              console.log('Modal has been closed.');}}
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
    userposts: prevState.userposts.map(post => {
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
  console.log("Post:",this.state.postSelected)
  if(index == 0){
      this.onEditPost();
  }
  else if (index == 1){
    this.deleteMyPost()
  }
  
}
onEditPost = () => {
  console.log(this.state.postSelected)
  this.props.navigation.navigate('NewPost',{ EditPost : { ...this.state.postSelected, editMode: true }})
}
renderItem = ({item}) => {
  var userOptionArray = [
    'Edit',
    'Delete',
    'Cancel'
  ]
 
  return (
    
    <View >
    <View>
        <TouchableOpacity >
        <Image  source={{ uri: item.userData.profile_img }} style={styles.pic} />
        </TouchableOpacity>
        <Text style={styles.nameTxt1} numberOfLines={1} 
            ellipsizeMode="tail">{item.userData.first_name}
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
                   
                    name="lock" size={24} /> 
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

                    options={userOptionArray}

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


export default MyProfileTab;

