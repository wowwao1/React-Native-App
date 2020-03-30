import 'react-native-gesture-handler';
import { getData } from './src/helper';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import React from 'react';
import { AppState } from 'react-native';
import { sendRequest } from './src/api';
import { Root } from "native-base";
import AppNavigator from './src/navigators';
import colors from './src/utils/colors';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
  },
};

class App extends React.Component {
  state = {
    appState: AppState.currentState
  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  setUserAvailibilty = async () => {
    let user = await getData("user");
    user = JSON.parse(user);
    let data = new FormData();
    data.append("action", "setAvailability");
    data.append("user_id", user.id);
    data.append("isOnline", 1);
    console.log(data);

    //setAvailability("POST", data).then(data => {
    sendRequest("POST", data).then(data => {
      if (data.status) {

        this.setState({ activateStatus: data.data, isFetching: false })

      }
    })
  }
  setUserUnAvailibilty = async () => {
    let user = await getData("user");
    user = JSON.parse(user);
    let data = new FormData();
    data.append("action", "setAvailability");
    data.append("user_id", user.id);
    data.append("isOnline", 0);
    console.log(data);
    // setAvailability("POST", data).then(data => {
    sendRequest("POST", data).then(data => {
      if (data.status) {
        this.setState({ activateStatus: data.data, isFetching: false })
      }
    })
  }

  _handleAppStateChange = async (nextAppState) => {
    let user = await getData("user");
    user = JSON.parse(user);
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      this.setUserAvailibilty(user.id)
    } else {
      console.log('App has come to the background!')
      this.setUserUnAvailibilty(user.id)
    }
    this.setState({ appState: nextAppState });
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <Root>
          <AppNavigator />
        </Root>
      </PaperProvider>
    )
  }
}
export default App;





// import 'react-native-gesture-handler';
// import { getData } from './src/utils/helper';
// import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
// import React from 'react';
// import { AppState } from 'react-native';
// import { setAvailability } from './src/api';
// import { Root } from "native-base";
// import AppNavigator from './src/navigators';
// ​
// global.APPURL = 'http://ec2-18-221-119-107.us-east-2.compute.amazonaws.com/api';
// global.user_name = '';
// const theme = {
//   ...DefaultTheme,
//   roundness: 2,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#1778F2',
//     accent: '#f1c40f',
//   },
// };
// class App extends React.Component {
//   state = {
//     appState: AppState.currentState
//   } 
//   componentDidMount() {
//     AppState.addEventListener('change', this._handleAppStateChange);
//   }
//   componentWillUnmount() {
//     AppState.removeEventListener('change', this._handleAppStateChange);
//   }
//   setUserAvailibilty = async () => {
//     let user = await getData("user");
//     user = JSON.parse(user);
//     let data = new FormData();
//     data.append("action", "setAvailability");
//     data.append("user_id", user.id);
//     data.append("isOnline", 1);
//     console.log(data);
//     setAvailability("POST", data).then(data => {
//       if (data.status) {
//         this.setState({ activateStatus: data.data, isFetching: false })
//       }
//     })
//   }
//   setUserUnAvailibilty = async () => {
//     let user = await getData("user");
//     user = JSON.parse(user);
//     let data = new FormData();
//     data.append("action", "setAvailability");
//     data.append("user_id", user.id);
//     data.append("isOnline", 0);
//     console.log(data);
//     setAvailability("POST", data).then(data => {
//       if (data.status) {
//         this.setState({ activateStatus: data.data, isFetching: false })
//       }
//     })
//   }
//   _handleAppStateChange = async (nextAppState) => {
//     let user = await getData("user");
//     user = JSON.parse(user);
//     if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
//       console.log('App has come to the foreground!')
//       this.setUserAvailibilty(user.id)
//     } else {
//       console.log('App has come to the background!')
//       this.setUserUnAvailibilty(user.id)
//     }
//     this.setState({ appState: nextAppState });
//   }
//   render() {
//     return (
//       <PaperProvider theme={theme}>
//         <Root>
//           <AppNavigator />
//         </Root>
//       </PaperProvider>
//     )
//   }
// }
// export default App;





