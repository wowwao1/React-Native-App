import React, { Component } from 'react';
import { View, Text, Platform, Keyboard, TouchableOpacity, ScrollView, numberOfLines } from 'react-native';
import { Appbar, Avatar, Button, TextInput } from 'react-native-paper';
import styles from './styles';
import { getData, showToastMessage } from './../../utils/helper';
import { sendRequest } from './../../api';
import ImagePicker from 'react-native-image-picker';

import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Loader from './../../Loader';
import * as Location from 'expo-location';
class EditProfile extends Component {
	_openMenu = () => {
		Keyboard.dismiss();
		this.props.navigation.navigate('MyProfileTab');
	}
	constructor(props) {
		super(props);
		this.state = {
			avatarSource: '',
			first_name: '',
			email: '',
			phone_no: '',
			about: '',
			profile_img: '',
			editMode: false,
			isLoading: false,
			location: {
				coords: {
					latitude: 0,
					longitude: 0
				}
			},
			message: ''
		};
	}

	showActionSheet = () => {
		const options = {
			title: 'Select Image',
			allowsEditing: true,
		}
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				const source = response;
				this.setState({
					avatarSource: source.uri

				}, () => {
					this.EditProfilePic()
				});
			}
		});
	};

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
		}
	};

	submitProfile = async () => {

		this.setState({ isLoading: true });
		Keyboard.dismiss();
		let user = await getData("user");
		user = JSON.parse(user);
		this.editMyProfile(user.id)

	}

	editMyProfile = (userid) => {
		const { latitude, longitude } = this.state.location.coords;
		console.log("Location", this.state.location);
		console.log(userid);
		let data = new FormData();
		data.append("action", "userEditProfile");
		data.append("user_id", userid);
		data.append("first_name", this.state.first_name);
		data.append("city", "1");
		data.append("state", "2");
		data.append("country", "in");
		data.append("city_lat", latitude);
		data.append("city_long", longitude);
		data.append("phone_no", this.state.phone_code + '' + this.state.phone_no);
		data.append("about", this.state.about);
		data.append("email", this.state.email);
		console.log(data);


		// userEditProfile("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			console.log('userEditProfile API data :', data);

			this.setState({ isLoading: false, editprofile: data.data, refreshing: false }, () => {
				showToastMessage('Profile has been updated successfully');
				const { goBack } = this.props.navigation;
				goBack(null);
			})
		})
	}

	EditProfilePic = async () => {
		let user = await getData("user");
		let body = {
			"action": "userEditPicture",
			"user_id": JSON.parse(user).id,
			"picture_type": "Profile",
		}
		let data = this.createFormData(this.state.avatarSource, body);
		// userEditPicture("POST", data).then(data => {
		sendRequest("POST", data).then(data => {
			this.setState({ isLoading: false })
			console.log("ProfilePic", data);
		})
	}

	createFormData = (photo, body) => {
		const data = new FormData();

		if (photo) {
			data.append("image_upload", {
				name: "test",
				type: "image/png",
				uri:
					Platform.OS === "android" ? photo : photo.replace("file://", "")
			});
		}

		Object.keys(body).forEach(key => {
			data.append(key, body[key]);
		});
		return data;
	};

	componentDidMount = async () => {
		console.log(user)
		let user = await getData("user");
		user = JSON.parse(user);
		let profile = this.props.navigation.getParam("EditProfile");
		console.log("Img", profile.profile_img)
		this.setState({
			first_name: profile.first_name,
			about: profile.about,
			email: profile.email,
			phone_no: profile.phone_code + '' + profile.phone_no,
			avatarSource: profile.profile_img,

			editMode: true
		})

		console.log("Profile", profile)
		this.askCameraRollPermission();
		this.askLocationPermission();
	}


	askLocationPermission = async () => {
		if (Platform.OS == "android") {
			let coarse_location = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
			if (coarse_location == 'granted') {
				let fine_location = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
				this.getLocation(fine_location);
			}
		} else {
			let locationAlways = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
			this.getLocation(locationAlways);
		}
	};

	getLocation = (result) => {
		if (result == "granted") {
			Location.getCurrentPositionAsync({}).then(location => {
				this.setState({ location })
			})
		}
	}
	render() {
		return (
			<View >
				<Appbar.Header>
					<Appbar.Action icon="close" onPress={() => this._openMenu()} />
					<Appbar.Content
						titleStyle={styles.headerTitle}
						title="Edit Profile" />
					<Appbar.Action icon='done'
						onPress={() => this.submitProfile()}
					/>
				</Appbar.Header>
				<View >

					<Loader loading={this.state.isLoading} />

					<ScrollView >
						<View >
							<TouchableOpacity>
								<Avatar.Image size={80}

									source={{ uri: this.state.avatarSource }}
									style={styles.avtarimage}
								/>
							</TouchableOpacity>
							<View style={styles.btnBorder}>
								<TouchableOpacity onPress={() => this.showActionSheet()}>
									<Button
										uppercase={false}
										mode='text'>
										Change Profile Photo
                          			</Button>
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.txtInput}>
							<TextInput
								label='Name'
								style={{ backgroundColor: 'white' }}
								value={this.state.first_name}
								onChangeText={first_name => this.setState({ first_name })}
							/>
						</View>
						<View style={styles.bioInput} >
							<TextInput multiline={true}
								numberOfLines={Platform.OS === 'ios' ?
									null : numberOfLines}
								mode='outlined'
								label='Bio'
								style={styles.bioInput}
								value={this.state.about}
								onChangeText={about => this.setState({ about })}
							/>
						</View>
						<View >
							<Text style={{ padding: 15, }}>
								Private Information
                			</Text>
							<TextInput
								label='Email'
								style={{ backgroundColor: 'white' }}
								autoCapitalize="none"
								value={this.state.email}
								onChangeText={email => this.setState({ email })}
							/>
							<TextInput
								label='Phone'
								style={{ backgroundColor: 'white' }}
								value={this.state.phone_no}
								onChangeText={phone_no => this.setState({ phone_no })}
							/>
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}
}
export default EditProfile;