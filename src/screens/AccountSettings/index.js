import React, { Component } from 'react';
import { View, Text, Image, Keyboard } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { Appbar, Card, TextInput, Button, Switch, List } from 'react-native-paper';
import styles from './styles';
import theme from './../../theme';
import { ScrollView } from 'react-native-gesture-handler';
import { withTheme } from 'react-native-paper';
import { sendRequest } from './../../api';
import { getData } from './../../utils/helper';
import PasswordInputText from 'react-native-hide-show-password-input';
import { checkField, showToastMessage } from './../../utils/helper';

class AccountSettings extends Component {

	static navigationOptions = {
		drawerIcon: ({ tintColor }) => (
			<Image source={require('../../../src/assets/images/icons/accountsettings.png')} style={[theme.icon, { tintColor: tintColor }]} />
		)
	}
	constructor(props) {
		super(props);
		this.state = {
			friendrequestaccept: false,
			friendrequestrecived: false,
			isOnBlueToggleSwitch: false,
			commentonpost: false,
			receivemessage: false,
			likeyourpost: false,
			followsyou: false,
			choosenIndex: 0,
			ShowPicker: false,
			old_password: '',
			new_password: '',
			user_id: '',
			c_password: '',
			message: '',
			isSwitchOn1: false,
			isSwitchOn2: false,
			isSwitchOn3: false,
			isSwitchOn4: false,
			isSwitchOn5: false,
			isSwitchOn6: false,
		};

	}
	onToggle(isOn) {
		console.log("Changed to " + isOn);
	}
	handlePushNotSetting = async () => {
		console.log('handle push not setting..');
	}
	handleChangePassword = async () => {
		let authUser = await getData("user")

		if (this.validateChangePassword()) {
			showToastMessage("Please fill all fields")
			return true;
		}
		let data = new FormData();
		data.append("action", "userChangePassword");
		data.append("old_password", this.state.old_password);
		data.append("new_password", this.state.new_password);
		data.append("user_id", JSON.parse(authUser).id);
		console.log(data);
		let response = await sendRequest("POST", data);
		console.log("Posts", data);
		if (response.status == true) {
			showToastMessage("Password Changed Successfully!");
			this.resetForm();
		}
		else {
			showToastMessage("Wrong old password");
		}
	}
	resetForm = () => {
		this.setState({ old_password: "", new_password: "", c_password: "" });
	}
	_openMenu = () => {
		Keyboard.dismiss();
		this.props.navigation.dispatch(DrawerActions.openDrawer());
	}
	componentDidMount = async () => {
		let user = await getData("user");
		user = JSON.parse(user);
	}
	validateChangePassword = () => {
		const currentPass = checkField(this.state.old_password);
		const password = checkField(this.state.new_password);
		const c_password = checkField(this.state.c_password);
		console.log(currentPass);
		console.log(password);
		console.log(c_password);
		if (this.state.new_password !== this.state.c_password) {

			showToastMessage("Password and confirm password must match.")

			return true;
		}
		if (currentPass || password || c_password) {
			return true;
		}
		else {
			return false;
		}
	}
	render() {
		const { colors } = this.props.theme;

		const { isSwitchOn1, isSwitchOn2, isSwitchOn3, isSwitchOn4, isSwitchOn5, isSwitchOn6 } = this.state;
		return (
			<View style={{ backgroundColor: '#1da1f2' }}>
				<Appbar.Header>
					<Appbar.Action icon="menu" onPress={this._openMenu} />
					<Appbar.Content titleStyle={styles.headerTitle} title="Account Settings" /></Appbar.Header>
				<ScrollView >
					<View style={styles.container}>
						<View style={styles.backgroundContainer}>
							<Image style={styles.imgsize} source={require('../../assets/images/icons/accountSettingsWhite.png')} />
						</View>
						<View style={styles.card}>
							<Card >
								<Card.Title title="Change Password" />
								<Card.Content>
									<View>
										<TextInput
											style={{ backgroundColor: 'white' }}
											placeholder='Old Password'
											value={this.state.old_password}
											onChangeText={old_password => this.setState({ old_password })}
										/>
										<TextInput
											style={{ backgroundColor: 'white' }}
											placeholder='New Password'
											value={this.state.new_password}
											onChangeText={new_password => this.setState({ new_password })}
										/>
										<PasswordInputText
											label='Confirm New Password'
											value={this.state.c_password}
											onChangeText={c_password => this.setState({ c_password })}
										/>
									</View>
									<View style={styles.savebtn}>
										<Button style={styles.btnSubmit}
											mode='contained' uppercase={false}
											onPress={() => this.handleChangePassword()}>
											Submit
                 						</Button>
										<Button style={styles.btnCancel}
											mode='outlined' uppercase={false}>
											Cancel
                  						</Button>
									</View>

								</Card.Content>
							</Card>
						</View>






						{/* <View style={styles.card}>
							<Card >
								<Card.Title title="Manage Push Notification" />
								<Card.Content>
									<View style={styles.pushLabels}>
										<Text>When Receive Friend Request</Text>
										<Switch
											value={isSwitchOn1}
											onValueChange={() => { this.setState({ isSwitchOn1: !isSwitchOn1 }); }
											}
											color={colors.primary}
										/>
									</View>
									<View style={styles.pushLabels}>
										<Text>When Accept Friend Request</Text>
										<Switch
											value={isSwitchOn2}
											onValueChange={() => { this.setState({ isSwitchOn2: !isSwitchOn2 }); }
											}
											color={colors.primary}
										/>
									</View>
									<View style={styles.pushLabels}>
										<Text>When Post Like Notification</Text>
										<Switch
											value={isSwitchOn3}
											onValueChange={() => { this.setState({ isSwitchOn3: !isSwitchOn3 }); }
											}
											color={colors.primary}
										/>
									</View>
									<View style={styles.pushLabels}>
										<Text>When Post Comment</Text>
										<Switch
											value={isSwitchOn4}
											onValueChange={() => { this.setState({ isSwitchOn4: !isSwitchOn4 }); }
											}
											color={colors.primary}
										/>
									</View>
									<View style={styles.pushLabels}>
										<Text>When Following</Text>
										<Switch
											value={isSwitchOn5}
											onValueChange={() => { this.setState({ isSwitchOn5: !isSwitchOn5 }); }
											}
											color={colors.primary}
										/>
									</View>
									<View style={styles.pushLabels}>
										<Text>When Message</Text>
										<Switch
											value={isSwitchOn6}
											onValueChange={() => { this.setState({ isSwitchOn6: !isSwitchOn6 }); }
											}
											color={colors.primary}
										/>
									</View>
									<View style={styles.savebtn}>
										<Button style={styles.btnSubmit}
											mode='contained' uppercase={false}
											onPress={() => this.handlePushNotSetting()}>
											Submit
                 						</Button>
										<Button style={styles.btnCancel}
											mode='outlined' uppercase={false}>
											Cancel
                  						</Button>
									</View>

								</Card.Content>
							</Card>
						</View> */}




						{/* <View style={styles.card}>
							<Card >
								<Card.Title title="Change Language" />
								<Card.Content>
									<View style={styles.pushLabels}>
										<List.Section title="Accordions">
											<List.Accordion
												title="Uncontrolled Accordion"
												left={props => <List.Icon {...props} icon="folder" />}
											>
												<List.Item title="First item" />
												<List.Item title="Second item" />
											</List.Accordion>
										</List.Section>
									</View>

									<View style={styles.savebtn}>

									</View>

								</Card.Content>
							</Card>
					</View> */}

					</View>
				</ScrollView>
			</View>
		);
	}
}
export default withTheme(AccountSettings);