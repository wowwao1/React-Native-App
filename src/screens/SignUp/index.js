import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Image, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, withTheme } from 'react-native-paper';
import styles from './styles';
import { sendRequest } from './../../api';
import { StackActions } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from './../../Loader';
import { checkField, showToastMessage } from './../../utils/helper';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
		{children}
	</TouchableWithoutFeedback>
);
class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			lastname: '',
			email: '',
			password: '',
			phonecode: '',
			phonenumber: '',
			device: '',
			device_token: '',
			c_password: '',
			isLoading: false,
			message: '',
		};
	}
	navigateToLogin = () => {
		this.props.navigation.navigate('Login');
	}
	profileSignup = async () => {
		if (this.validateSignup()) {
			showToastMessage("Please fill all fields")
			return;
		}
		this.setState({
			isLoading: true
		});

		let data = new FormData();
		data.append("action", "signup");
		data.append("firstname", this.state.firstname);
		data.append("lastname", this.state.lastname);
		data.append("email", this.state.email);
		data.append("password", this.state.password);
		data.append("phonecode", "+" + this.props.navigation.getParam('country').callingCode);
		data.append("phonenumber", this.props.navigation.getParam('phone_no'));
		data.append("device", Platform.OS == "ios" ? "iOS" : "Android");
		data.append("device_token", "123");

		console.log(data);
		// let response = await createAccount("POST", data);
		let response = await sendRequest("POST", data);
		this.setState({ isLoading: false })
		if (response.status) {
			showToastMessage("Thanks you. Your account has been successfully created.")

			setTimeout(() => {
				this.props.navigation.dispatch(StackActions.popToTop());
			}, 500)
		} else {

			showToastMessage("Phone number already exists")

		}
	}

	validateEmail = (email) => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}


	validateSignup = () => {
		const firstname_text = checkField(this.state.firstname);
		const lastname_text = checkField(this.state.lastname);
		const email_text = checkField(this.state.email);
		const password = checkField(this.state.password);
		const c_password = checkField(this.state.c_password);

		if (this.state.password !== this.state.c_password) {
			this.setState({
				visible: true,
				message: "Password and confirm password must match."
			})
			return true;
		}
		else if (firstname_text || lastname_text || password || c_password) {
			return true;
		} else if (!this.validateEmail(this.state.email)) {
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
					<Loader loading={this.state.isLoading} />
					<ScrollView>
						<Image
							style={{ height: 80, width: 80, alignSelf: 'center', marginTop: 80, }}
							source={require('./../../assets/images/Appstore.jpg')} />
						<Text style={styles.signupTitle}>Create an account</Text>
						<KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
							<View style={styles.inputfields}>
								<TextInput
									style={styles.input}
									label='First name'
									mode="flat"
									keyboardType="default"
									autoCapitalize="none"
									value={this.state.firstname}
									onChangeText={firstname => this.setState({ firstname })}
								/>
								<TextInput
									style={styles.input}
									label='Last name'
									mode="flat"
									keyboardType="default"
									autoCapitalize="none"
									value={this.state.lastname}
									onChangeText={lastname => this.setState({ lastname })}
								/>
								<TextInput
									style={styles.input}
									label='Email address'
									mode='flat'
									keyboardType="email-address"
									autoCapitalize="none"
									value={this.state.email}
									onChangeText={email => this.setState({ email })}
								/>
								<TextInput
									style={styles.input}
									label='Enter Password'
									mode='flat'
									keyboardType="default"
									autoCapitalize="none"
									secureTextEntry={true}
									value={this.state.password}
									onChangeText={password => this.setState({ password })}
								/>
								<TextInput
									style={styles.input}
									label='Confirm Password'
									mode='flat'
									secureTextEntry={true}
									keyboardType="default"
									autoCapitalize="none"
									value={this.state.c_password}
									onChangeText={c_password => this.setState({ c_password })}
								/>
							</View>
						</KeyboardAvoidingView>
						<Button mode="contained" style={styles.nextbutton} onPress={() => this.profileSignup()}>Create Account
						</Button>
						<View style={styles.loginView}>
							<Text mode="text" color="#858a8c" >You have already account? </Text>
							<Text mode="text" color="#858a8c" onPress={this.navigateToLogin} style={{ color: colors.primary }}>Sign In</Text>
						</View>

					</ScrollView>
				</View>
			</DismissKeyboard>
		);
	}
}
export default withTheme(SignUp);