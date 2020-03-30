import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, Keyboard, Linking } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { Appbar } from 'react-native-paper';
import theme from './../../theme';
import styles from './styles';
import { sendRequest } from './../../api';
import { getData } from './../../utils/helper';

class Notification extends Component {
	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<Image source={require('../../../src/assets/images/icons/notifications.png')} style={[theme.icon, { tintColor: tintColor }]} />
		)
	}
	constructor(props) {
		super(props);
		this.state = {
			user_id: '',
			action: '',
			timezone: '',
			page: '',
			first_name: '',
			posts: [],
			is_liked: false,
			isFetching: false,
			items: [],
			loading: true,
			public: '',
			private: '',
			notificationlist: [],
			page: 1,
			currentPage: 0,
			loadingMore: false,
			user: {},
			NoMoreNotifications: false
		};

	}
	_refresh = () => {
		return new Promise((resolve) => {
			setTimeout(() => { resolve() }, 2000)
		});
	}
	_handleLoadMore = async () => {
		console.log("ON end List");
		let user = await getData("user");
		user = JSON.parse(user);
		if (!this.state.NoMoreNotifications && !this.state.isFetching) {
			this.setState({
				page: this.state.page + 1,
			}, () => {
				this.getNotificationList(user.id);
			})
		}

	};
	getNotificationList = (userid) => {
		let data = new FormData();
		data.append("action", "userNotificationList");
		data.append("user_id", userid);
		data.append("page", this.state.page);
		console.log(data);
		this.setState({ isFetching: true });
		//	userNotificationList("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log("NOTIFICATIONS");
			console.log(data);
			if (data.status) {
				let userFriends = [...this.state.notificationlist, ...data.data];
				this.setState({
					notificationlist: userFriends,
					isFetching: false,
					isLoading: false,
					loadingMore: false,
					NoMoreNotifications: false
				})
			} else {
				this.setState({ loadingMore: false, NoMoreNotifications: true, isFetching: false })
			}
		})
	}
	componentDidMount = async () => {
		if (Platform.OS === 'android') {
			Linking.getInitialURL().then(url => {
				this.navigate(url);
			});
		} else {
			Linking.addEventListener('url', this.handleOpenURL);
		}
		let user = await getData("user");
		user = JSON.parse(user);
		this.setState({ user });
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

	onRefresh = async () => {
		let user = await getData("user");
		user = JSON.parse(user);
		this.setState({ isFetching: true }, function () { this.getNotificationList(user.id) });
	}
	navigateToUser = (user) => {
		this.props.navigation.navigate('UserProfile', { user });
	}
	navigateToSinglePost = (notification) => {

		console.log(notification);
		console.log(this.state.user);

		if (notification.noti_type == "request-received") {
			console.log('request received ....');
			this.props.navigation.navigate('UserProfile', { user: notification.userData });
		} else {
			console.log('Single Post View...');
			let data = { user_id: this.state.user.id, post_id: notification.post_id }
			this.props.navigation.navigate('SinglePostView', { data });
		}

	}
	_renderFooter = () => {
		if (!this.state.loadingMore) return null;

		return (
			<View
				style={{
					position: 'relative',
					width: 'auto',
					height: 'auto',
					paddingVertical: 20,
					marginTop: 10,
					marginBottom: 10,
					borderColor: '#000'
				}}
			>
				<ActivityIndicator animating size="large" />
			</View>
		);
	};

	renderSeparator = () => {
		return (
			<View
				style={{
					height: 2,
					width: '100%',
					backgroundColor: '#CED0CE'
				}}
			/>
		);
	};

	renderItem = ({ item }) => {

		return (

			<View style={styles.row}>
				<TouchableOpacity onPress={() => this.navigateToUser(item.userData)}>
					<Image source={{ uri: item.userData.profile_img }} style={styles.pic} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => this.navigateToSinglePost(item)}>
					<View style={styles.nameContainer}>
						<Text style={styles.nameTxt} numberOfLines={0} ellipsizeMode="tail">{item.noti_message}.
                	</Text>
					</View>
					<View >
						<Text style={styles.msgTxt}>{}</Text>
					</View>
				</TouchableOpacity>
			</View>

		);
	}
	_openMenu = () => {
		Keyboard.dismiss();
		this.props.navigation.dispatch(DrawerActions.openDrawer());
	}
	render() {
		const { notificationlist } = this.state;

		return (
			<View style={{ flex: 1 }} >
				<Appbar.Header>
					<Appbar.Action icon="menu" onPress={this._openMenu} />
					<Appbar.Content titleStyle={styles.headerTitle} title="Notifications" /></Appbar.Header>
				{/* <Loader loading={this.state.isLoading} /> */}
				{this.state.notificationlist.length === 0 &&
					(<Image
						style={styles.norecordImage}
						source={require('./../../assets/images/NoRecordWOWWAO1.jpg')} />)
				}
				<FlatList
					data={notificationlist}
					keyExtractor={(item, index) => index.toString()}
					onRefresh={() => this.onRefresh()}
					refreshing={this.state.isFetching}
					extraData={this.state}
					renderItem={this.renderItem}
					ItemSeparatorComponent={this.renderSeparator}
					ListFooterComponent={() => this._renderFooter()}
					onEndReached={() => this._handleLoadMore()}
					onEndReachedThreshold={0.5}
				/>
			</View>

		);
	}
}
export default Notification;