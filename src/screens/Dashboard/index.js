import 'react-native-gesture-handler';
import React, { Component, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, AsyncStorage, Alert, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, createAppContainer, DrawerItems } from 'react-navigation';
import { Avatar } from 'react-native-paper';
import HomeDrawer from '../../components/HomeDrawer';
import Friends from './../Friends';
import FriendRequests from './../FriendRequests';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Notifications from './../Notifications';
import BlockedUsers from './../BlockedUsers';
import AccountSettings from './../AccountSettings';
import ContactUs from './../ContactUs';
import styles from './styles';
import { getData } from './../../utils/helper';
import Icon from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler';

const CustomDrawerComponent = (props) => {

	[username, setUsername] = useState('');
	[profile, setProfile] = useState('');

	useEffect(async () => {
		let user = await getData("user");
		user = JSON.parse(user);
		console.log("Dashboard data", user)
		setUsername(user.first_name);
		setProfile(user.profile_img)
	}, []);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.header_main}>
				<View style={styles.image_container1}>
					<Avatar.Image size={70} source={{ uri: profile }} />
				</View>
				<View style={styles.header_text}>
					<Text style={styles.inner_text}>{username}</Text>
				</View>
			</View>
			<ScrollView>
				<DrawerItems {...props} />
				<TouchableOpacity style={styles.logoutContainer} onPress={() =>
					Alert.alert(
						'Sign out',
						'Do you want to Signout?',
						[
							{ text: 'Cancel', onPress: () => { return null } },
							{
								text: 'Confirm', onPress: () => {
									AsyncStorage.clear().then(() => {

										props.navigation.navigate('Auth')
									})

								}
							},
						],
						{ cancelable: false }
					)
				}>
					<Icon name="ios-log-out" size={24} />
					<Text style={styles.logoutText}>Sign&nbsp;Out&nbsp; </Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	)
}

const MyDrawerNavigator = createDrawerNavigator({
	"Home": {
		screen: HomeDrawer, navigationOptions: {
			drawerIcon: ({ tintColor }) => (
				<Ionicons name="ios-home" color={tintColor} size={24} />
			),
			title: 'Home ',
		}
	},
	"Friends": {
		screen: Friends,
		navigationOptions: () =>
			({
				title: 'Friends '
			})
	},
	"Friend Requests": {
		screen: FriendRequests,
		navigationOptions: () =>
			({
				title: String('Friend Requests ')
			})
	},
	"Notifications": {
		screen: Notifications,
		navigationOptions: () =>
			({
				title: 'Notifications '
			})
	},
	"Blocked Users": {
		screen: BlockedUsers,
		navigationOptions: () =>
			({
				title: 'Blocked Users '
			})
	},
	"Account Settings": {
		screen: AccountSettings,
		navigationOptions: () =>
			({
				title: 'Account Settings '
			})
	},
	"Contact Us": {
		screen: ContactUs,
		navigationOptions: () =>
			({
				title: 'Contact Us '
			})
	},
}, {

	contentComponent: CustomDrawerComponent,
	initialRouteName: 'Home',
	contentOptions: {
		activeTintColor: '#00bfff'
	}
});

const MyApp = createAppContainer(MyDrawerNavigator);

export default MyApp;