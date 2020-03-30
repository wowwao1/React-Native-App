import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, Keyboard, ActivityIndicator } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { Appbar } from 'react-native-paper';
import ActionSheet from 'react-native-actionsheet';
import theme from './../../theme';
import styles from './styles';
import { sendRequest } from './../../api';
import { getData } from './../../utils/helper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from './../../components/Loading';

class Friends extends Component {
	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<Image source={require('../../../src/assets/images/icons/Friends.png')} style={[theme.icon, { tintColor: tintColor }]} />
		)
	}
	_refresh = () => {
		return new Promise((resolve) => {
			setTimeout(() => { resolve() }, 2000)
		});
	}

	showActionSheet = (item) => {
		this.setState({ userPicked: item }, this.ActionSheet.show())

	};
	constructor(props) {
		super(props);
		this.state = {
			user_id: '',
			action: '',
			timezone: '',
			page: 1,
			first_name: '',
			posts: [],
			is_liked: false,
			isFetching: false,
			items: [],
			loading: false,
			public: '',
			private: '',
			userPicked: {},
			friendlist: [],
			rooms: [],
			hasScrolled: false,
			loadingMore: false,
			hasMoreFriends: false
		};
	}

	_handleLoadMore = async () => {
		console.log("ON end List");
		let user = await getData("user");
		user = JSON.parse(user);
		if (!this.state.loadingMore && this.state.hasMoreFriends) {
			this.setState({
				page: this.state.page + 1,
			}, () => {
				this.getFriendList(user.id);
			})
		}
		console.log(this.state.loadingMore);
		console.log(this.state.hasMoreFriends);
	};

	getFriendList = (userid) => {

		console.log("PAGE ", this.state.page);

		this.setState({ loading: true, loadingMore: true })
		let data = new FormData();
		data.append("action", "userFriendList");
		data.append("user_id", userid);
		data.append("page", this.state.page);
		console.log(data);
		//userFriendList("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			if (data.status) {
				let userFriends = [...this.state.friendlist, ...data.data];
				this.setState({
					friendlist: userFriends,
					isFetching: false,
					loading: false,
					loadingMore: false,
					hasMoreFriends: true,
				})
				console.log("Friend LIst");
				console.log(data);
			} else {
				this.setState({ loadingMore: false, hasMoreFriends: false, isFetching: false, })
			}
		})
	}

	CreateAppChatKitUser = (user) => {
		console.log("User", user)
		let data = new FormData();
		data.append("action", "createAppChatKitUser");
		data.append("user_id", user.id);
		data.append("name", user.first_name);
		data.append("avatar_url", user.profile_img)
		console.log(data);
		//createAppChatKitUser("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log(data);
			console.log(data);
			// this.setState({ createUser: data.data,isFetching:false })
		})
	}

	CreateRoom = async (authUser) => {
		let data = new FormData();
		data.append("action", "createRoom");
		data.append("creator_id", JSON.parse(authUser).id);
		data.append("user_ids", this.state.userPicked.id)
		data.append("name", JSON.parse(authUser).id + '#' + this.state.userPicked.id);
		data.append("private", true)
		// let response = await createRoom("POST", data);
		let response = await sendRequest("POST", data);
		return response;
	}

	GetRooms = () => {
		let data = new FormData();
		data.append("action", "getRooms");
		//getRooms("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ rooms: data.data })
		})
	}

	unFriendUser = async () => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "userRequest");
		data.append("sender_id", JSON.parse(authUser).id);
		data.append("receiver_id", this.state.userPicked.id);
		data.append("request_action", "Unfriend")
		console.log(data);
		// userRequest("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			if (data.status) {
				let friends = this.state.friendlist.filter(friend => {
					return friend.id != this.state.userPicked.id
				})
				this.setState({ friendlist: friends })
			}
		})
	}
	blockUser = async () => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "userBlock");
		data.append("sender_id", JSON.parse(authUser).id);
		data.append("receiver_id", this.state.userPicked.id);
		data.append("block_action", "Block")
		console.log(data);
		//	userBlock("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			if (data.status) {
				let friends = this.state.friendlist.filter(friend => {
					return friend.id != this.state.userPicked.id
				})
				this.setState({ friendlist: friends, isFetching: false })
			}
		})
	}

	onRefresh = async () => {
		let user = await getData("user");
		user = JSON.parse(user);
		this.setState({ isFetching: true, page: 1, friendlist: [] }, function () { this.getFriendList(user.id) });
	}

	navigateToUser = (user) => {
		this.props.navigation.navigate('UserProfile', { user });
	}

	componentDidMount = async () => {
		console.log("Friend List");
		let user = await getData("user");
		user = JSON.parse(user);
		this.getFriendList(user.id);
		this.CreateAppChatKitUser(user);
		this.GetRooms();
		this.props.navigation.addListener("didFocus", () => {
			console.log("Getting rooms");
			this.GetRooms();
			this.setState({
				page: 1,
				friendlist: []
			}, () => {
				this.getFriendList(user.id);
			})

		});
	}

	renderItem = ({ item }) => {
		var optionArray = [
			'Message',
			'Block ',
			'Remove friend',
			'Cancel',
		];
		return (
			<View style={styles.row}>
				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity onPress={() => this.navigateToUser(item)}>
						<Image source={{ uri: item.profile_img }} style={styles.pic} />
					</TouchableOpacity>
					<Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">{item.first_name}</Text>
				</View>
				<TouchableOpacity onPress={() => this.showActionSheet(item)}>
					<MaterialCommunityIcons
						style={styles.horizontalDots}
						name="dots-horizontal" size={24} />

					<ActionSheet ref={o => (this.ActionSheet = o)}
						title={''}
						options={optionArray}
						cancelButtonIndex={3}
						destructiveButtonIndex={1}
						onPress={index => {
							this.chooseOption(index);
						}}
					/>
				</TouchableOpacity>
			</View>
		);
	}

	chooseOption = (index) => {
		if (index == 0) {
			this.navigateToMessages();
		}
		else if (index == 1) {
			this.blockUser();
		}
		else if (index == 2) {
			this.unFriendUser();
		}
	}

	_openMenu = () => {
		Keyboard.dismiss();
		this.props.navigation.dispatch(DrawerActions.openDrawer());
	}

	navigateToMessages = async () => {
		let user = await getData("user");
		let room_id;
		let avatarURL;
		let friend_id;
		let friend_token;
		let friend_Profile;
		console.log(this.state.rooms);
		let hasRoomAlreadyCreated = this.state.rooms.filter(room => {
			let roomName = room.name.split("#");
			console.log(roomName);
			console.log(JSON.parse(user).id + " " + this.state.userPicked.id)
			if (
				(roomName[0].includes(JSON.parse(user).id) ||
					roomName[0].includes(this.state.userPicked.id))
				&&
				(roomName[1].includes(JSON.parse(user).id) ||
					roomName[1].includes(this.state.userPicked.id))
			) {
				return true;
			}
		})
		if (hasRoomAlreadyCreated.length == 0) {
			console.log("creating room")
			// let response = await this.CreateRoom(user, this.state.userPicked.id);
			let response = await this.sendRequest(user, this.state.userPicked.id);
			console.log("HEre")
			room_id = response.message.id;
			avatarURL = response.message.avatarURL;
			friend_id = this.state.userPicked.id;
			friend_token = this.state.userPicked.FCM_TOKEN;
			friend_Profile = this.state.userPicked;
		} else {
			console.log("Room already exist");
			room_id = hasRoomAlreadyCreated[0].id;
			avatarURL = this.state.userPicked.avatarURL
			friend_id = this.state.userPicked.id;
			friend_token = this.state.userPicked.FCM_TOKEN;
			friend_Profile = this.state.userPicked;
		}
		console.log("User:", user);
		console.log("FriendUSER:", this.state.userPicked)
		console.log(hasRoomAlreadyCreated);
		this.props.navigation.navigate('Chat', { userId: JSON.parse(user).id, roomId: room_id, avatarUrl: avatarURL, friendId: friend_id, friendToken: friend_token, friendProfile: friend_Profile });
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

	render() {
		const { friendlist } = this.state
		if (this.state.loading && this.page === 1) {
			return <View style={{
				width: '100%',
				height: '100%'
			}}><ActivityIndicator style={{ color: '#000' }} /></View>;
		}
		return (
			<View style={{ flex: 1 }} >
				<Appbar.Header>
					<Appbar.Action icon="menu" onPress={this._openMenu} />
					<Appbar.Content titleStyle={styles.headerTitle} title="Friends" />
				</Appbar.Header>
				<View style={{ flex: 1 }}>
					{this.state.friendlist.length === 0 &&
						(<Loading />)
					}
					<FlatList
						data={friendlist}
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
			</View>
		);
	}
}
export default Friends;