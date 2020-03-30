import React, { Component } from 'react';
import { View, Text, Image, Keyboard } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { Appbar } from 'react-native-paper';
import styles from './styles';
import theme from './../../theme';

class InviteFriends extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Image source={require('../../../src/assets/images/icons/invite.png')} style={[theme.icon, { tintColor: tintColor }]} />
    )
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }
  render() {
    return (
      <View>
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={this._openMenu} />
          <Appbar.Content titleStyle={styles.headerTitle} title="Invite Friends" /></Appbar.Header>
        <Text> index </Text>
      </View>
    );
  }
}
export default InviteFriends;