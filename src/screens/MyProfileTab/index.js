import React from 'react';
import { View, Text, Image, Keyboard, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { Appbar } from 'react-native-paper';
import { ActionSheet } from "native-base";
import styles from './styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DoubleTap } from '../../components/DoubleTap';
import { sendRequest } from './../../api';
import { getData } from './../../utils/helper';
import Autolink from 'react-native-autolink';
import Comments from './../Comments'
import CardComponent from './../../components/CardComponent';

var BUTTONS = ["Edit", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 2;

import { Container, Content, Button } from 'native-base';
import Loading from './../../components/Loading';

class MyProfileTab extends React.Component {

	_openMenu = () => {
		Keyboard.dismiss();
		this.props.navigation.dispatch(DrawerActions.openDrawer());
	}

	showActionSheet = (item) => {
		this.setState({ postSelected: item }, () => {
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
	}

	constructor(props) {
		super(props);
		this.state = {
			user_id: '',
			action: '',
			page: 1,
			first_name: '',
			posts: [],
			isFetching: false,
			items: [],
			loading: true,
			public: '',
			private: '',
			showComments: false,
			postSelected: {},
			userposts: [],
			loadingMore: false,
			noMorePosts: false,



			name: '',
			reputation: 0,
			profile: {},
			postCount: 0,
			followingCount: 0,
			followerCount: 0,
			activeIndex: 0,
			blogs: [],

			userOptionArray: [
				'Edit',
				'Delete',
				'Cancel'
			]
		};
	}
	_handleLoadMore = async () => {
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
	getUserProfile = async (userid) => {
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "userProfile");
		data.append("sender_id", JSON.parse(authUser).id);
		data.append("receiver_id", userid);
		//userProfile("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ isLoading: false, posts: data.data }, () => {
				console.log("USER PROFILE")
				console.log(this.state.posts);
			})
		})
	}

	componentWillReceiveProps = (props) => {
		// let profile = await this.props.navigation.getParam("EditProfile");
		// console.log("UpdateProfile", profile)
		// let user = await getData("user");
		// user = JSON.parse(user);
		// this.getUserProfile(user.id)
		// this.props.navigation.addListener("willFocus", () => {
		// 	console.log("UPDATING Profile");
		// 	this.getUserProfile(user.id)
		// });
	}

	getUserPost = async (userid) => {
		this.setState({ loading: true, loadingMore: true })
		let authUser = await getData('user');
		let data = new FormData();
		data.append("action", "userPost");
		data.append("sender_id", JSON.parse(authUser).id);
		data.append("receiver_id", userid);
		data.append("page", this.state.page);
		data.append("timezone", "Asia/Kolkata");

		//userPost("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			if (data.status) {
				let myPosts = [...this.state.userposts, ...data.data];
				this.setState({
					userposts: myPosts,
					isFetching: false,
					loading: false,
					loadingMore: false,
					noMorePosts: false
				})
				console.log("USER POSTS");
				console.log(this.state.userposts)
			} else {
				this.setState({ loadingMore: false, noMorePosts: true })
			}
		})
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
			let newPosts = this.state.userposts.filter(post => {
				return post.id != this.state.postSelected.id;
			});
			this.setState({ isLoading: false })
			this.setState({ userposts: newPosts, isFetching: false })
		})
	}
	getuserLikePost = (userid, post) => {
		let data = new FormData();
		data.append("action", "userLikePost");
		data.append("user_id", userid);
		data.append("post_id", post.id);

		if (post.is_liked == 'n') {
			data.append("like_action", "Like");
		}
		else {
			data.append("like_action", "Unlike")
		}

		//	userLikePost("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log("Posts", data);
		})
	}
	onLikePost = async (item) => {
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
		data.append("timezone", "Asia/Kolkata");
		data.append("page", "1");

		// userCommentList("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ usercomments: data.data })
		})
	}
	onRefresh = async () => {
		let user = await getData("user");
		user = JSON.parse(user);
		this.setState({ isFetching: true }, function () { this.getUserPost(user.id) });
	}

	navigateToEditProfile = async (user) => {
		this.props.navigation.navigate('EditProfile', { EditProfile: user });
	}
	navigateComment = (post) => {

		this.setState({ postSelected: post, showComments: true })
	}
	componentDidMount = async () => {
		let user = await getData("user");
		user = JSON.parse(user);
		this.getUserProfile(user.id)
		this.getUserPost(user.id)
		this.props.navigation.addListener("willFocus", () => {
			this.getUserProfile(user.id)
			this.setState({
				userposts: [],
				page: 1
			}, () => {
				this.getUserPost(user.id)
			})
		});
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

	renderItem = ({ item }) => {
		return (
			<CardComponent item={item} key={item.id}
				onLikePost={(item) => this.onLikePost(item)}
				navigateComment={(item) => this.navigateComment(item)}
				showActionSheet={(item) => this.showActionSheet(item)} />
		)
	}


	render() {
		const {
			userOptionArray,
			posts,
			userposts
		} = this.state;

		return (
			<View style={{ flex: 1 }}>
				<Container style={{ flex: 1, backgroundColor: 'white' }}>
					<Appbar.Header>
						<Appbar.Action icon="menu" onPress={this._openMenu} />
						<Appbar.Content titleStyle={styles.headerTitle} title="My Profile" />
					</Appbar.Header>
					<Content>
						<View style={{ flexDirection: 'row', paddingTop: 10 }}>
							<View style={{ flex: 1, alignItems: 'center' }}>
								<Image source={{ uri: posts.profile_img }}
									style={{ width: 75, height: 75, borderRadius: 37.5 }} />
							</View>
							<View style={{ flex: 3 }}>
								<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
									<View style={{ alignItems: 'center' }}>
										<Text>{posts.total_posts}</Text>
										<Text style={{ fontSize: 12, color: 'gray' }}>Posts</Text>
									</View>
									<View style={{ alignItems: 'center' }}>
										<Text>{posts.total_friends}</Text>
										<Text style={{ fontSize: 12, color: 'gray' }}>Friends</Text>
									</View>
									<View style={{ alignItems: 'center' }}>
										<Text>{posts.total_follower}</Text>
										<Text style={{ fontSize: 12, color: 'gray' }}>Following</Text>
									</View>
								</View>

							</View>
						</View>
						<View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
							<Text style={{ fontWeight: 'bold' }}>{posts.first_name}</Text>
							<Text>{posts.about}</Text>
							<Text>{posts.phone_no}</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Button bordered dark onPress={() => this.navigateToEditProfile(posts)}
								style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center', height: 30, marginTop: 10 }}>
								<Text>Edit Profile</Text>
							</Button>
						</View>

						{/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#eae5e5' }}>
						<Button transparent
							onPress={() => this.segmentClicked(0)}
							active={this.state.activeIndex === 0}>
							<Icon name='ios-apps'
								style={[this.state.activeIndex === 0 ? {} : { color: 'grey' }]} />
						</Button>
						<Button transparent
							onPress={() => this.segmentClicked(1)}
							active={this.state.activeIndex === 1}>
							<Icon name='ios-list'
								style={[this.state.activeIndex === 1 ? {} : { color: 'grey' }]} />
						</Button>
						<Button transparent
							onPress={() => this.segmentClicked(2)}
							active={this.state.activeIndex === 2}>
							<Icon name='ios-people'
								style={[this.state.activeIndex === 2 ? {} : { color: 'grey' }]} />
						</Button>
						<Button transparent
							onPress={() => this.segmentClicked(3)}
							active={this.state.activeIndex === 3}>
							<Icon name='ios-bookmark'
								style={[this.state.activeIndex === 3 ? {} : { color: 'grey' }]} />
						</Button>
					</View> */}

						{/* 아래 코드 추가 */}
						{userposts.length > 0 ?
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
							:
							<View style={{ flex: 1 }}>
								<Loading />
							</View>
						}

					</Content>

				</Container>
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
	updateComments = (noComments, commentedPost) => {
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
	chooseOption = (index) => {
		if (index == "Edit") {
			this.onEditPost();
		}
		else if (index == "Delete") {
			this.deleteMyPost()
		}
	}
	onEditPost = () => {
		this.props.navigation.navigate('NewPost', { EditPost: { ...this.state.postSelected, editMode: true } })
	}
	renderItem2 = ({ item }) => {


		return (

			<View >
				<View>
					<TouchableOpacity >
						<Image source={{ uri: item.userData.profile_img }} style={styles.pic} />
					</TouchableOpacity>
					<Text style={styles.nameTxt1} numberOfLines={1}
						ellipsizeMode="tail">{item.userData.first_name}
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
							<TouchableOpacity onPress={() => this.onLikePost(item)}>
								<Image
									source={(item.is_liked === 'y') ?
										require('../../assets/images/icons/heart.png') :
										require('../../assets/images/icons/heart-outline.png')}
									style={styles.heartIcon}
									resizeMode="cover" />
							</TouchableOpacity>

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
}
export default MyProfileTab;

