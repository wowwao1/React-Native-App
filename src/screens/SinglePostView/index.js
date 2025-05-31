import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { getData } from './../../utils/helper';
import { sendRequest } from './../../api';
import { View, Keyboard, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Appbar, withTheme } from 'react-native-paper';
import styles from './styles';
import CardComponent from './../../components/CardComponent';
import { ActionSheet, Toast } from "native-base";
import Comments from './../Comments'
import { ScrollView } from 'react-native-gesture-handler';

var BUTTONS = ["Edit", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 2;

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
		{children}
	</TouchableWithoutFeedback>
);
class SinglePostView extends Component {
	pinZoomLayoutRef = React.createRef();

	_openMenu = () => {
		Keyboard.dismiss();
	}

	showActionSheet = (posts) => {
		let actions = parseInt(this.state.user.id)
		['Edit', 'Delete', 'Cancel']
		this.setState({ postSelected: posts, postActions: actions }, () => {
			ActionSheet.show(
				{
					options: BUTTONS,
					cancelButtonIndex: CANCEL_INDEX,
					destructiveButtonIndex: DESTRUCTIVE_INDEX,
					title: "Choose Action"
				},
				buttonIndex => {
					this.chooseOption(BUTTONS[buttonIndex]);
				}
			)
		})
	};


	chooseOption = (index) => {
		if (index == "Edit") {
			this.onEditPost();
		}
		else if (index == "Delete") {
			this.deleteMyPost()
		}
	}

