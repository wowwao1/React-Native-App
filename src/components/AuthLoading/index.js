// import React from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { decode, encode } from 'base-64';
// import OneSignal from 'react-native-onesignal';
// import { getData } from '../../utils/helper';
// import styles from './styles';
// import { sendRequest } from './../../api';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import * as Location from 'expo-location';
// class AuthLoading extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       location: {
// 				coords: {
// 					latitude: 0,
// 					longitude: 0
// 				}
// 			}
//     }
//     OneSignal.init("ee5169a7-d089-4de3-98c4-4c6bc8378925");
//     OneSignal.addEventListener('received', this.onReceived);
//     OneSignal.addEventListener('opened', this.onOpened);
//     OneSignal.addEventListener('ids', this.onIds);
//   }
  

// 	askLocationPermission = async () => {
// 		if (Platform.OS == "android") {
// 			let coarse_location = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
// 			if (coarse_location == 'granted') {
// 				let fine_location = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
// 				this.getLocation(fine_location);
// 			}
// 		} else {
// 			let locationAlways = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
// 			this.getLocation(locationAlways);
// 		}
// 	};

// 	getLocation = (result) => {
// 		if (result == "granted") {
// 			Location.getCurrentPositionAsync({}).then(location => {
// 				this.setState({ location })
// 			})
// 		}
//   }
//   updateUserLocation = async () => {
//     let user = await getData("user");
//     user = JSON.parse(user);
// 		const { latitude, longitude } = this.state.location.coords;
// 		console.log("Location", this.state.location)
// 		let data = new FormData();
// 		data.append("lat", latitude);
// 		data.append("lng", longitude);
// 		data.append("action", "getLatLong");
// 		data.append("user_id", user.id);
//     console.log("UpdateLocation",data)
// 		// return await updateLocation("POST", data)
// 		return await sendRequest("POST", data)
// 	}
  
//   componentWillUnmount() {
//     OneSignal.removeEventListener('received', this.onReceived);
//     OneSignal.removeEventListener('opened', this.onOpened);
//     OneSignal.removeEventListener('ids', this.onIds);
//   }
//   componentWillMount =  async () => {
//     this.askLocationPermission();
//     let user = await getData("user");
//     console.log("Update Location@@@@@@@")
//     await this.updateUserLocation(user);
//     OneSignal.inFocusDisplaying(0);
//     OneSignal.addEventListener('opened', this.onOpened.bind(this));
//   }
//   onReceived(notification) {
//     console.log("Notification received: ", notification);
//   }
//   onOpened(openResult) {
//     let data = openResult.notification.payload.additionalData;
//     let type = openResult.notification.payload.additionalData.notification_type;
//     if (type == "req_acpt" || type == "user_follow") {
//       this.props.navigation.navigate('Notifications', data)
//     } else if (type == "post_like" || type == "post_cmnt") {
//       console.log("PUSH NOTIFICATION")
//       console.log(data);
//       this.props.navigation.navigate('SinglePostView', { data });
//     } else if (type == "req_rece") {
//       this.props.navigation.navigate('Friend Requests', data)
//     } else {
//       this.props.navigation.navigate('Home', data)
//     }
//     console.log('Data: ', openResult);
//   }
//   onIds(device) {
//     console.log('Device info: ', device);
//   }
//   async componentDidMount() {
//     if (!global.btoa) {
//       global.btoa = encode;
//     }
//     if (!global.atob) {
//       global.atob = decode;
//     }
//     let user = await getData("user");
//     console.log("Update Location@@@@@@@")
//     await this.updateUserLocation(user);
//     if (user) {
//       this.props.navigation.navigate('App');
//     } else {
//       this.props.navigation.navigate('Auth');
//     }
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator
//           animating={true}
//         />
//       </View>
//     );
//   }
// }

// export default AuthLoading;



import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { decode, encode } from 'base-64';
import { getData } from '../../utils/helper';
import styles from './styles';
import { sendRequest } from './../../api';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import * as Location from 'expo-location';
class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
				coords: {
					latitude: 0,
					longitude: 0
				}
			}
    }
  }
	askLocationPermission = async () => {
		if (Platform.OS == "android") {
			let coarse_location = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
			if (coarse_location == 'granted') {
				let fine_location = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
				return await this.getLocation(fine_location);
			}
		} else {
			let locationAlways = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      return await this.getLocation(locationAlways);
		}
	};
	getLocation = async(result) => {
		if (result == "granted") {
			return await Location.getCurrentPositionAsync({});
		}
  }
  updateUserLocation = async () => {
    let user = await getData("user");
    user = JSON.parse(user);
		const { latitude, longitude } = this.state.location.coords;
		console.log("Location", this.state.location)
		let data = new FormData();
		data.append("lat", latitude);
		data.append("lng", longitude);
		data.append("action", "getLatLong");
		data.append("user_id", user.id);
    console.log("UpdateLocation",data)
		// return await updateLocation("POST", data)
		return await sendRequest("POST", data)
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
  // async componentDidMount() {
  //   if (!global.btoa) {
  //     global.btoa = encode;
  //   }
  //   if (!global.atob) {
  //     global.atob = decode;
  //   }
  //   let user = await getData("user");
  //   console.log("Update Location@@@@@@@")
  //   let location = await this.askLocationPermission();
  //   this.setState({
  //     location: location
  //   },()=>{
  //     this.updateUserLocation(user).then(()=>{
  //       if (user) {
  //         this.props.navigation.navigate('App');
  //       } else {
  //         this.props.navigation.navigate('Auth');
  //       }
  //     })
  //   })
  // }
  async componentDidMount() {
    if (!global.btoa) {
      global.btoa = encode;
    }
    if (!global.atob) {
      global.atob = decode;
    }
    let user = await getData("user");
    console.log("Update Location@@@@@@@")
    let location = await this.askLocationPermission();
    if(user) {
      this.setState({
        location: location
      },()=>{
        this.updateUserLocation(user).then(()=>{
          this.props.navigation.navigate('App');
        }).catch(err=>{
          this.props.navigation.navigate('Auth');
        })
      })
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