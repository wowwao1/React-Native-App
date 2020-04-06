import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, Text, Image ,TouchableOpacity,AsyncStorage} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const styles = StyleSheet.create({
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
});
 
const slides = [
  {
   image : require('../../assets/images/discover.png'),
  },
  {
    image : require('../../assets/images/sharethoughts.png'),
  },
  {
    image : require('../../assets/images/connecttoworld.png')
  },
];
 
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      loading: true,
     
    };
  }
    _renderNextButton = () => {
      return (
        <View style={styles.buttonCircle}>
          <Ionicons
            name="md-arrow-round-forward"
            color="rgba(255, 255, 255, .9)"
            size={24}
            style={{ backgroundColor: 'transparent' }}
          />
        </View>
      );
    };

    componentDidMount() {
      AsyncStorage.getItem('first_time').then((value) => {
        this.setState({ showRealApp: !!value, loading: false });
      });
    }
    _renderDoneButton = () => {
      return (
        <TouchableOpacity style={styles.buttonCircle} onPress={this.navigateToLogin}>
          <Ionicons
            name="md-checkmark"
            color="rgba(255, 255, 255, .9)"
            size={24}
            style={{ backgroundColor: 'transparent' }}
          />
        </TouchableOpacity>
      );
    };

    navigateToLogin = () => {
    
    AsyncStorage.setItem('first_time', 'true').then(() => {
      this.setState({ showRealApp: true });
      this.props.navigation.navigate('AuthLoading');
    });
  }
  

  
    render() {
      if (this.state.showRealApp) {
        //Real Application
        return (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 50,
            }}>{
              this.props.navigation.navigate('AuthLoading')
            }
            
          </View>
        );
      } else {
     
      return (
        <AppIntroSlider
          slides={slides}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
        />
      
      );
      
    }
  }
}