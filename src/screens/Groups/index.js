

import React from "react"
import {
  ChatkitProvider,
  TokenProvider,
  withChatkit,
} from "@pusher/chatkit-client-react"
import { View, Text ,Image} from 'react-native';
import {Appbar} from 'react-native-paper';
import Chat from './../../components/Chat';
import UserList from './../../components/UserList';
import{getData} from './../../helper';
import {createAppChatKitUser} from './../../api';
import Loader from './../../Loader';
import { GiftedChat, Send, Message } from "react-native-gifted-chat";
const instanceLocator = "v1:us1:d832d461-6de1-4506-82a8-f485ff3cebb6"
const userId = "alice"
const otherUserId = "bob"

const tokenProvider = new TokenProvider({
  url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/d832d461-6de1-4506-82a8-f485ff3cebb6/token",
});
 
class Groups extends React.Component {

  state = {
    userId: "",
    friendId : "",
    isLoading : true
  }

  static navigationOptions = {
    drawerIcon: ({tintColor})=>( // ../../../assets/
        <Image source={require('../../../src/assets/images/icons/message.png')}  style={{height:24,width:24}}/>
    )
  }

  CreateAppChatKitUser = (user) =>{

    console.log("CREATING USER",user)
      let data = new FormData();
      data.append("action", "createAppChatKitUser");
      data.append("user_id", user.id);
      data.append("name", user.first_name);
      data.append("avatar_url",user.profile_img)
      console.log("USER DATA", data);
      createAppChatKitUser("POST", data).then((data)=>{
        console.log("User CREATED SUCCESSFULLY");
        console.log(data);
        this.setState({ isLoading: false })
      })
  }

  getUserId = () => {
    console.log(this.props.navigation.getParam("userId"))
    this.setState({
      userId : this.props.navigation.getParam("userId"),
      friendId : this.props.navigation.getParam("friend").id
    },()=>{
      console.log("UserID",this.state.userId)
      console.log("FriendID",this.state.friendId)
      this.CreateAppChatKitUser(this.props.navigation.getParam("friend"));
    })
  }


  componentDidMount() {
    this.props.navigation.addListener('didFocus', ()=>{
      this.getUserId();
    })
  }

  render() {
    
    return(
      <View>
      <Appbar.Header>
      <Appbar.BackAction icon="back" onPress={this.navigateToHome} />
      <Appbar.Content  title="Chat"/></Appbar.Header>
      <Loader loading={this.state.isLoading}/>
      
       
        <View className="App">
          {!this.state.isLoading ? (
            <>
              <View className="App__chatwindow">
                 {/* <UserList userId={this.state.userId}/>  */}
                <ChatkitProvider
                  instanceLocator={instanceLocator}
                  tokenProvider={tokenProvider}
                  userId={this.state.userId}
                  >
                  <Chat otherUserId={this.state.friendId} />
                </ChatkitProvider>
              </View>
            </>
          ) : (
          <Text>Noting here</Text>
          )}
        </View>
   
      </View>
    )
  }
}

const WelcomeMessage = withChatkit(props => {
  return (
    <View>
      <Text>{props.chatkit.isLoading
        ? 'Connecting to Chatkit...'
        : `Hello ${props.chatkit.currentUser.name}!`}
        </Text>
    </View>
  );
});

export default Groups;






















