import React, { Component } from 'react';
import { View, Text, AsyncStorage, TouchableWithoutFeedback, Keyboard, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import styles from './styles';
import { withTheme } from 'react-native-paper';
import { sendRequest } from './../../api';
import PasswordInputText from 'react-native-hide-show-password-input';
import Loader from './../../Loader';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import * as Location from 'expo-location';
import { checkField, showToastMessage } from './../../utils/helper';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
		{children}
	</TouchableWithoutFeedback>
);
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			isLoading: false,
			visible: false,
			message: '',
			first_name: '',
			last_name: '',
			action: '',
			device: '',
			device_token: '',
			location: {
				coords: {
					latitude: 0,
					longitude: 0
				}
			}
		};
	}
	navigateToForgotpass = () => {
		this.props.navigation.navigate('ForgotPassword');
	}
	navigateToPhonenumber = () => {
		this.props.navigation.navigate('Phonenumber');
	}
	navigateToDashboard = () => {
		this.props.navigation.navigate('Dashboard');
	}

	componentDidMount() {
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

	handleLogin = async () => {

		if (this.validateLogin()) {

			showToastMessage("Please fill all fields")
			return;
		}

		this.setState({
			isLoading: true
		});

		let data = new FormData();
		data.append("action", "login");
		data.append("email", this.state.email);
		data.append("password", this.state.password);
		data.append("device", Platform.OS == "ios" ? "iOS" : "Android");
		data.append("device_token", "");
		let user = await sendRequest("POST", data);
		if (user.status) {
			await AsyncStorage.setItem("user", JSON.stringify(user.data));
			await this.updateUserLocation(user);
			this.setState({ isLoading: false }, () => {
				this.navigateToDashboard();
			})
		} else {
			showToastMessage("Incorrect password or email")
		}
	}

	updateUserLocation = async (user) => {
		const { latitude, longitude } = this.state.location.coords;
		console.log("Location", this.state.location)
		let data = new FormData();
		data.append("lat", latitude);
		data.append("lng", longitude);
		data.append("action", "getLatLong");
		data.append("user_id", user.data.id);

		// return await updateLocation("POST", data)
		return await sendRequest("POST", data)
	}

	validateLogin = () => {
		const email_address = checkField(this.state.email);
		const pass = checkField(this.state.password);
		if (email_address || pass) {
			return true;
		} else {
			return false;
		}
	}


	render() {
		const { colors } = this.props.theme;
		return (
			<DismissKeyboard>
				<View style={styles.container}>
					{/* <Loader loading={this.state.isLoading} /> */}
					<Image
						style={{ height: 100, width: 100, alignSelf: 'center' }}
						source={require('./../../assets/images/Appstore.jpg')} />
					<Image
						style={styles.logoImage}
						source={require('./../../assets/images/newwowwao1logo.png')} />
					<KeyboardAvoidingView behavior='position'
						keyboardVerticalOffset={keyboardVerticalOffset}>
						<TextInput style={styles.input}
							label='Enter your email ID/Mobile number'
							mode="flat"
							keyboardType="email-address"
							autoCapitalize="none"

							value={this.state.email}
							onChangeText={email => this.setState({ email })}
						/>
						<PasswordInputText
							label='Enter Password'
							mode="flat"
							value={this.state.password}
							onChangeText={password => this.setState({ password })}
						/>
					</KeyboardAvoidingView>
					<Text mode="text" color="#858a8c" onPress={this.navigateToForgotpass} style={[styles.forgotbutton, { color: colors.primary }]}>Forgot password?</Text>
					<Button
						mode="contained"
						style={styles.loginbutton}
						onPress={this.handleLogin}>
						SIGN IN
          			</Button>
					<View style={styles.signUpView}>
						<Text mode="text" color="#858a8c" >Don't have an account? </Text>
						<Text mode="text" color="#858a8c" style={{ color: colors.primary }} onPress={this.navigateToPhonenumber}>Create account</Text>
					</View>
				</View>
			</DismissKeyboard>
		);
	}
}
export default withTheme(Login) 