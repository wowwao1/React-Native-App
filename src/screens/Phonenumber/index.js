import React, { Component } from 'react';
import {

  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Image
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
import { sendRequest } from './../../api';
import { getData, showToastMessage } from './../../utils/helper';
import styles from './styles';
import Loader from './../../Loader';

const brandColor = '#1778F2';

class Phonenumber extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phone_no: '',
      spinner: false,
      country: {
        cca2: 'US',
        callingCode: '1'
      },
      requestFalse: false,
      isLoading: false
    };

  }
  _handlePhoneVerification = async () => {
    if (this.state.phone_no.length != 10) {
      showToastMessage("Please enter valid phone number")

      return;
    }
    this.setState({ isLoading: true })
    let user = await getData("user");
    let data = new FormData();
    data.append("action", "phoneVerification");
    data.append("user_id", JSON.stringify(user).id);
    data.append("phone_no", `+${this.state.country.callingCode}${this.state.phone_no}`);
    data.append("verify_action", "Add");

    // let response = await phoneVerification("POST", data);
    let response = await sendRequest("POST", data);
    console.log(response);
    this.setState({ isLoading: false })
    if (response.status) {
      this.props.navigation.navigate('Verificationcode', {
        code: response.data.code,
        country: this.state.country,
        phone_no: this.state.phone_no
      })
    } else {
      this.setState({ requestFalse: true })
    }
  }

  navigateToLogin = () => {
    this.props.navigation.navigate('Login');
  }

  _onChangeText = (val) => {
    this.setState({ phone_no: val })
  }



  _changeCountry = (country) => {
    console.log(country)
    this.setState({ country });
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
        onSelect={(country) => this._changeCountry(country)}
        countryCode={this.state.country.cca2}
        style={styles.countryPicker}
        translation='eng' />
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
        <Loader loading={this.state.isLoading} />
        <View >
          <TouchableOpacity onPress={this.navigateToLogin}>
            <Image source={require('./../../assets/images/icons/close.png')} style={styles.closebtn} />
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
              style={[styles.textInput, textStyle]}
              returnKeyType='go'
              autoFocus
              placeholderTextColor={brandColor}
              selectionColor={brandColor}
              maxLength={this.state.enterCode ? 6 : 20}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={this._handlePhoneVerification}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Form>
        <Spinner
          visible={this.state.spinner}
          textContent={'One moment...'}
          textStyle={{ color: '#fff' }} />
      </View>
    );
  }
}
export default Phonenumber