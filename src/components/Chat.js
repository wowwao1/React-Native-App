
import React, { Component } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert,Image} from "react-native";
import { GiftedChat, Send, Message, MessageImage } from "react-native-gifted-chat";
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import Icon from "react-native-vector-icons/FontAwesome";
import {Appbar} from 'react-native-paper';
//import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";
import DocumentPicker from 'react-native-document-picker';
import * as mime from "react-native-mime-types";
import ImagePicker from 'react-native-image-picker';
import Modal from "react-native-modal";
import RNFS from "react-native-fs";
import ChatBubble from "./ChatBubble";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import SlackMessage from './SlackMessage';
import BtnRound from "./BtnRound";
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { withNavigation } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
const CHATKIT_INSTANCE_LOCATOR_ID = "v1:us1:d832d461-6de1-4506-82a8-f485ff3cebb6"//`v1:us1:${Config.CHATKIT_INSTANCE_LOCATOR_ID}`;
const CHATKIT_SECRET_KEY = "e5664d36-b04e-4e12-9f45-c34c8d891b30:PHaE+DrDznXXv68OfCwpMjb4B4zAWTAztcpjM5BW6qg="//Config.CHATKIT_SECRET_KEY;
const CHAT_SERVER = "https://mysterious-refuge-58633.herokuapp.com";
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = `${CHAT_SERVER}/auth`;
import{sendNotification} from '../api';
import{updateFCM} from '../api';
import OneSignal from 'react-native-onesignal';
import{getData} from '../helper';


