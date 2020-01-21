import React, { Component } from 'react';
import {Text,View,TouchableOpacity,Image,FlatList,Keyboard} from 'react-native';
import { DrawerActions } from 'react-navigation';
import {Appbar,Button} from 'react-native-paper';
import ActionSheet from 'react-native-actionsheet';
import theme from './../../theme';
import styles from './styles';
import {userConversation} from './../../api';
import Loader from './../../Loader';
import{getData} from './../../helper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

 class MessageList extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor})=>( // ../../../assets/
        <Image source={require('../../../src/assets/images/icons/message.png')} style={[theme.icon, {tintColor: tintColor}]} />
    )
}
_refresh = () => {
  return new Promise((resolve) => {
    setTimeout(()=>{resolve()}, 2000)
  });
}

showActionSheet = (item) => {
  this.setState({ userPicked: item },this.ActionSheet.show())
  
};
  constructor(props) {
    super(props);
    this.state = {
      user_id:'',
      action:'',
      timezone:'',
      page:'',
      first_name: '',
      message : [],
      is_liked: false,
      isFetching: false,
      items: [],
      loading:true,
      public:'',
      private:'',
      userPicked: {},
      friendmessagelist:''
    };
  }
  getFriendMessageList = (userid) => {
   
    let data = new FormData();
    data.append("action", "userConversation");
    data.append("user_id", userid);
    data.append("page", "1");
    data.append("timezone",Intl.DateTimeFormat().resolvedOptions().timeZone)
    console.log(data);
    userConversation("POST", data).then(data=>{
    this.setState({ isLoading: false })
    console.log(data);
    console.log(data);
    this.setState({ friendmessagelist: data.data,isFetching:false })

})
}


onRefresh = async() =>{
  let user = await getData("user");
  user = JSON.parse(user);
  this.setState({ isFetching: true }, function() { this.getFriendMessageList(user.id) });
}
navigateToUser = (user) =>{
  this.props.navigation.navigate('UserProfile',{user});
}
componentWillMount = async() =>{
  console.log("Friend Message List");
  let user = await getData("user");
  user = JSON.parse(user);
  this.getFriendMessageList(user.id);

  }
  
  renderItem = ({item}) => {
   
    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={()=>this.navigateToUser(item)}>
                <Image source={{ uri: item.userData.profile_img }} style={styles.pic} />
            </TouchableOpacity>
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
                    {item.userData.first_name}
              </Text>
                <TouchableOpacity  onPress={()=>this.showActionSheet(item)}>
                    <MaterialCommunityIcons
                        style={styles.horizontalDots}
                        name="chat" size={24} 
                    />     
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
            <Text style={styles.msgTxt} numberOfLines={1} >
                {item.message}
            </Text>
            <Ionicons style={styles.readStatus}
                        name="ios-checkmark-circle-outline" 
                        size={20} 
            />
          </View>
        </View> 
      </View>
        
    );
  }

  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }
  navigateToMessages = () =>{
    console.log('MessageView');
    this.props.navigation.navigate('Messages');
  }
   render() {
    const{friendmessagelist} = this.state
    return(
     <View style={{ flex: 1 }} >
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={this._openMenu} />
        <Appbar.Content titleStyle={styles.headerTitle} title="Chats"/></Appbar.Header>
        <Loader loading={this.state.isLoading}/>
        { this.state.friendmessagelist.length === 0 && 
           (<Image  
            style={styles.norecordImage}
            source={require('./../../assets/images/NoRecordFound.png')}/>) 
        }
        <FlatList 
          data={friendmessagelist}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          renderItem={this.renderItem}/>
      </View>
   
    );
  }
}



export default MessageList;