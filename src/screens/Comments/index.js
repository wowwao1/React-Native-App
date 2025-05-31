
import React, { Component } from 'react';
import { View, TextInput, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Appbar, Card } from 'react-native-paper';
import CommentList from '../../components/CommentList';
import styles from './styles';
import { getData } from './../../utils/helper';
import { sendRequest } from './../../api';
import OneSignal from 'react-native-onesignal';
import Icon from 'react-native-vector-icons/Ionicons';
import { onIds } from './../../utils/helper';


const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
		{children}
	</TouchableWithoutFeedback>
);
class Comments extends Component {
	constructor(props) {
		super(props);
		this.commentInput = React.createRef();
		let requiresConsent = false;
		this.state = {
			comments: [],
			post: {},
			commentText: '',
			cmnt_time: '',
			total_reply: [],
			isLoading: false,
			BadgeCount: '0',
			initialOpenFromPush: 'Did NOT open from push',
			inAppIsPaused: true,
			isCommenting: false,
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

	closeComments = () => {
		this.props.onModalClose(this.state.comments.length, this.state.post);
	}

	getUserCommentList = (userid) => {
		let data = new FormData();
		data.append("action", "userCommentList");
		data.append("user_id", userid);
		data.append("post_id", this.state.post.id)
		data.append("timezone", "Asia/Kolkata");
		data.append("page", "1");
		console.log(data);
		//userCommentList("POST", data).then(response => {
		sendRequest("POST", data).then(response => {
			console.log(response)
			this.setState({ comments: response.data }, () => {
				this.setState({ isLoading: false })
				console.log("User comments");
				console.log(this.state.comments)
			})
		})
	}

	componentDidMount = async () => {
		this.setState({ post: this.props.post })
		let user = await getData("user");
		user = JSON.parse(user);
		this.getUserCommentList(user.id)
	}

	onUserPost = async () => {
		let user = await getData("user");
		//this.setState({ isCommenting: true });
		let data = new FormData();
		data.append("action", "addComment");
		data.append("post_id", this.state.post.id);
		data.append("cmnt_text", this.state.commentText)
		data.append("post_user_id", this.state.post.userData.id);
		data.append("user_id", JSON.parse(user).id);
		data.append("timezone", "Asia/Kolkata");
		console.log(data);
		//userCommentList("POST", data).then(response => {
		sendRequest("POST", data).then(response => {
			if (response.status) {
				this.setState({
					isCommenting: false
				}, () => {
					this.onComment();
				})
			} else {
				Alert.alert("Error", "Something has went wrong");
			}
		})
	}
	onComment = async () => {
		let user = await getData("user");
		let newComments = this.state.comments;
		// let commentsTime = this.state.cmnt_time;
		// let replyCount = this.state.total_reply
		this.sendPostCommentNotification()
		newComments.push({
			id: `${parseInt(this.state.post.id) + 1}`,
			userData: JSON.parse(user),
			comment: this.state.commentText,
			// cmnt_time:this.state.value,
			// total_reply:this.state.value
		});
		this.setState(
			{
				comments: newComments,
			}, () => {
				this.commentInput.current.clear();
			});
	}
	sendPostCommentNotification = async () => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "sendNotification");
		data.append("user_id", JSON.parse(authUser).id);
		data.append("friend_id", this.state.post.userData.id);
		data.append("friend_token", this.state.post.userData.FCM_TOKEN);
		data.append("user_name", JSON.parse(authUser).first_name);
		data.append("notification_action", "post_cmnt");
		data.append("post_id", this.state.post.id);
		console.log(data);
		//sendNotification("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ isLoading: false, isFetching: false })
			console.log("PostNotification", data);
		})
	}
	componentWillUnmount() {
		console.log('%c Unmouting', 'color: red')
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
	render() {
		console.log("Re Rendering");
		return (
			<View style={{ flex: 1 }}>
				<Appbar.Header>
					<Appbar.Content
						titleStyle={styles.headerTitle}
						title="Comments" />
					<Appbar.Action
						icon="close"
						onPress={this.closeComments}
					/>
				</Appbar.Header>
				<SafeAreaView >
					<View style={styles.searchSection}>
						<TextInput
							ref={this.commentInput}
							style={styles.input}
							placeholder="Type your reply"
							onChangeText={(input) => this.setState({ commentText: input })}
							underlineColorAndroid="transparent"
						/>
						{!this.state.isCommenting ? <TouchableOpacity onPress={() => this.onUserPost()}>
							<Icon style={styles.searchIcon} name="md-send" size={20} color="#000" />
						</TouchableOpacity>
							: <ActivityIndicator style={{ paddingHorizontal: 5 }} />}
					</View>
					{this.state.comments.length > 0 &&
						<CommentList
							comments={this.state.comments} />
					}
				</SafeAreaView>
			</View >
		);
	}
}
export default Comments;