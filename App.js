
import 'react-native-gesture-handler';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Login from './src/screens/Login';
import ForgotPassword from './src/screens/ForgotPassword';
import Dashboard from './src/screens/Dashboard';
import Phonenumber from './src/screens/Phonenumber';
import Verificationcode from './src/screens/Verificationcode';
import SignUp from './src/screens/SignUp';
import FollowingPostTab from './src/screens/FollowingPostTab';
import FriendsPostTab from './src/screens/FriendsPostTab';
import MyProfileTab from './src/screens/MyProfileTab';
import EditProfile from './src/screens/EditProfile';
import Search from './src/screens/Search';
import UserProfile from './src/screens/UserProfile';
import Comments from './src/screens/Comments';

import{getData} from './src/helper';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import React from 'react';
import {  View, Text, ActivityIndicator } from 'react-native';
import {decode, encode} from 'base-64';
import Groups from './src/screens/Groups';
import Chat from './src/components/Chat';
import OneSignal from 'react-native-onesignal';
class AuthLoadingScreen extends React.Component {
  constructor(properties) {
    super(properties);
    OneSignal.init("ee5169a7-d089-4de3-98c4-4c6bc8378925");

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
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
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
 let data = openResult.notification.payload.additionalData;
    // // ScreenName is the name of the screen you defined in StackNavigator
     this.props.navigation.navigate('Notifications', data)
   // this.props.navigation.navigate('UserProfile')
    
   console.log('Data: ', openResult.notification.payload.additionalData);
    

  }

  onIds(device) {
    console.log('Device info: ', device);
  }

   async componentDidMount() {
    if (!global.btoa) {
      global.btoa = encode;
    }

    if (!global.atob) {
      global.atob = decode;
    }
    let user = await getData("user");
    if(user) {
        this.props.navigation.navigate('App');
    } else {
        this.props.navigation.navigate('Auth');
    } 
    
    
    
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator 
          animating={true}  
        />
      </View>
    );
  }
}


const AuthStack = createStackNavigator({
  Login: Login,
  ForgotPassword: ForgotPassword,
  SignUp:SignUp,
  Phonenumber:Phonenumber,
  Verificationcode:Verificationcode,

},{
  defaultNavigationOptions: {
    header: null
  }
})

const AppStack = createStackNavigator({ 
  Dashboard: Dashboard,
  FollowingPostTab:FollowingPostTab,
  FriendsPostTab:FriendsPostTab,
  MyProfileTab:MyProfileTab,
  EditProfile:EditProfile,
  Search:Search,
  UserProfile:UserProfile,
  Comments:Comments,
  Chat:Chat
  
},{
  defaultNavigationOptions: {
    header: null
  }
});



const Wow  = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStack,
  App: AppStack,
},
{
  initialRouteName: 'AuthLoading',
})

global.APPURL = 'http://ec2-18-221-119-107.us-east-2.compute.amazonaws.com/api';
global.user_name = '';


const AppNavigator = createAppContainer(Wow);

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1778F2',
    accent: '#f1c40f',
  },
};

const App = () => {
  return(
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  )
}

export default App;