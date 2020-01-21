import React, { Component } from 'react';
import { Image} from 'react-native';
import FollowingPostTab from './../FollowingPostTab';
import FriendsPostTab from './../FriendsPostTab';
import MyProfileTab from './../MyProfileTab';
import NewPost from './../NewPost';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './../Home';
import { createBottomTabNavigator, createAppContainer,TabBarBottom } from 'react-navigation';



export default createAppContainer(createBottomTabNavigator(
  {
    Home: { 
      screen: Home, 
      navigationOptions: {  
        tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-home"  color={tintColor} size={24}/>
        )
      }
    },
    FollowingPostTab: { screen: FollowingPostTab,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-person-add" size={24} color={tintColor}/>
        )
        
      }
    
    },
    NewPost:{
      screen:NewPost,
      navigationOptions: {
        tabBarVisible:false,
        transitionConfig: { isModal: true },
        tabBarIcon: ({ tintColor }) => (

          <Image source={require('../../assets/images/icons/plus.png')}
          style={{height:70,width:70,resizeMode: 'contain'}}
          color={tintColor}>
          </Image>
        ),
     
      },
      tabBarVisible:true,
    },
    FriendsPostTab:{screen:FriendsPostTab,
      
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-people"  size={24} color={tintColor}/>
        )
        
      }
    },
    MyProfileTab:{screen:MyProfileTab,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-person" size={24} color={tintColor}/>
        )
        
      }
    }
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
    activeTintColor: 'blue',
    inactiveTintColor: 'gray',
    showIcon: true ,
    showLabel:false,
    
    },
    animationEnabled: false,
    swipeEnabled: false,
  }

  
));
