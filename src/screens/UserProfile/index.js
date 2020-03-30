import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	Keyboard,
	TouchableOpacity,
	FlatList,
	ScrollView,
	Alert,
	Modal,
	ActivityIndicator
} from 'react-native';
import { Appbar } from 'react-native-paper';
import styles from './styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DoubleTap from '../../components/DoubleTap';
import {

	sendRequest
} from './../../api';
import { getData } from './../../utils/helper';
import Autolink from 'react-native-autolink';
import Comments from './../Comments'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CardComponent from './../../components/CardComponent';
import OneSignal from 'react-native-onesignal';
import { ActionSheet } from 'native-base';
import ProfileBanner from './../../components/ProfileBanner';
import { onIds } from './../../utils/helper';
var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 2;

class UserProfile extends React.Component {

	_openMenu = () => {
		Keyboard.dismiss();
		this.props.navigation.navigate('Home')
	}

	// showActionSheet = (item) => {
	// 	this.setState({ postSelected: item }, this.ActionSheet.show())
	// };

	blockAlert = () => {
		Alert.alert(
			'Block User',
			'You really want block this user?',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'Block', onPress: () => this.blockUser() },
			]
		);
	}

	constructor(props) {
		let requiresConsent = false;
		super(props);
		this.state = {
			user_id: '',
			action: '',
			page: 1,
			first_name: '',
			user: [],
			is_liked: false,
			isFetching: false,
			items: [],
			loading: false,
			public: '',
			private: '',
			userposts: [],
			receiver_id: '',
			sender_id: '',
			block_action: '',
			is_friend: false,
			is_follow: false,
			status: '',
			followstatus: '',
			showComments: false,
			postSelected: {},
			rooms: [],
			userPicked: {},
			postActions: [],
			BadgeCount: '0',
			initialOpenFromPush: 'Did NOT open from push',
			inAppIsPaused: true,
			requirePrivacyConsent: requiresConsent,
			loadingMore: false,
			noMorePosts: false,
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
	_handleLoadMore = async () => {
		console.log("ON end List");
		let user = await getData("user");
		user = JSON.parse(user);
		if (!this.state.noMorePosts && !this.state.loadingMore) {
			this.setState({
				page: this.state.page + 1,
			}, () => {
				this.getUserPost(user.id);
			})
		}

	};

	getUserProfile = (userid) => {
		let data = new FormData();
		data.append("action", "userProfile");
		data.append("sender_id", userid);
		data.append("receiver_id", this.props.navigation.getParam('user').id);

		//userProfile("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log("Userdata")
			console.log(data);
			this.setState({ isLoading: false })
			this.setState({ user: data.data, status: this.getstatus(data.data.is_friend), followstatus: this.getFollowstatus(data.data.is_follow) })
		})
	}

	navigateToMessages = async (user) => {
		let authUser = await getData("user");
		let room_id;
		let avatarURL;
		let friend_id;
		let friend_token;
		let friend_Profile;

		let hasRoomAlreadyCreated = this.state.rooms.filter(room => {
			let roomName = room.name.split("#");
			console.log(JSON.parse(authUser).id + " " + user.id)

			if (
				(roomName[0].includes(user.id) ||
					roomName[0].includes(JSON.parse(authUser).id))
				&&
				(roomName[1].includes(user.id) ||
					roomName[1].includes(JSON.parse(authUser).id))
			) {
				return true;
			}
		})

		if (hasRoomAlreadyCreated.length == 0) {
			// let response = await this.CreateRoom(JSON.parse(authUser), user);
			let response = await this.sendRequest(JSON.parse(authUser), user);
			console.log(response);
			room_id = response.message.id;
			avatarURL = response.message.avatarURL;
			friend_id = JSON.parse(authUser).id;
			friend_token = JSON.parse(authUser).FCM_TOKEN;
			friend_Profile = this.state.user;
		} else {
			room_id = hasRoomAlreadyCreated[0].id;
			avatarURL = hasRoomAlreadyCreated[0].avatarURL;
			friend_id = this.state.user.id;
			friend_token = this.state.user.FCM_TOKEN;
			friend_Profile = this.state.user;

		}

		this.props.navigation.navigate('Chat', { userId: JSON.parse(authUser).id, roomId: room_id, avatarUrl: avatarURL, friendId: friend_id, friendToken: friend_token, friendProfile: friend_Profile });

	}

	navigateComment = (post) => {

		this.setState({ postSelected: post, showComments: true })
	}

	getstatus(is_friend) {
		if (is_friend == 'n') {
			return "Add Friend";
		} else if (is_friend == 'y') {
			return "Unfriend";
		} else {
			return "Request Sent";
		}
	}

	getFollowstatus(is_follow) {
		console.log(is_follow)
		if (is_follow == 'n') {
			return "Follow";
		} else {
			return "Following";
		}
	}

	getUserPost = (userid) => {
		console.log("PAGE NUMBER", this.state.page)
		this.setState({ loading: true, loadingMore: true })
		let data = new FormData();
		data.append("action", "userPost");
		data.append("sender_id", userid);
		data.append("receiver_id", this.props.navigation.getParam('user').id);
		data.append("page", this.state.page);
		data.append("timezone", "Asia/Kolkata");
		//	userPost("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log("POST RESTPONSE")
			console.log(data)
			if (data.status) {

				console.log("POSTs");
				console.log(data.data);

				let myPosts = [...this.state.userposts, ...data.data];
				this.setState({
					userposts: myPosts,
					isFetching: false,
					loading: false,
					loadingMore: false,
					noMorePosts: false
				})
			} else {

				this.setState({ loadingMore: false, noMorePosts: true })
			}
		})
	}

	CreateAppChatKitUser = (user) => {
		console.log("ChatkitUser", user)
		let data = new FormData();
		data.append("action", "createAppChatKitUser");
		data.append("user_id", user.id);
		data.append("name", user.first_name);
		data.append("avatar_url", user.profile_img)
		console.log(data);
		//createAppChatKitUser("POST", data).then(data => {
		sendRequest("POST", data).then((data) => {
			this.setState({ isLoading: false })
			console.log(data);
			this.setState({ createUser: data.data, isFetching: false })
		})
	}

	GetRooms = () => {
		let data = new FormData();
		data.append("action", "getRooms");
		// getRooms("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ rooms: data.data, isLoading: false })
		})
	}
	CreateRoom = async (authUser, user) => {
		console.log("User", user)
		let data = new FormData();
		data.append("action", "createRoom");
		data.append("creator_id", authUser.id);
		data.append("user_ids", user.id)
		data.append("name", authUser.id + '#' + user.id);
		data.append("private", true)
		// let response = await createRoom("POST", data);
		let response = await sendRequest("POST", data);
		this.setState({ isLoading: false })
		return response;


	}
	requestUser = async (user) => {
		console.log(user);
		if (user.is_friend == 's') return;
		let authUser = await getData('user');
		console.log("Auth user", authUser);
		let data = new FormData();
		data.append("action", "userRequest");
		data.append("sender_id", JSON.parse(authUser).id);
		data.append("receiver_id", user.id);

		if (user.is_friend == 'n') {
			data.append("request_action", "Add");
			this.sendFriendRequestNotification(user)
		}
		else {
			data.append("request_action", "Unfriend")
		}
		console.log(data);
		// userRequest("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			let st = user.is_friend == "n" ? "s" : "n";
			this.setState(
				{
					user: { ...user, is_friend: st },
					status: this.getstatus(st)
				}
			)
		})
	}

	followRequestUser = async (user) => {
		console.log(user);
		if (user.is_follow == 's') return;
		let authUser = await getData('user');
		console.log("Auth user", authUser);
		let data = new FormData();
		data.append("action", "userFollow");
		data.append("sender_id", JSON.parse(authUser).id);
		data.append("receiver_id", user.id);

		if (user.is_follow == 'n') {
			data.append("follow_action", "Follow");
			this.sendFollowNotification(user)
		}
		else {
			data.append("follow_action", "Unfollow")
		}
		console.log(data);
		// userFollow("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			let st = user.is_follow == "n" ? "s" : "n";
			this.setState(
				{
					user: { ...user, is_follow: st },
					followstatus: this.getFollowstatus(st)
				}
			)
		})
	}
	sendPostLikeNotification = async (post) => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "sendNotification");
		data.append("user_id", JSON.parse(authUser).id);
		data.append("friend_id", post.userData.id);
		data.append("friend_token", post.userData.FCM_TOKEN);
		data.append("user_name", JSON.parse(authUser).first_name);
		data.append("notification_action", "post_like");
		data.append("post_id", post.id);
		console.log(data);
		//	sendNotification("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ isLoading: false, isFetching: false })
			console.log("LikeNotification", data);
		})
	}
	sendFriendRequestNotification = async (user, post) => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "sendNotification");
		data.append("user_id", JSON.parse(authUser).id);
		data.append("friend_id", user.id);
		data.append("friend_token", user.FCM_TOKEN);
		data.append("user_name", JSON.parse(authUser).first_name);
		data.append("notification_action", "req_rece");
		data.append("post_id", user.id);
		console.log(data);
		//sendNotification("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ isLoading: false, isFetching: false })
			console.log("FriendRequestNotification", data);
		})
	}
	sendFollowNotification = async (user, post) => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "sendNotification");
		data.append("user_id", JSON.parse(authUser).id);
		data.append("friend_id", user.id);
		data.append("friend_token", user.FCM_TOKEN);
		data.append("user_name", JSON.parse(authUser).first_name);

		data.append("notification_action", "user_follow");
		data.append("post_id", user.id);
		console.log(data);
		//	sendNotification("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ isLoading: false, isFetching: false })
			console.log("UserFollowNotification", data);
		})
	}
	sendMessageNotification = async (user) => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "sendNotification");
		data.append("user_id", JSON.parse(authUser).id);
		data.append("friend_id", user.id);
		data.append("friend_token", user.FCM_TOKEN);
		data.append("user_name", JSON.parse(authUser).first_name);
		data.append("notification_action", "user_msg");
		data.append("post_id", user.id);
		console.log(data);
		//	sendNotification("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ isLoading: false, isFetching: false })
			console.log("UserFollowNotification", data);
		})
	}
	componentWillUnmount() {
		//OneSignal.init('ee5169a7-d089-4de3-98c4-4c6bc8378925');

		// OneSignal.addEventListener('received', this.onReceived);
		// OneSignal.addEventListener('opened', this.onOpened);
		// OneSignal.addEventListener('ids', this.onIds);
		OneSignal.removeEventListener('received', this.onReceived);
		OneSignal.removeEventListener('opened', this.onOpened);
		OneSignal.removeEventListener('ids', onIds);

	}

	onReceived(notification) {
		console.log("Notification received: ", notification.payload);
		// let {BadgeCount} = this.state;
		// let  data  = notification.payload.additionalData;
		// console.log("DATA",data)
		// BadgeCount++;
		//this.setState({ BadgeCount:BadgeCount }) 
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


	getuserLikePost = (userid, post) => {
		let data = new FormData();
		data.append("action", "userLikePost");
		data.append("user_id", userid);
		data.append("post_id", post.id);
		console.log("POST LIKED", post.is_liked);
		if (post.is_liked == 'n') {
			data.append("like_action", "Like");
			this.sendPostLikeNotification(post)
		}
		else {
			data.append("like_action", "Unlike")
		}
		console.log(data);
		//userLikePost("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log("Posts", data);


		})
	}
	onLikePost = async (item) => {
		console.log(item)
		let user = await getData("user");
		user = JSON.parse(user);
		this.getuserLikePost(user.id, item)
		this.setState(prevState => ({
			userposts: prevState.userposts.map(post => {
				if (post.id === item.id) {
					return {
						...post,
						is_liked: post.is_liked == 'y' ? 'n' : 'y',
						total_like: post.is_liked == 'n' ? parseInt(post.total_like) + 1 : parseInt(post.total_like) - 1,
					}
				}
				return post;
			})
		}))
	}
	getUserCommentList = (userid, post) => {

		let data = new FormData();
		data.append("action", "userCommentList");
		data.append("user_id", userid);
		data.append("post_id", post.id)
		data.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
		data.append("page", "1");
		console.log(data);
		//userCommentList("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log(data);
			this.setState({ usercomments: data.data })

		})
	}
	onUserRequest = async (item) => {

		let user = await getData("user");
		user = JSON.parse(user);
		this.requestUser(user.id, item)
		this.setState(prevState => ({
			requestuser: prevState.requestuser.map(userrequest => {
				if (userrequest.id === item.id) {
					return {
						...userrequest,
						is_friend: userrequest.is_friend == 'y' ? 'n' : 'y',

					}
				}
				return userrequest;
			})
		}))
	}
	onUserFollowRequest = async (item) => {

		let user = await getData("user");
		user = JSON.parse(user);
		this.followRequestUser(user.id, item)
		this.setState(prevState => ({
			requestuser: prevState.requestuser.map(userfollowrequest => {
				if (userfollowrequest.id === item.id) {
					return {
						...userfollowrequest,
						is_follow: userfollowrequest.is_follow == 'y' ? 'n' : 'y',

					}
				}
				return userfollowrequest;
			})
		}))
	}
	blockUser = async (user) => {
		let authUser = await getData("user");
		let data = new FormData();
		data.append("action", "userBlock");
		data.append("receiver_id", this.props.navigation.getParam('user').id);
		data.append("sender_id", JSON.parse(authUser).id);
		data.append("block_action", "Block")
		data.append("page", "1");

		console.log(data);
		//userBlock("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			if (data.status) {

				this.setState({ posts: data.data, isFetching: false })
				this.props.navigation.goBack();
			}
		})
	}
	onRefresh = () => {
		this.setState({ isFetching: true }, function () { this.getUserPost() });
	}


	componentDidMount = async () => {

		let user = await getData("user");
		user = JSON.parse(user);
		console.log(user);
		this.getUserProfile(user.id);
		this.getUserPost(user.id);
		this.getFollowstatus(user.is_follow)
		this.CreateAppChatKitUser(user)
		this.GetRooms();
		this.props.navigation.addListener("willFocus", () => {
			console.log("Getting rooms");
			this.GetRooms();
		});
	}

	convertUnicode = (input) => {
		return input.replace(/\\u(\w{4,4})/g, function (a, b) {
			var charcode = parseInt(b, 16);
			return String.fromCharCode(charcode);
		});
	}

	updateComments = (noComments, commentedPost) => {
		console.log("Number of comments " + noComments)
		this.setState({ showComments: false })
		this.setState(prevState => ({
			userposts: prevState.userposts.map(post => {
				if (post.id === commentedPost.id) {
					return {
						...post,
						total_comment: noComments
					}
				}
				return post;
			})
		}))
	}
	reportPost = async () => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "userReportPost");
		data.append("user_id", JSON.parse(authUser).id);
		data.append("post_id", this.state.postSelected.id);
		data.append("post_user_id", JSON.parse(authUser).id);
		console.log(data);
		//let response = await userReportPost("POST", data);
		let response = await sendRequest("POST", data);

		console.log("Posts", data);
		if (response.status == true) {
			Alert.alert("Post Reported Successfully!");
		}
		else {
			Alert.alert("Post Already Reported By You!");
		}
	}
	chooseOption = (index) => {
		if (index == 0) {
			this.reportPost();
		} else if (index == 1) {
			this.blockAlert();
		}

	}

	showActionSheet = (item) => {
		let actions = ['Report', 'Block', 'Cancel'];

		this.setState({ postSelected: item }, () => {
			ActionSheet.show(
				{
					options: actions,
					cancelButtonIndex: CANCEL_INDEX,
					destructiveButtonIndex: DESTRUCTIVE_INDEX,
					title: "Choose Action"
				},
				buttonIndex => {
					this.chooseOption(actions[buttonIndex]);
				}
			)
		})
	}

	renderItem = ({ item }) => {
		return (
			<CardComponent
				item={item}
				onLikePost={() => this.onLikePost(item)}
				navigateComment={() => this.navigateComment(item)}
				showActionSheet={() => this.showActionSheet(item)}
			/>
		)
	}

	renderItem2 = ({ item }) => {
		var optionArray = [
			'Report',
			'Block',
			'Cancel'

		];

		return (

			<View >
				<View >
					<TouchableOpacity >
						<Image source={{ uri: item.userData.profile_img }} style={styles.pic} />
					</TouchableOpacity>
					<Text style={styles.nameTxt1} numberOfLines={1}
					>{item.userData.first_name}
					</Text>
					<Text style={styles.dateTxt}>
						{item.post_date}
					</Text>
					<Text style={styles.statusdiff}>
						{item.diff}
					</Text>
					<View style={styles.combine}>
						<View style={styles.privacyImage}>
							{item.post_type == "Public" ?
								<MaterialIcons

									name="public" size={15} />
								:
								<EvilIcons

									name="lock" size={24} />
							}
						</View>
						<TouchableOpacity
							onPress={() => this.showActionSheet(item)}>
							<MaterialCommunityIcons
								style={styles.verticalImg}
								name="dots-vertical" size={24} />
						</TouchableOpacity>
					</View>

					<ActionSheet ref={o => (this.ActionSheet = o)}

						title={''}

						options={optionArray}

						cancelButtonIndex={4}

						destructiveButtonIndex={1}

						onPress={(index) => this.chooseOption(index)} />


					<View style={styles.postTextSize}>
						<Autolink
							numberOfLines={0}
							ellipsizeMode={'tail'}
							text={this.convertUnicode(item.post_text).replace(/(\r\n|\r|\\n)/gm, '')}
							hashtag="instagram"
							mention="twitter"
							phone={true}>
						</Autolink>

					</View>
					<ScrollView maximumZoomScale={5}
						scrollEnabled={true}
						minimumZoomScale={1}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}>

						<DoubleTap
							onDoubleTap={() => this.onLikePost(item)}>
							{item.image.length > 0 &&
								<Image source={{ uri: item.image[0].path }}
									style={styles.postImage}
									resizeMode="cover" />}

						</DoubleTap>

					</ScrollView>
					<View style={styles.iconRow}>
						<View style={{ flexDirection: 'row' }}>
							<ableOpacity onPress={() => this.onLikePost(item)}>
								<Image
									source={(item.is_liked === 'y') ?
										require('../../assets/images/icons/heart.png') :
										require('../../assets/images/icons/heart-outline.png')}
									style={styles.heartIcon}
									resizeMode="cover" />
							</ableOpacity>

							<Text style={{ marginLeft: 9, marginTop: 2 }}>
								{item.total_like}
							</Text>
							<TouchableOpacity onPress={() => this.navigateComment(item)}>
								<EvilIcons name="comment" size={30}
									style={{ marginLeft: 30 }}
								/>
							</TouchableOpacity>
							<Text style={{ marginLeft: 9, marginTop: 2, }}>
								{item.total_comment}
							</Text>
						</View>
					</View>
				</View>

			</View>

		);
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
					height: 1,
					width: '100%',
					backgroundColor: '#CED0CE'
				}}
			/>
		);
	};
	render() {
		const { user, userposts } = this.state;
		return (

			<View style={{ flex: 1 }}>
				<Appbar.Header>
					<Appbar.BackAction icon="back" onPress={this._openMenu} />
					<Appbar.Content titleStyle={styles.headerTitle} title="User Profile" /></Appbar.Header>
				<ScrollView style={{ flex: 1 }}>
					{/* <View style={styles.avtarimage}>
						<Avatar.Image size={80} source={{ uri: user.profile_img }} />
					</View>
					<View style={styles.name}>
						<View>
							<Text style={{ textAlign: 'center' }}>{user.total_follower}</Text>
							<Text>Followers</Text>
						</View>
						<View>
							<Text style={{ textAlign: 'center' }}>{user.total_follower}</Text>
							<Text>Following</Text>
						</View>
						<View>
							<Text style={{ textAlign: 'center' }}>{user.total_follower}</Text>
							<Text>Friends</Text>
						</View>
					</View> */}

					<ProfileBanner
						user={user} profile="1"
						follow={this.state.followstatus}
						friend={this.state.status}
						blockAlert={() => this.blockAlert()}
						requestUser={(user) => this.requestUser(user)}
						followRequestUser={(user) => this.followRequestUser(user)}
						navigateToMessages={(user) => this.navigateToMessages(user)} />


					{/* <View style={styles.profileInfo}>
						<View >
							<Text style={styles.profileFirstName}>{user.first_name} </Text>

							<Text style={styles.aboutProfile}>{user.about}</Text>

						</View>
						<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around', }}>

							<Button
								style={{ flex: 2 }}
								onPress={() => this.requestUser(user)}
								uppercase={false} mode='outlined'>
								{
									this.state.status
								}

							</Button>
							<Button
								style={{ flex: 3 }}
								onPress={() => this.followRequestUser(user)}
								uppercase={false} mode='outlined'>
								{
									this.state.followstatus
								}

							</Button>
							<Button onPress={() => this.navigateToMessages(user)}
								style={{ flex: 3 }}
								uppercase={false}
								mode='outlined' >
								Message
                        	</Button>

							<TouchableOpacity style={styles.actions} onPress={() => this.blockAlert()}>
								<Ionicons style={{ flex: 2 }} name="ios-arrow-down" size={24} />
							</TouchableOpacity>
						</View>
					</View> */}


					{this.state.userposts.length === 0 &&
						(<Image
							style={styles.norecordImage}
							source={require('./../../assets/images/NoRecordWOWWAO1.jpg')} />)
					}
					{/* <Card style={styles.postView}> */}
					<View>
						<FlatList
							style={styles.userPost}
							onRefresh={() => this.onRefresh()}
							refreshing={this.state.isFetching}
							extraData={this.state}
							data={userposts}
							keyExtractor={(item, index) => index}
							renderItem={this.renderItem}
							ItemSeparatorComponent={this.renderSeparator}
							ListFooterComponent={() => this._renderFooter()}
							onEndReached={() => this._handleLoadMore()}
							onEndReachedThreshold={0.5}
						/>
					</View>
					{/* </Card> */}
				</ScrollView>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.showComments}
					onRequestClose={() => {
						console.log('Modal has been closed.');
					}}
				>
					<Comments post={this.state.postSelected} onModalClose={(noComments, post) => this.updateComments(noComments, post)} />
				</Modal>
			</View>
		);
	}
}


export default UserProfile;

