import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  Image
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
import { phoneVerification } from './../../api';
import { getData } from './../../helper';
import { Button } from 'react-native-paper';

const brandColor = '#1778F2';


 class Phonenumber extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phone_no: '',
      spinner: false,
      country: {
        cca2: 'IN',
        callingCode: '91'
      },
      requestFalse : false
    };

  }
  _handlePhoneVerification = async () => {
        let user = await getData("user");
        let data = new FormData();
        data.append("action", "phoneVerification");
        data.append("user_id", JSON.stringify(user).id);
        data.append("phone_no", `+${this.state.country.callingCode}${this.state.phone_no}`);
        data.append("verify_action", "Add");
       
        let response = await phoneVerification("POST", data);
        console.log(response);
        this.setState({ isLoading: false })
        if(response.status) {
          this.props.navigation.navigate('Verificationcode', { code: response.data.code, 
          country: this.state.country,
          phone_no: this.state.phone_no })
        } else {
          this.setState({ requestFalse: true })
        }
  }

  navigateToLogin = () =>{
    this.props.navigation.navigate('Login');
  }

  _onChangeText = (val) => {
    this.setState({ phone_no: val })
  }

  

  _changeCountry = (country) => {
    console.log(country)
    this.setState({ country });
  }

  _renderFooter = () => {

    if (this.state.requestFalse)
      return (
        <View style={{ alignItems: 'center', marginVertical: 25}}>
          <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
            Entered the wrong number or need a new code?
          </Text>
          <Button style={{ width: 250, marginHorizontal: 15, alignItems: 'center'}} mode="outlined" uppercase={false} onPress={()=> this._handlePhoneVerification()}>Request New Code</Button>
        </View>
      );

    return (
      <View>
        <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
      </View>
    );

  }

  _renderCountryPicker = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        withFilter
        onSelect={(country)=> this._changeCountry(country)}
        countryCode={this.state.country.cca2}
        style={styles.countryPicker}
        translation='eng'/>
    );

  }

  _renderCallingCode = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );

  }

  render() {

    let headerText = `What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`
    let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
    let textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Courier'
    } : {};

    return (

      <View style={styles.container}>
        <View >
        <TouchableOpacity onPress={this.navigateToLogin}>
              <Image source={require('./../../assets/images/icons/close.png')} style={styles.closebtn}/>
          </TouchableOpacity>
         
        </View>
        <Text style={styles.header}>{headerText}</Text>

        <Form ref={'form'} style={styles.form}>

          <View style={{ flexDirection: 'row' }}>

            {this._renderCountryPicker()}
            {this._renderCallingCode()}

            <TextInput
              ref={'textInput'}
              type={'TextInput'}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={this._onChangeText}
              placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              style={[ styles.textInput, textStyle ]}
              returnKeyType='go'
              autoFocus
              placeholderTextColor={brandColor}
              selectionColor={brandColor}
              maxLength={this.state.enterCode ? 6 : 20}
              />

          </View>

          <TouchableOpacity style={styles.button} onPress={this._handlePhoneVerification}>
            <Text style={styles.buttonText}>{ buttonText }</Text>
           
          </TouchableOpacity>

          {this._renderFooter()}

        </Form>

        <Spinner
          visible={this.state.spinner}
          textContent={'One moment...'}
          textStyle={{ color: '#fff' }} />

      </View>

    );
  }
  
}
const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1
  },
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: '#1778F2',
  },
  form: {
    margin: 20
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: brandColor
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  },
  closebtn:{
    width: 30, 
    height: 30,
    marginTop:50,
    marginLeft:20
  },
});

export default Phonenumber