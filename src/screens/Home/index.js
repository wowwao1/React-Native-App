import "react-native-gesture-handler";
import React, { Component } from "react";
import { getData } from "./../../utils/helper";
import { sendRequest } from "./../../api";
import {
  View,
  Keyboard,
  FlatList,
  Modal,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Appbar, withTheme } from "react-native-paper";
import { DrawerActions } from "react-navigation";
import styles from "./styles";
import Comments from "./../Comments";
import Icon from "react-native-vector-icons/Ionicons";
import OneSignal from "react-native-onesignal";
import Loading from "./../../components/Loading";
import CardComponent from "./../../components/CardComponent";
import { ActionSheet } from "native-base";
import { onIds } from "./../../utils/helper";
import NewAudioPlayer from "./../../components/NewAudioPlayer";

var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 2;

class Home extends Component {
  pinZoomLayoutRef = React.createRef();
  static navigationOptions = {
    drawerIcon: () => <Icon name="ios-home" size={24} />,
  };
  _openMenu = () => {
    Keyboard.dismiss();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  };
  serachView = () => {
    this.props.navigation.navigate("Search");
  };

  navigateToUserprofile = async (user) => {
    let authUser = await getData("user");
    if (JSON.parse(authUser).id == user.id) {
      this.props.navigation.navigate("MyProfileTab", { user });
    } else {
      this.props.navigation.navigate("UserProfile", { user });
    }
  };
  navigateComment = (post) => {
    this.setState({ postSelected: post, showComments: true });
  };
  onRefresh = async () => {
    let user = await getData("user");
    user = JSON.parse(user);
    this.setState({ isFetching: true, page: 1, posts: [] }, function() {
      this.getNearByPost(user.id), this.setUserAvailibilty(user.id);
    });
  };
  blockAlert = (user) => {
    Alert.alert("Block User", "You really want block this user?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Block", onPress: () => this.blockUser(user) },
    ]);
  };

  constructor(props) {
    super(props);
    let requiresConsent = false;
    this.state = {
      user: {},
      action: "",
      timezone: "",
      page: 1,
      first_name: "",
      FCM_TOKEN: "",
      id: "",
      posts: [],
      isFetching: false,
      items: [],
      public: "",
      private: "",
      refreshing: false,
      spinner: false,
      showComments: false,
      postSelected: {},
      userPicked: {},
      postActions: [],
      BadgeCount: "0",
      initialOpenFromPush: "Did NOT open from push",
      inAppIsPaused: true,
      requirePrivacyConsent: requiresConsent,
      progress: 0,
      indeterminate: true,
      loadingMore: false,
      noMorePosts: false,
      location: {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      },
    };
    OneSignal.init("ee5169a7-d089-4de3-98c4-4c6bc8378925", {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", onIds);
    OneSignal.getPermissionSubscriptionState((status) => {
      console.log("STATUS", status);
    });
  }
  animate() {
    let progress = 0;
    this.setState({ progress });
    setTimeout(() => {
      this.setState({ indeterminate: false });
      setInterval(() => {
        progress += Math.random() / 5;
        if (progress > 1) {
          progress = 1;
        }
        this.setState({ progress });
      }, 500);
    }, 1500);
  }
  _handleLoadMore = async () => {
    console.log("ON end List");
    let user = await getData("user");
    user = JSON.parse(user);
    if (!this.state.noMorePosts && !this.state.loadingMore) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          this.getNearByPost(user.id);
        }
      );
    }
  };

  getNearByPost = (userid) => {
    console.log("getNearByPost method is called..", userid);

    console.log("PAGE NUMBER", this.state.page);
    this.setState({ loading: true, loadingMore: true });
    let data = new FormData();
    data.append("action", "userNearByPost");
    data.append("user_id", userid);
    data.append("timezone", "Asia/Kolkata");
    data.append("page", this.state.page);
    console.log("POST PARAM");
    console.log(data);
    // console.log("LocationUpdated **************")
    //  this.updateUserLocation(userid);
    //nearByPost("POST", data).then(data => {
    sendRequest("POST", data).then((data) => {
      console.log("POST RESTPONSE");

      console.log(data);
      if (data.status) {
        console.log("POSTs");
        console.log(data.data);
        let userFriends = [...this.state.posts, ...data.data];
        this.setState({
          posts: userFriends,
          isFetching: false,
          loading: false,
          loadingMore: false,
          noMorePosts: false,
        });
      } else {
        this.setState({ loadingMore: false, noMorePosts: true });
      }
    });
  };
  sendPostLikeNotification = async (post) => {
    let authUser = await getData("user");
    let data = new FormData();
    data.append("action", "sendNotification");
    data.append("user_id", JSON.parse(authUser).id);
    data.append("friend_id", post.userData.id);
    data.append("friend_token", post.userData.FCM_TOKEN);
    data.append("user_name", JSON.parse(authUser).first_name);
    data.append("notification_action", "post_like");
    data.append("post_id", post.id);
    console.log(data);
    //	sendNotification("POST", data).then(data => {
    sendRequest("POST", data).then((data) => {
      this.setState({ isLoading: false, isFetching: false });
      console.log("LikeNotification", data);
    });
  };

  // componentWillUnmount() {
  // 	// Linking.removeEventListener('url', this.handleOpenURL);
  // 	OneSignal.removeEventListener('received', this.onReceived);
  // 	OneSignal.removeEventListener('opened', this.onOpened);
  // 	OneSignal.removeEventListener('ids', onIds);

  // }
  onReceived(notification) {
    console.log("Notification received: ", notification.payload);
  }
  decrementBadgeCount() {
    let { BadgeCount } = this.state;
    BadgeCount--;
    this.setState({ BadgeCount });
  }
  onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  }

  getuserLikePost = (userid, post) => {
    let data = new FormData();
    data.append("action", "userLikePost");
    data.append("user_id", userid);
    data.append("post_id", post.id);
    console.log("POST LIKED", post.is_liked);
    if (post.is_liked == "n") {
      data.append("like_action", "Like");
      this.sendPostLikeNotification(post);
    } else {
      data.append("like_action", "Unlike");
    }
    console.log(data);
    //userLikePost("POST", data).then(data => {
    sendRequest("POST", data).then((data) => {
      console.log("Posts", data);
    });
  };
  reportPost = async () => {
    let authUser = await getData("user");
    let data = new FormData();
    data.append("action", "userReportPost");
    data.append("user_id", JSON.parse(authUser).id);
    data.append("post_id", this.state.postSelected.id);
    data.append("post_user_id", JSON.parse(authUser).id);
    console.log(data);
    //let response = await userReportPost("POST", data);
    let response = await sendRequest("POST", data);

    console.log("Posts", data);
    if (response.status == true) {
      Alert.alert("Post Reported Successfully!");
    } else {
      Alert.alert("Post Already Reported By You!");
    }
  };
  blockUser = async () => {
    let authUser = await getData("user");
    let data = new FormData();
    data.append("action", "userBlock");
    data.append("sender_id", JSON.parse(authUser).id);
    data.append("receiver_id", this.state.postSelected.userData.id);
    data.append("block_action", "Block");
    console.log(data);
    //userBlock("POST", data).then(data => {
    sendRequest("POST", data).then((data) => {
      if (data.status) {
        this.setState({ posts: data.data, isFetching: false });
        this.getNearByPost(JSON.parse(authUser).id);
      }
    });
  };
  createFormData = (photo, body) => {
    const data = new FormData();
    if (photo) {
      data.append("post_image[0]", {
        name: "test",
        type: "image/png",
        uri:
          Platform.OS === "android"
            ? photo.uri
            : photo.uri.replace("file://", ""),
      });
    }
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
  };

  setUserAvailibilty = (userid) => {
    let data = new FormData();
    data.append("action", "setAvailability");
    data.append("user_id", userid);
    data.append("isOnline", "1");
    console.log("UserAvailable", data);
    //setAvailability("POST", data).then(data => {
    sendRequest("POST", data).then((data) => {
      if (data.status) {
        this.setState({ activateStatus: data.data, isFetching: false });
      }
    });
  };

  async componentDidMount() {
    let user = await getData("user");
    user = JSON.parse(user);
    console.log("USER is");
    console.log("USER", user);

    this.setState({ user });

    this.getNearByPost(user.id);
    if (Platform.OS === "android") {
      Linking.getInitialURL().then((url) => {
        // this.navigate(url);
      });
    } else {
      //  Linking.addEventListener('url', this.handleOpenURL);
    }

    var providedConsent = await OneSignal.userProvidedPrivacyConsent();
    this.setState({
      privacyButtonTitle: `Privacy Consent: ${
        providedConsent ? "Granted" : "Not Granted"
      }`,
      privacyGranted: providedConsent,
    });
    OneSignal.setLocationShared(true);
    OneSignal.inFocusDisplaying(2);
    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onIds = onIds.bind(this);
    this.onLikePost = this.onLikePost.bind(this);
    // this.onInAppMessageClicked = this.onInAppMessageClicked.bind(this);

    this.props.navigation.addListener("willFocus", () => {
      console.log("Tyring to call med");
      this.setState(
        {
          posts: [],
          page: 1,
          loadingMore: false,
          noMorePosts: false,
        },
        () => {
          this.getNearByPost(user.id);
        }
      );
    });
  }

  onLikePost = async (item) => {
    console.log(item);
    let user = await getData("user");
    user = JSON.parse(user);
    this.getuserLikePost(user.id, item);
    this.setState((prevState) => ({
      posts: prevState.posts.map((post) => {
        if (post.id === item.id) {
          return {
            ...post,
            is_liked: post.is_liked == "y" ? "n" : "y",
            total_like:
              post.is_liked == "n"
                ? parseInt(post.total_like) + 1
                : parseInt(post.total_like) - 1,
          };
        }
        return post;
      }),
    }));
  };
  getUserCommentList = (userid, post) => {
    let data = new FormData();
    data.append("action", "userCommentList");
    data.append("user_id", userid);
    data.append("post_id", post.id);
    data.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    data.append("page", "1");
    console.log(data);
    //userCommentList("POST", data).then(data => {
    sendRequest("POST", data).then((data) => {
      console.log(data);
      this.setState({ usercomments: data.data });
    });
  };
  deleteMyPost = async (post) => {
    let user = await getData("user");
    user = JSON.parse(user);
    let data = new FormData();
    data.append("action", "deletePost");
    data.append("user_id", user.id);
    data.append("post_id", this.state.postSelected.id);
    console.log(data);
    //deletePost("POST", data).then(data => {
    sendRequest("POST", data).then((data) => {
      let newPosts = this.state.posts.filter((post) => {
        return post.id != this.state.postSelected.id;
      });
      this.setState({ posts: newPosts, isFetching: false });
    });
  };
  _renderFooter = () => {
    if (!this.state.loadingMore) return null;
    return (
      <View
        style={{
          position: "relative",
          width: "auto",
          height: "auto",
          paddingVertical: 20,
          marginTop: 10,
          marginBottom: 10,
          borderColor: "#000",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  render() {
    const { posts } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={this._openMenu} />
          <Appbar.Content titleStyle={styles.headerTitle} title="Home" />
          <Appbar.Action icon="search" onPress={this.serachView} />
        </Appbar.Header>
        <View style={{ flex: 1 }}>
          {this.state.posts.length === 0 && <Loading />}

          <View style={{ flex: 1 }}>
            {/* <View style={styles.userVoicePost}>
              <NewAudioPlayer />
            </View> */}
            <FlatList
              style={styles.userPost}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}
              extraData={this.state.posts}
              data={posts}
              keyExtractor={(item, index) => index}
              renderItem={this.renderItem}
              ItemSeparatorComponent={this.renderSeparator}
              ListFooterComponent={() => this._renderFooter()}
              onEndReached={() => this._handleLoadMore()}
              onEndReachedThreshold={0.5}
            />
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showComments}
          onRequestClose={() => {
            console.log("Modal has been closed.");
          }}
        >
          <Comments
            post={this.state.postSelected}
            onModalClose={(noComments, post) =>
              this.updateComments(noComments, post)
            }
          />
        </Modal>
      </View>
    );
  }

  updateComments = (noComments, commentedPost) => {
    console.log("Number of comments " + noComments);
    this.setState({ showComments: false });
    this.setState((prevState) => ({
      posts: prevState.posts.map((post) => {
        if (post.id === commentedPost.id) {
          return {
            ...post,
            total_comment: noComments,
          };
        }
        return post;
      }),
    }));
  };

  chooseOption = (index) => {
    if (index == "Edit") {
      if (
        parseInt(this.state.user.id) ==
        parseInt(this.state.postSelected.userData.id)
      ) {
        this.onEditPost();
      } else {
        this.reportPost();
      }
    } else if (index == "Delete") {
      if (
        parseInt(this.state.user.id) ==
        parseInt(this.state.postSelected.userData.id)
      ) {
        this.deleteMyPost();
      } else {
        this.blockAlert();
      }
    }
  };

  onEditPost = () => {
    console.log(this.state.postSelected);
    this.props.navigation.navigate("NewPost", {
      EditPost: { ...this.state.postSelected, editMode: true },
    });
  };

  showActionSheet = (item) => {
    let actions =
      parseInt(this.state.user.id) == parseInt(item.userData.id)
        ? ["Edit", "Delete", "Cancel"]
        : ["Report", "Block", "Cancel"];

    this.setState({ postSelected: item }, () => {
      ActionSheet.show(
        {
          options: actions,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          title: "Choose Action",
        },
        (buttonIndex) => {
          this.chooseOption(actions[buttonIndex]);
        }
      );
    });
  };

  renderItem = ({ item }) => {
    return (
      <CardComponent
        item={item}
        nearBy={true}
        onLikePost={() => this.onLikePost(item)}
        navigateComment={() => this.navigateComment(item)}
        showActionSheet={() => this.showActionSheet(item)}
      />
    );
  };
}
export default withTheme(Home);
