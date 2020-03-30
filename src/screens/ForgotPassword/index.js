import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { TextInput, Button, withTheme } from 'react-native-paper';
import styles from './styles';
import { userForgotPassword } from './../../api';
import Loader from './../../Loader';
import { Toast } from 'native-base';

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
		{children}
	</TouchableWithoutFeedback>
);
class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			action: '',
			isFetching: false,
			loading: false,
			errorMsg: '',

			isLoading: false
		};

	}
	navigateToLogin = () => {
		this.props.navigation.navigate('Login');
	}

	handleForgotPass = () => {
		if (this.validateForgot()) {
			this.showToast("Please enter valid email address")
			return;
		}

		this.setState({ isLoading: true })

		let data = new FormData();
		data.append("action", "userForgotPassword");
		data.append("email", this.state.email);

		userForgotPassword("POST", data).then(data => {
			this.setState({
				isLoading: false,
				email: ''
			}, () => { this.showToast("Password reset link has been sent successfully") });
		}).catch((err) => {
			this.setState({ isLoading: false }, () => { this.showToast("Something has went wrong") });
		})
	}


	showToast = (message) => {
		Toast.show({
			text: message,
			duration: 2000
		})
	}

	validateForgot = () => {
		const email_address = this.checkValid();
		if (email_address) {
			return true;
		} else {
			return false;
		}
	}



	checkEmail = (email) => {
		this.setState({ email });
		this.checkValid();
	}

	checkValid() {
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		console.log('check valid .....');
		if (reg.test(this.state.email) === false) {
			this.setState({ errorMsg: 'Please enter valid email' })
			console.log("Email is Not Correct");
			return true;
		}
		else {
			this.setState({ errorMsg: '' });
			console.log("Email is Correct");
			return false;
		}
	}

	render() {
		const { colors } = this.props.theme;
		return (
			<DismissKeyboard>
				<View style={styles.container}>
					<Loader loading={this.state.isLoading} />
					<Image
						style={{ height: 100, width: 100, alignSelf: 'center' }}
						source={require('./../../assets/images/Appstore.jpg')}
					/>
					<TextInput style={styles.input}
						label='Enter your email address'
						mode="flat"
						keyboardType="email-address"
						autoCapitalize="none"
						value={this.state.email}
						//onChangeText={email=>this.setState({email})}
						onChangeText={email => this.checkEmail(email)}
					/>
					<Text style={styles.errorMsg}>
						{this.state.errorMsg}
					</Text>
					<Button mode="contained" style={styles.submitbutton} onPress={this.handleForgotPass}>Send Reset Link</Button>
					<View style={styles.forgotPassView}>
						<Text mode="text" color="#858a8c" >You have already account? </Text>
						<Text mode="text" color="#858a8c" onPress={this.navigateToLogin} style={{ color: colors.primary }}>Sign In</Text>
					</View>
				</View>
			</DismissKeyboard>
		);
	}
}
export default withTheme(ForgotPassword) 