import React, { Component } from 'react';
import {Text,View,TouchableOpacity,Image,FlatList,Keyboard} from 'react-native';
import { DrawerActions } from 'react-navigation';
import {Appbar,Button} from 'react-native-paper';
import theme from './../../theme';
import styles from './styles';
import {userRequest} from './../../api';
import{getData} from './../../helper';
import {userFriendRequestList} from './../../api';
import Loader from './../../Loader';
import{sendNotification} from './../../api';
import{updateFCM} from './../../api';
import OneSignal from 'react-native-onesignal';
class FriendRequest extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor})=>( 
        <Image source={require('../../../src/assets/images/icons/addUser.png')} style={[theme.icon, {tintColor: tintColor}]} />
    )
}
  constructor(props) {
    let requiresConsent = false;
    super(props);
    this.state = {
      receiver_id:'',
      sender_id:'',
      isFetching:false,
      usserreqlist:'',
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
  getUserRequestList = async(userid) => {
    console.log(userid);
    let data = new FormData();
    data.append("action", "userFriendRequestList");
    data.append("user_id", userid);
    data.append("page", "1");
    userFriendRequestList("POST", data).then(data=>{
      console.log(data)
    this.setState({ isLoading: false })
    this.setState({ usserreqlist: data.data,isFetching:false })

  })
}
  addUserRequest = async(user) => {
    let authUser = await getData('user');
    let data = new FormData();
    data.append("action", "userRequest");
    data.append("receiver_id", user.id);
    data.append("sender_id", JSON.parse(authUser).id);
    data.append("request_action", "Accept");
    let response = await userRequest("POST", data);
    if(response.status) {
      this.sendFriendRequestAcceptNotification(user)
      this.props.navigation.goBack();
    }
}
sendFriendRequestAcceptNotification = async(user) => {
  let authUser = await getData('user');
  let data = new FormData();
  data.append("action", "sendNotification");
  data.append("user_id", JSON.parse(authUser).id);
  data.append("friend_id",user.id);
  data.append("friend_token",user.FCM_TOKEN);
  data.append("user_name",JSON.parse(authUser).first_name);
  data.append("notification_action","req_acpt" );
  console.log(data);
  sendNotification("POST", data).then(data=>{
  this.setState({ isLoading: false,isFetching:false })
  console.log("FriendRequestNotification", data);
})
}
rejectUserRequest = async(user) => {
  let authUser = await getData('user');
  let data = new FormData();
  data.append("action", "userRequest");
  data.append("receiver_id", user.id);
  data.append("sender_id", JSON.parse(authUser).id);
  data.append("request_action", "Reject");
  let response = await userRequest("POST", data);
    if(response.status) {
      this.props.navigation.goBack();
    }
}
navigateToUser = (user) =>{
  this.props.navigation.navigate('UserProfile',{user});
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
componentDidMount = async() =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.getUserRequestList(user.id);
}
onRefresh = async() =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.setState({ isFetching: true }, function() { this.getUserRequestList(user.id) });
}
  renderItem = ({item}) => {
    return ( 
        <View style={styles.row}>
          <TouchableOpacity onPress={()=>this.navigateToUser(item)}>
                <Image source={{ uri: item.profile_img }} style={styles.pic} />
          </TouchableOpacity>
          <View>
              <View style={styles.nameContainer}>
                  <Text style={styles.nameTxt} 
                        numberOfLines={1} 
                        ellipsizeMode="tail"
                  >
                      {item.first_name}
                  </Text>
          </View>
           <View style={styles.btnConfirm}>
             <View>
                <TouchableOpacity>
                  <Button 
                      uppercase={false} 
                      style={{width:120}} 
                      mode="contained" 
                      onPress={()=>this.addUserRequest(item)}
                  >
                    Confirm
                  </Button>
                </TouchableOpacity> 
              </View>
              <View>
                  <TouchableOpacity>
                      <Button 
                          uppercase={false} 
                          mode="contained" 
                          color='#DCDCDC'
                          style={{marginLeft:10,width:100}}
                          onPress={()=>this.rejectUserRequest(item)} 
                          > Reject
                      </Button>
                  </TouchableOpacity> 
              </View>
            </View>           
        </View>
    </View>
    );
  }
  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }
  render() {
    
    const { usserreqlist} = this.state;
    return(
     <View style={{ flex: 1 }} >
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={this._openMenu} />
          <Appbar.Content titleStyle={styles.headerTitle} title="Friend Request"/></Appbar.Header>
          <Loader loading={this.state.isLoading}></Loader>
           { this.state.usserreqlist.length === 0 && 
           (<Image  
            style={styles.norecordImage}
            source={require('./../../assets/images/NoRecordWOWWAO1.jpg')}/>) 
           }
            <FlatList 
                extraData={this.state}
                data={usserreqlist}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
                keyExtractor = {(item) => {
                  return item.id;
                }}
                renderItem={this.renderItem}
            />
      </View>
    );
  }
}
export default FriendRequest;