	deleteMyPost = async (post) => {
		let user = await getData("user");
		user = JSON.parse(user);

		let data = new FormData();
		data.append("action", "deletePost");
		data.append("user_id", user.id);
		data.append("post_id", this.state.postSelected.id);

		//deletePost("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.navigateToNotification();
		})
	}

	navigateToUserprofile = async (user) => {
		let authUser = await getData("user");
		if (JSON.parse(authUser).id == user.id) {
			this.props.navigation.navigate('MyProfileTab', { user });
		}
	}

	onEditPost = () => {
		console.log("ON EDIT");
		this.props.navigation.navigate('NewPost', { EditPost: { ...this.state.postSelected, editMode: true } })
	}

	navigateComment = (post) => {
		this.setState({ postSelected: post, showComments: true })
	}

	constructor(props) {
		super(props);

		console.log(this.props.navigation.getParam("data"))
		let requiresConsent = false;
		this.state = {
			user: {},
			action: '',
			timezone: '',
			page: '',
			first_name: '',
			FCM_TOKEN: '',
			id: '',
			posts: [],
			comments: [],
			post: {},
			value: '',
			cmnt_time: '',
			isFetching: false,
			items: [],
			public: '',
			private: '',
			refreshing: false,
			spinner: false,
			showComments: false,
			isLoading: false,
			postSelected: {},
			userPicked: {},
			postActions: [],
			BadgeCount: '0',
			initialOpenFromPush: 'Did NOT open from push',
			inAppIsPaused: true,
			requirePrivacyConsent: requiresConsent,
		};

	}
	navigateToNotification = () => {
		console.log("Notificationlist .. GOING BACK")
		const { goBack } = this.props.navigation;
		goBack(null);
	}

	getuserLikePost = (post) => {
		let data = new FormData();
		data.append("action", "userLikePost");
		data.append("user_id", post.user_id);
		data.append("post_id", post.id);
		console.log("POST LIKED", post.is_liked);
		if (post.is_liked == 'n') {
			data.append("like_action", "Like");
			//this.sendPostLikeNotification(post)
		}
		else {
			data.append("like_action", "Unlike")
		}
		console.log(data);
		//userLikePost("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log("LIKE SUCCESFULL", data);
		})
	}


	handleOpenURL = (event) => { // D
		this.navigate(event.url);
	}

	convertUnicode = (input) => {
		return input.replace(/\\u(\w{4,4})/g, function (a, b) {
			var charcode = parseInt(b, 16);
			return String.fromCharCode(charcode);
		});
	}

	componentDidMount = () => {
		let data = this.props.navigation.getParam("data");
		console.log("POST DATA");
		console.log(data);
		this.setState({ isLoading: true }, () => {
			this.getSinglePost(data);
		})
	}

	getSinglePost = (post) => {
		let data = new FormData();
		data.append("action", "getPost");
		data.append("user_id", post.user_id);
		data.append("post_id", post.post_id);
		//getPost("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log("DATA");
			console.log(data);

			if (!data.data.post.id) {
				Toast.show({
					text: 'This post is no longer exist!',
				});
				this.navigateToNotification();
				return;
			}

			this.setState({
				posts: [{
					...data.data.post,
					userData: {
						profile_img: `http://ec2-18-221-119-107.us-east-2.compute.amazonaws.com/upload-nct/profile-nct/${data.data.post.profile_img}`,
						first_name: data.data.post.first_name,
						id: data.data.post.user_id
					},
					post_type: data.data.post.post_privacy,
					image: [{ path: data.data.post.image }]
				}]
				, isFetching: false,
				isLoading: false
			}, () => {
				console.log("SinglePosts From State");
				console.log(this.state.posts);
			})

		})
	}
	getUserCommentList = (post) => {
		let data = new FormData();
		data.append("action", "userCommentList");
		data.append("user_id", post.user_id);
		data.append("post_id", post.post_id)
		data.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
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
	onUserPost = async (post) => {
		let user = await getData("user");
		let data = new FormData();
		data.append("action", "addComment");
		data.append("post_id", post.post_id);
		data.append("cmnt_text", this.state.value)
		data.append("post_user_id", this.state.post.id);
		data.append("user_id", post.user_id);
		data.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

		//userCommentList("POST", data).then(response => {
		sendRequest("POST", data).then(response => {
			if (response.status) {
				this.onComment();
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
			comment: this.state.value,
			// cmnt_time:this.state.value,
			// total_reply:this.state.value

		});

		this.setState({
			comments: newComments,
			value: '',
		});
	}
	onLikePost = async (posts) => {
		console.log(posts)
		let user = await getData("user");
		user = JSON.parse(user);
		let updatedPost = this.state.posts[0];
		console.log("Updated POSt");
		this.getuserLikePost(posts);
		let is_liked = updatedPost.is_liked == 'y' ? 'n' : 'y';
		let total_like = updatedPost.is_liked == 'y' ? parseInt(updatedPost.total_like) - 1 : parseInt(updatedPost.total_like) + 1;
		updatedPost = [{ ...updatedPost, is_liked, total_like }];
		this.setState({
			posts: updatedPost
		})
	}
	updateComments = (noComments, commentedPost) => {
		console.log("Number of comments " + noComments)
		this.setState({ showComments: false })
		this.setState(prevState => ({
			posts: prevState.posts.map(post => {
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

	renderItem = ({ item }) => {
		return (
			<CardComponent item={item}
				onLikePost={() => this.onLikePost(item)}
				showActionSheet={() => this.showActionSheet(item)}
				navigateComment={() => this.navigateComment(item)} />
		)
	}

	render() {
		const { posts } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<Appbar.Header >
					<Appbar.BackAction icon="back" onPress={() => this.navigateToNotification()} />
					<Appbar.Content titleStyle={styles.headerTitle} title="Post" />
				</Appbar.Header>
				<ScrollView style={styles.postContainer} contentContainerStyle={styles.contentContainer}>
					{posts.length > 0 ?
						<FlatList
							keyExtractor={(item, index) => item.id}
							data={this.state.posts}
							renderItem={(item) => this.renderItem(item)}
						/> :
						<View style={styles.activityInd}>
							<ActivityIndicator
								animating={this.state.isLoading}
							/>
						</View>
					}

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
export default withTheme(SinglePostView);