import React, { Component } from 'react';
import {Text,View,TouchableOpacity,Image,FlatList,Keyboard,RefreshControl,Linking} from 'react-native';
import { DrawerActions } from 'react-navigation';
import {Appbar,Button} from 'react-native-paper';
import theme from './../../theme';
import styles from './styles';
import {userNotificationList} from './../../api';
import Loader from './../../Loader';
import{getData} from './../../helper';
class Notification extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor})=>( // ../../../assets/
        <Image source={require('../../../src/assets/images/icons/notifications.png')} style={[theme.icon, {tintColor: tintColor}]} />
    )
}

constructor(props) {
  super(props);
  this.state = {
    user_id:'',
    action:'',
    timezone:'',
    page:'',
    first_name: '',
    posts : [],
    is_liked: false,
    isFetching: false,
    items: [],
    loading:true,
    public:'',
    private:'',
    notificationlist:''
  };
  
}
_refresh = () => {
  return new Promise((resolve) => {
    setTimeout(()=>{resolve()}, 2000)
  });
}
  getNotificationList = () => {
 
    let data = new FormData();
    data.append("action", "userNotificationList");
    data.append("user_id", "154");
    data.append("page", "1");
   
    console.log(data);
    userNotificationList("POST", data).then(data=>{
    this.setState({ isLoading: false })
    console.log(data);
    this.setState({ notificationlist: data.data,isFetching:false })

})
}
componentDidMount = async() =>{
  if (Platform.OS === 'android') {
    Linking.getInitialURL().then(url => {
      this.navigate(url);
    });
  } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  let user = await getData("user");
  user = JSON.parse(user);
  this.getNotificationList(user.id)
  
  }
  componentWillUnmount() { // C
    Linking.removeEventListener('url', this.handleOpenURL);
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

  onRefresh = async() =>{
    let user = await getData("user");
    user = JSON.parse(user);
    this.setState({ isFetching: true }, function() { this.getNotificationList(user.id) });
  }
  navigateToUser = (user) =>{
    this.props.navigation.navigate('UserProfile',{user});
  }
  renderItem = ({item}) => {
    
    return (
      
        <View style={styles.row}>
         
         <TouchableOpacity onPress={()=>this.navigateToUser(item.userData)}>
            <Image source={{ uri: item.userData.profile_img }} style={styles.pic} />
          </TouchableOpacity>
          
          <View>
            
            <View style={styles.nameContainer}>
                <Text style={styles.nameTxt} numberOfLines={0} ellipsizeMode="tail">{item.noti_message}.
                </Text>
            </View>
            
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>{}</Text>
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
    const { notificationlist } = this.state;
    return(
     
     <View style={{ flex: 1 }} >

      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={this._openMenu} />
        <Appbar.Content titleStyle={styles.headerTitle} title="Notifications"/></Appbar.Header>
        <Loader loading={this.state.isLoading}/>
        { this.state.notificationlist.length === 0 && 
           (<Image  
            style={styles.norecordImage}
            source={require('./../../assets/images/NoRecordWOWWAO1.jpg')}/>) 
        }
        <FlatList 
         data={notificationlist}
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



export default Notification;