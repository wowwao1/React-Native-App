import React, { Component } from 'react';
import { View, Image, FlatList, Keyboard } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { Appbar } from 'react-native-paper';
import theme from './../../theme';
import styles from './styles';
import { sendRequest } from './../../api';
import { getData } from './../../utils/helper';
import OneSignal from 'react-native-onesignal';
import FriendRequestItem from '../../components/FriendRequestItem';
import { Toast } from 'native-base';
import Loading from './../../components/Loading';
import { onIds } from './../../utils/helper';
class FriendRequest extends Component {
	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<Image source={require('../../../src/assets/images/icons/addUser.png')} style={[theme.icon, { tintColor: tintColor }]} />
		)
	}
	constructor(props) {
		let requiresConsent = false;
		super(props);
		this.state = {
			receiver_id: '',
			sender_id: '',
			isFetching: false,
			usserreqlist: [],
			BadgeCount: '0',
			initialOpenFromPush: 'Did NOT open from push',
			inAppIsPaused: true,
			requirePrivacyConsent: requiresConsent,
		};
		OneSignal.init('ee5169a7-d089-4de3-98c4-4c6bc8378925', {
			kOSSettingsKeyAutoPrompt: true,
		});
		OneSignal.addEventListener('received', this.onReceived);
		OneSignal.addEventListener('opened', this.onOpened);
		OneSignal.addEventListener('ids', onIds);
		OneSignal.getPermissionSubscriptionState((status) => {
			console.log("STATUS", status);
		});

	}
	getUserRequestList = async (userid) => {
		console.log(userid);
		let data = new FormData();
		data.append("action", "userFriendRequestList");
		data.append("user_id", userid);
		data.append("page", "1");
		// userFriendRequestList("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log(data)
			this.setState({ usserreqlist: data.data, isFetching: false })

		})
	}
	addUserRequest = async (user, index) => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "userRequest");
		data.append("receiver_id", user.id);
		data.append("sender_id", JSON.parse(authUser).id);
		data.append("request_action", "Accept");
		// let response = await userRequest("POST", data);
		let response = await sendRequest("POST", data);
		if (response.status) {
			this.sendFriendRequestAcceptNotification(user)
			let currentRequest = this.state.usserreqlist;
			currentRequest.splice(index, 1);
			this.setState({
				usserreqlist: currentRequest
			}, () => {
				Toast.show({
					text: "You have accepted this friend request successfully"
				})
			})
		}
	}

	sendFriendRequestAcceptNotification = async (user) => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "sendNotification");
		data.append("user_id", JSON.parse(authUser).id);
		data.append("friend_id", user.id);
		data.append("friend_token", user.FCM_TOKEN);
		data.append("user_name", JSON.parse(authUser).first_name);
		data.append("notification_action", "req_acpt");
		console.log(data);
		//sendNotification("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ isFetching: false })
			console.log("FriendRequestNotification", data);
		})
	}

	rejectUserRequest = async (user, index) => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "userRequest");
		data.append("receiver_id", user.id);
		data.append("sender_id", JSON.parse(authUser).id);
		data.append("request_action", "Reject");
		// let response = await userRequest("POST", data);
		let response = await sendRequest("POST", data);
		if (response.status) {
			let currentRequest = this.state.usserreqlist;
			currentRequest.splice(index, 1);
			this.setState({
				usserreqlist: currentRequest
			}, () => {
				Toast.show({
					text: "You have rejected this friend request successfully"
				})
			})
		}
	}

	navigateToUser = (user) => {
		this.props.navigation.navigate('UserProfile', { user });
	}
	componentWillUnmount() {
		OneSignal.removeEventListener('received', this.onReceived);
		OneSignal.removeEventListener('opened', this.onOpened);
		OneSignal.removeEventListener('ids', onIds);

	}

	onReceived(notification) {
		console.log("Notification received: ", notification.payload);
	}

	decrementBadgeCount() {
		let { BadgeCount } = this.state;
		BadgeCount--;
		this.setState({ BadgeCount })
	}

	onOpened(openResult) {
		console.log('Message: ', openResult.notification.payload.body);
		console.log('Data: ', openResult.notification.payload.additionalData);
		console.log('isActive: ', openResult.notification.isAppInFocus);
		console.log('openResult: ', openResult);
	}



	componentDidMount = async () => {
		let user = await getData("user");
		user = JSON.parse(user);
		this.getUserRequestList(user.id);

		this.props.navigation.addListener("didFocus", () => {
			this.setState({
				usserreqlist: []
			}, () => {
				this.getUserRequestList(user.id);
			})

		});
	}
	onRefresh = async () => {
		let user = await getData("user");
		user = JSON.parse(user);
		this.setState({ isFetching: true }, function () { this.getUserRequestList(user.id) });
	}

	renderItem = ({ item, index }) => {
		return (
			<FriendRequestItem item={item}
				addUserRequest={(item) => this.addUserRequest(item, index)}
				rejectUserRequest={(item) => this.rejectUserRequest(item, index)}
			/>
		);
	}
	_openMenu = () => {
		Keyboard.dismiss();
		this.props.navigation.dispatch(DrawerActions.openDrawer());
	}
	render() {
		const { usserreqlist } = this.state;
		return (
			<View style={{ flex: 1 }} >
				<Appbar.Header>
					<Appbar.Action icon="menu" onPress={this._openMenu} />
					<Appbar.Content titleStyle={styles.headerTitle} title="Friend Request" /></Appbar.Header>

				<View style={{ flex: 1 }}>
					{this.state.usserreqlist.length === 0 &&
						(<Loading />)
					}
					<FlatList
						extraData={this.state}
						data={this.state.usserreqlist}
						onRefresh={() => this.onRefresh()}
						refreshing={this.state.isFetching}

						keyExtractor={(item) => {
							return item.id;
						}}
						renderItem={(item, index) => this.renderItem(item, index)}
					/>
				</View>
			</View>
		);
	}
}
export default FriendRequest;