class Chat extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params.room_name,
      headerRight: (
        <View style={styles.header_right}>
          <TouchableOpacity style={styles.header_button_container} onPress={params.showUsersModal}>
            <View style={styles.header_button}>
              <Text style={styles.header_button_text}>Users</Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#333"
      },
      headerTitleStyle: {
        color: "#FFF"
      }
    };
  };
  
  state = {
    
    company_users: null,
    room_users: null,
    messages: [],
    is_initialized: false,
    is_picking_file: false,
    show_load_earlier: false,

    is_video_modal_visible: false,
    is_last_viewed_message_modal_visible: false,
    is_users_modal_visible: false,
    avatarSource: null,
    is_typing: false,
    typing_user: null,
    renderMessageImage: null,
    renderMessageText: null,
    viewed_user: null,
    viewed_message: null,
  
      
  };
  
  constructor(props) {
    let requiresConsent = false;
    super(props);
    this.state = {
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
    })
  
    const { navigation } = this.props;

    this.user_id = this.props.navigation.getParam("userId"); //"154"; // navigation.getParam("154");
    
    console.log("USERID",this.user_id)
    
   
    this.room_id = this.props.navigation.getParam("roomId");
    this.friend_id = this.props.navigation.getParam("friendId")
    this.friend_token = this.props.navigation.getParam("friendToken")
    this.friend_Profile = this.props.navigation.getParam("friendProfile").first_name;
    this.friendProfileImage = this.props.navigation.getParam("friendProfile").profile_img;
    console.log("FirendID:",this.friend_id)
    console.log("firendTOKEN:",this.friend_token)
    console.log("ROOM-ID",this.room_id,)
    console.log("Friend-Profile",this.friend_Profile);
    console.log("Friend-Profile-Image",this.friendProfileImage);
    this.is_room_admin = ''; //navigation.getParam("is_room_admin");

    this.modal_types = {
      video: 'is_video_modal_visible',
      last_viewed_message: 'is_last_viewed_message_modal_visible',
      users: 'is_users_modal_visible'
    }
    
  }
  
  sendMessageNotification = async() => {
    let authUser = await getData('user');
    let data = new FormData();
    data.append("action", "sendNotification");
    data.append("user_id", JSON.parse(authUser).id);
    data.append("friend_id",this.friend_id);
    data.append("friend_token",this.friend_token);
    data.append("user_name",JSON.parse(authUser).first_name);
    data.append("notification_action","user_msg" );
    console.log(data);
    sendNotification("POST", data).then(data=>{
    this.setState({ isLoading: false,isFetching:false })
    console.log("UserFollowNotification", data);
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
  

componentWillMount() {
    OneSignal.inFocusDisplaying(0);
    OneSignal.removeEventListener('opened', this.onOpened.bind(this));
    OneSignal.addEventListener('opened', this.onOpened.bind(this));
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
    let data = openResult.notification.payload.additionalData;
    this.props.navigation.navigate('Chat', data)
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
    let data = new FormData();
    data.append("action", "updateFCM");
    data.append("user_id", this.user_id);
    data.append("token",device.userId);
  
  
  
    console.log(data);
    updateFCM("POST", data).then(data=>{
    this.setState({ isLoading: false,isFetching:false })
    console.log("FCMTOKEN IS UPDATED", data);
    })
  }
  async componentDidMount() {

    this.props.navigation.setParams({
      showUsersModal: this.showUsersModal
    });

    try {
      const chatManager = new ChatManager({
        instanceLocator: CHATKIT_INSTANCE_LOCATOR_ID,
        userId: this.user_id,
        tokenProvider: new TokenProvider({ url: CHATKIT_TOKEN_PROVIDER_ENDPOINT })
      });
    
      let currentUser = await chatManager.connect();
      let friendUser = this.props.navigation.getParam("friendProfile").first_name
      let friendUserId = this.props.navigation.getParam("friendProfile").id
      let friendProfileImage = this.props.navigation.getParam("friendProfile").profile_img;
      this.currentUser = currentUser;
      this.friendUser = friendUser
      this.friendUserId = friendUserId
      this.friendProfileImage = friendProfileImage
      console.log("Current User", currentUser)
      console.log("Friend User",friendUser)
      console.log("Friend Id",friendUserId)
      console.log("Friend Profile Image",friendProfileImage)
      //this.room_id = currentUser.rooms[0].id
      console.log("RoomID",this.room_id)
      // let avatar = currentUser.users.avatarURL
     //console.log("AVATAR",avatar)
      await this.currentUser.subscribeToRoomMultipart({
        roomId: this.room_id,
        hooks: {
          onMessage: this.onReceive,
          onUserStartedTyping: this.startTyping,
          onUserStoppedTyping: this.stopTyping
        }
      });

      await this.setState({
        is_initialized: true,
        room_users:this.currentUser.users//this.friendUser
      });

    } catch (chat_mgr_err) {
      console.log("error with chat manager: here ", chat_mgr_err);
    }
  }


  startTyping = (user) => {
    this.setState({
      is_typing: true,
      typing_user: user.name
    });
  }


  stopTyping = (user) => {
    this.setState({
      is_typing: false,
      typing_user: null
    });
  }

  onReceive = async (data) => {
    this.last_message_id = data.id;
    const { message } = await this.getMessage(data);

   
    await this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, message)
    }),()=>{
      console.log("AFTER")
      console.log(this.state.messages)
    });

    if (this.state.messages.length > 9) {
      this.setState({
        show_load_earlier: true
      });
    }
  }

  onSend = async ([message]) => {
    this.sendMessageNotification()
    let message_parts = [
      { type: "text/plain", content: message.text }
    ];
    if(this.attachment){
    for (const res of results) {
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size
        );
        }
    }
    // if (this.attachment) {
    //   const { file_blob, file_name, file_type } = this.attachment;
    //   message_parts.push({
    //     file: file_blob,
    //     name: file_name,
    //     type: file_type
    //   });
    // }

    this.setState({
      is_sending: true
    });

    try {
      if (this.last_message_id) {
        const set_cursor_response = await this.currentUser.setReadCursor({
          roomId: this.room_id,
          position: this.last_message_id
        });
      }

      await this.currentUser.sendMultipartMessage({
        roomId: this.room_id,
        parts: message_parts
      });

      this.attachment = null;
      await this.setState({
        is_sending: false
      });
    } catch (send_msg_err) {
      console.log("error sending message: ", send_msg_err);
    }
  }


  renderSend = props => {
    
    if (this.state.is_sending) {
      return (
        <ActivityIndicator
          size="small"
          color="#0064e1"
          style={[styles.loader, styles.sendLoader]}
        />
      );
    }

    return <Send {...props} />
    
  }
  renderMessageImage = (props) => {
    let image = props.currentMessage;
    let v_width, v_height, max_height = 500;

    if (typeof (props.currentMessage) === 'string') {
        image = JSON.parse(props.currentMessage);
    }

    let rate = image.width / image.height;
    if (image.width >= image.height) {  //w:200,h:100, rate:2
        v_width = 200;
        v_height = v_width / rate
    } else {
        v_height = 200;
        v_width = v_height * rate;
    }
    return (
      <MessageImage
          {...props}
          imageStyle={{ borderRadius: 0, height: v_height, width: v_width, backgroundColor: 'black' }}
          //imageProps={{ defaultSource: require('../../Images/bg_image.jpg') }}
      />)
}
  getMessage = async ({ id, sender, parts, createdAt,image }) => {

    const text = parts.find(part => part.partType === 'inline').payload.content;
    const attachment = parts.find(part => part.partType === 'attachment');

    const attachment_url = (attachment) ? await attachment.payload.url() : null;
    const attachment_type = (attachment) ? attachment.payload.type : null;

    const msg_data = {
      _id: id,
      text: text,
      createdAt: new Date(createdAt),
      user: {
        _id: sender.id,
        name: sender.name,
        avatar:this.friendProfileImage
     
       
      },
     // image:'file:///Users/osx/Library/Developer/CoreSimulator/Devices/42A67DB9-3A83-4670-A717-E46DAF713A71/data/Containers/Data/Application/5F84BBE4-C9FB-4B03-9C5B-AC23B885831F/tmp/69BCF8D5-957D-4BCF-AAD0-D27F2941B6FD.jpg',
    };

    if (attachment) {
      Object.assign(msg_data, { attachment: { url: attachment_url, type: attachment_type } });
    }

    if (attachment && attachment_type.indexOf('video') !== -1) {
      Object.assign(msg_data, { video: attachment_url });
    }

    if (attachment && attachment_type.indexOf('image') !== -1) {
      Object.assign(msg_data, { image: attachment_url });
    }

    return {
      message: msg_data
    };
  }


  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };


  renderMessage = (msg) => {
    const { attachment } = msg.currentMessage;
    const renderBubble = (attachment && attachment.type.indexOf('audio') !== -1) ? this.renderPreview.bind(this, attachment.url) : null;
    const onLongPress = (attachment  && attachment.type.indexOf('video') !== -1) ? this.onLongPressMessageBubble.bind(this, attachment.url) : null;

    const modified_msg = {
      ...msg,
      renderBubble,
      onLongPress,
      videoProps: {
        paused: true
      }
    }

    return <Message {...modified_msg} />
  }


  //

  onLongPressMessageBubble = (link) => {
    this.setState({
      is_video_modal_visible: true,
      video_uri: link
    });
  }


  renderPreview = (uri, bubbleProps) => {
    const text_color = (bubbleProps.position == 'right') ? '#FFF' : '#000';
    const modified_bubbleProps = {
      ...bubbleProps
    };

    return (
      <ChatBubble {...modified_bubbleProps}>
        <AudioPlayer url={uri} />
      </ChatBubble>
    );
  }

  //
  navigateToHome = () =>{
    this.props.navigation.goBack()
}

  render() {
    const {
      is_initialized,
      room_users,
      messages,
      video_uri,
      is_video_modal_visible,
      is_last_viewed_message_modal_visible,
      viewed_user,
      viewed_message,
      is_users_modal_visible,
      is_add_user_modal_visible,
      show_load_earlier,
      typing_user
    } = this.state;


   

    return (
  
      
      <View style={{flex:1}} >
      <Appbar.Header>
      <Appbar.BackAction icon="back" onPress={this.navigateToHome} />
      <FlatList
                  keyExtractor={item => item.id.toString()}
                  data={room_users}
                  renderItem={this.renderUser}
                />
      <Appbar.Content  />
     
               
      </Appbar.Header>
        {(!is_initialized) && (
          <ActivityIndicator
            size="small"
            color="#0064e1"
            style={styles.loader}
          />
        )}

        {is_initialized && (
         <GiftedChat
            messages={messages}
            onSend={messages => this.onSend(messages)}
            alwaysShowSend={true}
            user={{
              _id: this.user_id,
              avatarURL: this.friendProfileImage
            }}  
            renderActions={this.renderCustomActions}
            renderSend={this.renderSend}
            renderMessage={this.renderMessage}
            renderMessageImage={this.renderMessageImage}
            onInputTextChanged={this.onTyping}
            renderFooter={this.renderFooter}
            extraData={{ typing_user }}
            onPressAvatar={this.viewLastReadMessage}
            loadEarlier={show_load_earlier}
            onLoadEarlier={this.loadEarlierMessages}
                   
          />
        )}

        <Modal isVisible={is_video_modal_visible}>
          <View style={styles.modal}>
            <TouchableOpacity onPress={this.hideModal.bind(this, 'video')}>
              <Icon name={"close"} size={20} color={"#565656"} style={styles.close} />
            </TouchableOpacity>
            <VideoPlayer uri={video_uri} />
          </View>
        </Modal>

        {
          viewed_user && viewed_message &&
          <Modal isVisible={is_last_viewed_message_modal_visible}>
            <View style={styles.modal}>
              <View style={styles.modal_header}>
                <Text style={styles.modal_header_text}>Last viewed msg: {viewed_user}</Text>
                <TouchableOpacity onPress={this.hideModal.bind(this, 'last_viewed_message')}>
                  <Icon name={"close"} size={20} color={"#565656"} style={styles.close} />
                </TouchableOpacity>
              </View>

              <View style={styles.modal_body}>
                <Text>Message: {viewed_message}</Text>
              </View>
            </View>
          </Modal>
        }

        {
          room_users &&
          <Modal isVisible={is_users_modal_visible}>
            <View style={styles.modal}>
              <View style={styles.modal_header}>
                <Text style={styles.modal_header_text}>Users</Text>
                <TouchableOpacity onPress={this.hideModal.bind(this, 'users')}>
                  <Icon name={"close"} size={20} color={"#565656"} style={styles.close} />
                </TouchableOpacity>
              </View>

              <View style={styles.modal_body}>
                <FlatList
                  keyExtractor={item => item.id.toString()}
                  data={room_users}
                  renderItem={this.renderUser}
                />
              </View>
            </View>
          </Modal>
        }
      </View>
      
    );
  }

  //

  viewLastReadMessage = async (data) => {
    try {
      const cursor = await this.currentUser.readCursor({
        userId: data.userId,
        roomId: this.room_id
      });

      const viewed_message = this.state.messages.find(msg => msg._id == cursor.position);

      await this.setState({
        viewed_user: data.name,
        is_last_viewed_message_modal_visible: true,
        viewed_message: viewed_message.text ? viewed_message.text : ''
      });
    } catch (view_last_msg_err) {
      console.log("error viewing last message: ", view_last_msg_err);
    }
  }


  showUsersModal = () => {
    this.setState({
      is_users_modal_visible: true
    });
  }

  //

  renderUser = ({ item }) => {
    const { navigation } = this.props;
    let friendUserId = this.props.navigation.getParam("friendProfile").id
    let friendProfilePic = this.props.navigation.getParam("friendProfile").profile_img
    const online_status = item.presenceStore[friendUserId];

    return (
      <View style={styles.list_item_body}>
        <View style={styles.list_item}>
        <Image  source={{ uri: this.friendProfileImage }} style={styles.pic} />
          <Text style={styles.list_item_text}>{this.friend_Profile}</Text>
          <View style={[styles.status_indicator, styles[online_status]]}></View>
        </View>
      </View>
    );
  }

  //

  hideModal = (type) => {
    const modal = this.modal_types[type];
    this.setState({
      [modal]: false
    });
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
        console.log("Img",source.uri)
        this.setState({
          avatarSource: source.uri
        });
      }
    });
	};

  renderCustomActions = () => {
    if (!this.state.is_picking_file) {
      const icon_color = this.attachment ? "#0064e1" : "#808080";

      return (
        <View style={styles.customActionsContainer}>
          <TouchableOpacity onPress={this.openFilePicker}>
            <View style={styles.buttonContainer}>
              <Icon name="paperclip" size={23} color={icon_color} />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={this.showActionSheet}>
            <View style={styles.buttonContainer}>
              <Icon name="camera" size={23} color={icon_color} />
            </View>
          </TouchableOpacity> */}
        </View>

      );
    }

    return (
      <ActivityIndicator size="small" color="#0064e1" style={styles.loader} />
    );
  }

  //

  // openFilePicker = async () => {
  //   await this.setState({
  //     is_picking_file: true
  //   });

  //   DocumentPicker.show({
  //     filetype: [DocumentPickerUtil.allFiles()],
  //   }, async (err, file) => {
  //     if (!err) {

  //       try {
  //         const file_type = mime.contentType(file.fileName);
  //         const base64 = await RNFS.readFile(file.uri, "base64");

  //        // const file_blob = await Blob.build(base64, { type: `${file_type};BASE64` });

  //         this.attachment = {
  //           file_blob: file_blob,
  //           file_name: file.fileName,
  //           file_type: file_type
  //         };

  //         Alert.alert("Success", "File attached!");

  //       } catch (attach_err) {
  //         console.log("error attaching file: ", attach_err);
  //       }
  //     }

  //     this.setState({
  //       is_picking_file: false
  //     });
  //   });
  // }
  openFilePicker = async () => {
    await this.setState({
      is_picking_file: true
    });

    try {
      
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size
        );
        Alert.alert("Success", "File attached!");
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
      
      this.setState({
        is_picking_file: false
      });
    
  }

  
  
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

  onTyping = async () => {
    try {
      await this.currentUser.isTypingIn({ roomId: this.room_id });
    } catch (typing_err) {
      console.log("error setting is typing: ", typing_err);
    }
  }


  renderFooter = () => {
    const { is_typing, typing_user } = this.state;
    if (is_typing) {
      return (
        <View style={styles.footerContainer}>
          
          <Text style={styles.footerText}>
            {typing_user} is typing...
          </Text>
        </View>
      );
    }
    return null;
  }


  loadEarlierMessages = async () => {
    this.setState({
      is_loading: true
    });

    const earliest_message_id = Math.min(
      ...this.state.messages.map(m => parseInt(m._id))
    );

    try {
      let messages = await this.currentUser.fetchMultipartMessages({
        roomId: this.room_id,
        initialId: earliest_message_id,
        direction: "older",
        limit: 10
      });

      if (!messages.length) {
        this.setState({
          show_load_earlier: false
        });
      }

      let earlier_messages = [];
      await this.asyncForEach(messages, async (msg) => {
        let { message } = await this.getMessage(msg);
        earlier_messages.push(message);
      });

      await this.setState(previousState => ({
        messages: previousState.messages.concat(earlier_messages)
      }));
    } catch (err) {
      console.log("error occured while trying to load older messages", err);
    }

    await this.setState({
      is_loading: false
    });
  }

}


