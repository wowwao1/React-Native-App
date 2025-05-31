import React, { Component } from 'react';
import { Image } from 'react-native';
import FollowingPostTab from '../../screens/FollowingPostTab';
import FriendsPostTab from '../../screens/FriendsPostTab';
import MyProfileTab from '../../screens/MyProfileTab';
import NewPost from '../../screens/NewPost';
import Home from '../../screens/Home';
import theme from '../../theme';
import { createBottomTabNavigator, createAppContainer, TabBarBottom } from 'react-navigation';

import styles from './styles';

export default createAppContainer(createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          // <Image name="ios-home"  color={tintColor} size={24}/>
          <Image

            source={require('../../assets/images/icons/Home.png')}
            //  {require('./../../assets/images/icons/Home.png')}
            style={[theme.icon, { tintColor: tintColor }]}
          />
        )
      }
    },
    FollowingPostTab: {
      screen: FollowingPostTab,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          //<Ionicons name="ios-person-add" size={24} color={tintColor}/>
          <Image

            source={require('../../assets/images/icons/Following.png')} style={[theme.icon, { tintColor: tintColor }]} />
        )

      }

    },
    NewPost: {
      screen: NewPost,
      navigationOptions: {
        tabBarVisible: false,
        transitionConfig: { isModal: true },
        tabBarIcon: ({ tintColor }) => (

          <Image source={require('../../assets/images/icons/plus.png')}
            style={styles.img}
            color={tintColor}>
          </Image>
        ),

      },
      tabBarVisible: true,
    },
    FriendsPostTab: {
      screen: FriendsPostTab,

      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image

            source={require('../../assets/images/icons/Friends.png')}
            style={[theme.icon, { tintColor: tintColor }]}
          />
        )

      }
    },
    MyProfileTab: {
      screen: MyProfileTab,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Image
            style={styles.img2}
            source={require('../../assets/images/icons/UserProfile.png')}
            style={[theme.icon, { tintColor: tintColor }]}
          />
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
      showIcon: true,
      showLabel: false,

    },
    animationEnabled: false,
    swipeEnabled: false,
  }



));
