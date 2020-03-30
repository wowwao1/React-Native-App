import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { decode, encode } from 'base-64';
import OneSignal from 'react-native-onesignal';
import { getData } from '../../utils/helper';
import styles from './styles';

class AuthLoading extends React.Component {
  constructor(properties) {
    super(properties);
    OneSignal.init("ee5169a7-d089-4de3-98c4-4c6bc8378925");
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }
  componentWillMount() {
    OneSignal.inFocusDisplaying(0);
    OneSignal.addEventListener('opened', this.onOpened.bind(this));
  }
  onReceived(notification) {
    console.log("Notification received: ", notification);
  }
  onOpened(openResult) {
    let data = openResult.notification.payload.additionalData;
    let type = openResult.notification.payload.additionalData.notification_type;
    if (type == "req_acpt" || type == "user_follow") {
      this.props.navigation.navigate('Notifications', data)
    } else if (type == "post_like" || type == "post_cmnt") {
      console.log("PUSH NOTIFICATION")
      console.log(data);
      this.props.navigation.navigate('SinglePostView', { data });
    } else if (type == "req_rece") {
      this.props.navigation.navigate('Friend Requests', data)
    } else {
      this.props.navigation.navigate('Home', data)
    }
    console.log('Data: ', openResult);
  }
  onIds(device) {
    console.log('Device info: ', device);
  }
  async componentDidMount() {
    if (!global.btoa) {
      global.btoa = encode;
    }
    if (!global.atob) {
      global.atob = decode;
    }
    let user = await getData("user");
    if (user) {
      this.props.navigation.navigate('App');
    } else {
      this.props.navigation.navigate('Auth');
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={true}
        />
      </View>
    );
  }
}

export default AuthLoading;