const styles = {
  container: {
   flex:1
  },
  loader: {
    paddingTop: 20
  },

  header_right: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },

  header_button_container: {
    marginRight: 10
  },
  header_button: {

  },
  header_button_text: {
    color: '#FFF'
  },

  sendLoader: {
    marginRight: 10,
    marginBottom: 10
  },
  customActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonContainer: {
    padding: 10
  },
  modal: {
   
    backgroundColor: '#FFF'
  },
  close: {
    alignSelf: 'flex-end',
    marginBottom: 10
  },
  modal_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  modal_header_text: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  modal_body: {
    marginTop: 20,
    padding: 20
  },
  centered: {
    alignItems: 'center'
  },
  list_item_body: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  list_item: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  list_item_text: {
    marginLeft: 10,
    fontSize: 20,
    color:'white',
    marginVertical:5,
  },
  status_indicator: {
    width: 10,
    height: 10,
    marginTop: 12,
    borderRadius: 10,
    marginLeft: 5,
  },
  online: {
    backgroundColor: '#1FF31F'
  },
  offline: {
    backgroundColor: '#606060'
  },

  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
    flexDirection:'row'
  },
  pic: {
    flexDirection: 'row',
    borderRadius: 30,
    width: 40,
    height: 40,
    marginLeft:10,
   
},
}

export default  withNavigation(Chat);



// getUserId = () => {
//   console.log(this.props.navigation.getParam("userId"))
//   this.setState({
//     userId : this.props.navigation.getParam("userId"),
//     friendId : this.props.navigation.getParam("friend").id
//   },()=>{
//     console.log("UserID",this.state.userId)
//     console.log("FriendID",this.state.friendId)
//     this.CreateAppChatKitUser(this.props.navigation.getParam("friend"));
//   })
// }

