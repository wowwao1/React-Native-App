import React, { Component } from 'react';
import {
	View,
	Text,
	Keyboard,
	TouchableOpacity,
	Image,
	Platform,
	TouchableWithoutFeedback,
	ActivityIndicator
} from 'react-native';
import { Appbar, TextInput, RadioButton } from 'react-native-paper';
import styles from './styles';
import { sendRequest } from './../../api';
import { getData } from '../../utils/helper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { request, PERMISSIONS } from 'react-native-permissions';
import PostImagePreview from './../../components/PostImagePreview';
import { ActionSheet } from 'native-base';
import * as Picker from 'expo-image-picker';
import { checkField, showToastMessage } from './../../utils/helper';
const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
		{children}
	</TouchableWithoutFeedback>
);

class NewPost extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user_id: '',
			action: '',
			public: '',
			private: '',
			userposts: '',
			post_type: 'Public',
			post_text: '',
			addPost: '',
			description: '',
			visible: false,
			avatarSource: null,
			isLoading: false,
			ImageSource: null,
			editMode: false,
			message: ''
		};
	}


	showActionSheet = () => {
		let buttons = ["Camera", "Gallery", "Cancel"]
		ActionSheet.show(
			{
				options: buttons,
				cancelButtonIndex: 2,
				title: "Choose Image Source"
			},
			buttonIndex => {
				this.onImageSourceSelection(buttons[buttonIndex]);
			}
		)
	}

	onImageSourceSelection = async (source) => {
		if (source == "Camera") {
			let result = await Picker.launchCameraAsync({
				mediaTypes: Picker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 5],
				quality: 1
			});

			console.log(result);
			this.setSourceImage(result)

		} else {

			let result = await Picker.launchImageLibraryAsync({
				mediaTypes: Picker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 5],
				quality: 1
			});

			console.log(result);
			this.setSourceImage(result)
		}
	}

	setSourceImage = (image) => {
		const source = { uri: image.uri };
		this.setState({
			avatarSource: source,
		});
	}

	askCameraRollPermission = () => {
		if (Platform.OS == "android") {
			request(PERMISSIONS.ANDROID.CAMERA).then(result => {
				console.log("PERMISSION");
				console.log(result)
			});
			request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
				console.log("PERMISSION");
				console.log(result)
			});
		} else {
			request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
				console.log(result)
			});

			request(PERMISSIONS.IOS.CAMERA).then(result => {
				console.log(result)
			});
		}
	};

	navigateToHome = () => {
		this.props.navigation.setParams({ EditPost: null });
		this.props.navigation.goBack()
	}

	componentDidMount = async () => {
		this.props.navigation.addListener("willFocus", () => {
			if (this.props.navigation.getParam("EditPost")) {
				let post = this.props.navigation.getParam("EditPost");

				// console.log(post.image[0].path)
				this.setState({
					post_type: post.post_type,
					description: post.post_text,
					editMode: true,
					avatarSource: post.image.length > 0 ? { uri: post.image[0].path } : null
				})
			} else {
				this.setState({
					post_type: 'Public',
					description: "",
					editMode: false
				})
			}

		});
		let user = await getData("user");
		user = JSON.parse(user);
		this.askCameraRollPermission();
		this.props.navigation.addListener('willFocus', () => {
			console.log("EDIT MODE");
			console.log(this.state.editMode)
		})
	}

	handlePost = async () => {
		let user = await getData("user");
		if (this.validatePost()) {

			showToastMessage("Please fill the description")

			return;
		}
		this.setState({
			isLoading: true
		});
		if (!this.state.editMode) {
			let body = {
				"action": "addPost",
				"user_id": JSON.parse(user).id,
				"post_type": this.state.post_type,
				"post_text": this.state.description,
			}
			let data = this.createFormData(this.state.avatarSource, body);
			console.log("POST Data", data);
			//addPost("POST", data).then(data => {
			sendRequest("POST", data).then(data => {
				this.setState({ isLoading: false })
				this.setState({ addpost: data.data })
				this.props.navigation.navigate('Home', { post: null });
				this.resetForm();
			})
		} else {
			let body = {
				"action": "editPost",
				"user_id": JSON.parse(user).id,
				"post_type": this.state.post_type,
				"post_text": this.state.description,
				"post_id": this.props.navigation.getParam("EditPost").id
			}
			let data = this.createFormData(this.state.avatarSource, body);

			console.log("EDIt POST");
			console.log(data[0])

			console.log(data);

			//editPost("POST", data).then(data => {
			sendRequest("POST", data).then(data => {
				console.log("EDIT DATA", data)
				this.setState({ isLoading: false })
				this.setState({ addpost: data.data })
				this.props.navigation.navigate('Home', { post: null });
				this.resetForm();
			})
		}
	}
	createFormData = (photo, body) => {
		const data = new FormData();
		if (photo) {
			data.append("post_image[0]", {
				name: "test",
				type: "image/png",
				uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
			});
		}
		else {
			data.append("post_image", "null");
		}
		Object.keys(body).forEach(key => {
			data.append(key, body[key]);
		});
		//data.append("post_image", "nuxxxll");
		return data;
	};
	validatePost = () => {
		const description_text = checkField(this.state.description);
		if (description_text && this.state.avatarSource == null) {
			return true;
		} else {
			return false;
		}
	}

	resetForm = () => {
		this.setState({ description: '', avatarSource: null });
	}
	editPOST = async () => {
		let user = await getData("user");

		let body = {
			"action": "editPost",
			"user_id": this.props.navigation.getParam("EditPost").id,
			"post_type": this.props.navigation.getParam("EditPost").post_type,
			"post_text": this.props.navigation.getParam("EditPost").post_text,
		}
		let data = this.createFormData(this.state.avatarSource, body);
	}


	deletePostImage = (userid) => {
		let data = new FormData();
		data.append("action", "userDeletePostImage");
		data.append("user_id", userid);
		data.append("img_id", "1");
		console.log(data);
		// userDeletePostImage("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ isLoading: false, isFetching: false })
			console.log("Posts", data);
			this.setState({ deleteImage: data.data, isFetching: false })

		})
	}

	onImageClose = () => {
		this.setState({
			avatarSource: null
		})
	}

	render() {
		return (
			<DismissKeyboard>
				<View style={styles.MainContainer}>
					<Appbar.Header>
						<Appbar.BackAction
							icon="back"
							onPress={this.navigateToHome}
						/>
						<Appbar.Content
							title="Whats on your mind" />
						<Appbar.Action
							icon="send"
							onPress={() => this.handlePost()} />
						<ActivityIndicator animating={this.state.isLoading} color="#ffffff" />
					</Appbar.Header>
					<View style={styles.txtDescription}>
						<TextInput style={{ height: 100, flex: 1, backgroundColor: 'white' }}
							placeholder={"What's happening?"}
							mode="flat"
							multiline={true}
							value={this.state.description}
							onChangeText={description => this.setState({ description })}>
						</TextInput>
						<TouchableOpacity
							onPress={() => this.showActionSheet()}
							style={styles.profileCameraImage} >
							<Image
								style={{ width: 42, height: 42 }}
								source={require('../../assets/images/icons/circleCamera2.png')}
							/>
						</TouchableOpacity>
					</View>
					<View >
						<Text style={styles.postSelect}>Select Post</Text>
					</View>
					<RadioButton.Group
						onValueChange={post_type => this.setState({ post_type })}
						value={this.state.post_type}
					>
						<View style={{ flexDirection: 'row' }}>
							<RadioButton style={styles.publicPost}
								value="Public"
							/>
							<Text style={{ marginTop: 10 }}>
								Public
    						</Text>
							<MaterialIcons
								style={styles.publicPost}
								name="public" size={20} />

							<RadioButton style={styles.Unfilledround}
								value="Private"

							/>
							<Text style={{ marginTop: 12 }}>
								Private
    						</Text>
							<EvilIcons
								style={styles.publicPost}
								name="lock" size={28} />
						</View>
					</RadioButton.Group>

					{
						this.state.avatarSource && this.state.avatarSource.uri != "" && (
							<PostImagePreview image={this.state.avatarSource} onClose={() => this.onImageClose()} />
						)
					}
				</View>
			</DismissKeyboard>
		);
	}

}

export default NewPost;