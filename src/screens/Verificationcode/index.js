import React, { Component } from 'react';
import { Alert, Animated, Image, Text, View ,TouchableOpacity,TouchableWithoutFeedback,Keyboard} from 'react-native';
import{Button} from 'react-native-paper';
import CodeFiled from 'react-native-confirmation-code-field';

import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from './styles';

const codeLength = 6;

const source = {
  uri:
    'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};
const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

 class Verificationcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      country: '',
      phone_no: ''
    };
  }
  _animationsColor = [...new Array(codeLength)].map(
    () => new Animated.Value(0),
  );
  _animationsScale = [...new Array(codeLength)].map(
    () => new Animated.Value(1),
  );

  componentDidMount() {
    this.setState({
      code : this.props.navigation.getParam('code'),
      country : this.props.navigation.getParam('country'),
      phone_no : this.props.navigation.getParam('phone_no'),
    })
  }

  onFinishCheckingCode = code => {
    if (code !== this.state.code) {
      return Alert.alert(
        'Confirmation Code',
        'Code not match! Please try again',
        [{ text: 'OK' }],
       
        { cancelable: false },
        
      );
    
    }

    this.props.navigation.navigate('SignUp',{
      country: this.state.country,
      phone_no: this.state.phone_no
    });
    
  };

  animateCell({ hasValue, index, isFocused }) {
    Animated.parallel([
      Animated.timing(this._animationsColor[index], {
        toValue: isFocused ? 1 : 0,
        duration: 250,
      }),
      Animated.spring(this._animationsScale[index], {
        toValue: hasValue ? 0 : 1,
        duration: hasValue ? 300 : 250,
      }),
    ]).start();
  }

  cellProps = ({ hasValue, index, isFocused }) => {
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? this._animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : this._animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: this._animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: this._animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      this.animateCell({ hasValue, index, isFocused });
    }, 0);

    return {
      style: [styles.input, animatedCellStyle],
    };
  };

  containerProps = { style: styles.inputWrapStyle };

  navigateToPhonenumber = () =>{
    this.props.navigation.navigate('Phonenumber');
}
navigateToSignUp = () =>{
  this.props.navigation.navigate('SignUp');
}

  render() {
    return (
        <DismissKeyboard>
        
        <View style = {styles.container}>
      
        <View >
        <TouchableOpacity onPress={this.navigateToPhonenumber}>
              <Image source={require('./../../assets/images/icons/close.png')} style={styles.closebtn}/>
          </TouchableOpacity>
         
        </View>
          
     <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Enter your recieved code</Text>
        <Image style={styles.icon} source={source} />
        <Text style={styles.inputSubLabel}>
          {'Please enter the verification code'}
        </Text>
        <CodeFiled
                maskSymbol=" "
                variant="clear"
                codeLength={codeLength}
                keyboardType="numeric"
                cellProps={this.cellProps}
                containerProps={this.containerProps}
                onFulfill={this.onFinishCheckingCode}
                CellComponent={Animated.Text}
        />
      
      </View>
    </View>
       
 </DismissKeyboard>
    );
  }
}
export default Verificationcode;



