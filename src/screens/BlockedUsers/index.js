import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, Keyboard, Alert } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { Appbar, Button } from 'react-native-paper';
import theme from './../../theme';
import styles from './styles';
import { sendRequest } from './../../api';
import { getData } from './../../utils/helper';
import Loader from './../../Loader';

class BlockedUsers extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => ( // ../../../assets/
      <Image source={require('../../../src/assets/images/icons/block.png')} style={[theme.icon, { tintColor: tintColor }]} />
    )
  }
  onRefresh = async () => {
    let user = await getData("user");
    user = JSON.parse(user);
    this.setState({ isFetching: true }, function () { this.getBlockUserList(user.id) });
  }
  unBlockAlert = (user) => {
    Alert.alert(
      'Unblock User',
      'You really want unblock this user?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Unblock', onPress: () => this.unBlockUser(user) },
      ]
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      page: '',
      isFetching: false,
      receiver_id: '',
      sender_id: '',
      userblock: '',
    };
  }
  getBlockUserList = (userid) => {
    let data = new FormData();
    data.append("action", "userBlockList");
    data.append("user_id", userid);
    data.append("page", "1");
    // userBlockList("POST", data).then(data => {
    sendRequest("POST", data).then(data => {
    this.setState({ isLoading: false })
    this.setState({ userblock: data.data, isFetching: false })
    })
  }
  unBlockUser = async (user) => {
    let authUser = await getData('user');
    let data = new FormData();
    data.append("action", "userBlock");
    data.append("receiver_id", user.id);
    data.append("sender_id", JSON.parse(authUser).id);
    data.append("block_action", "Unblock")
    data.append("page", "1");
    console.log(data);
    //let response = await userBlock("POST", data);
    let response = await sendRequest("POST", data);
    if (response.status) {
      this.props.navigation.goBack();
    }
  }
  componentWillMount = async () => {
    let user = await getData("user");
    user = JSON.parse(user);
    this.getBlockUserList(user.id);
  }
  renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <TouchableOpacity>
          <Image source={{ uri: item.profile_img }} style={styles.pic} />
        </TouchableOpacity>
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTxt}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.first_name}
            </Text>
            <View style={styles.unblockbtn}>
              <Button uppercase={false}
                onPress={() => this.unBlockAlert(item)}
                mode='outlined'>
                Unblock
                  </Button>
            </View>
          </View>
        </View>
      </View>

    );
  }
  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }

  render() {
    const { userblock } = this.state;
    return (
      <View style={{ flex: 1 }} >
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={this._openMenu} />
          <Appbar.Content titleStyle={styles.headerTitle} title="Blocked Users" /></Appbar.Header>
        <Loader loading={this.state.isLoading}></Loader>
        {this.state.userblock.length === 0 &&
          (<Image
            style={styles.norecordImage}
            source={require('./../../assets/images/NoRecordWOWWAO1.jpg')} />)
        }
        <FlatList
          style={styles.userPost}
          data={userblock}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          keyExtractor={(item) => {
            return item.id;

          }}
          renderItem={this.renderItem}
        />
      </View>

    );
  }
}
export default BlockedUsers;