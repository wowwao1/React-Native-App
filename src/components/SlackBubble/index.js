import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  Clipboard,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';

import { MessageText, MessageImage, Time, utils } from 'react-native-gifted-chat';

const { isSameUser, isSameDay } = utils;
import styles from './styles';
export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage);
    } else {
      if (this.props.currentMessage.text) {
        const options = [
          'Copy Text',
          'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions({
          options,
          cancelButtonIndex,
        },
          (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                Clipboard.setString(this.props.currentMessage.text);
                break;
            }
          });
      }
    }
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, messageTextStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [styles.standardFont, styles.slackMessageText, messageTextProps.textStyle, messageTextStyle],
          }}
        />
      );
    }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps} imageStyle={[styles.slackImage, messageImageProps.imageStyle]} />;
    }
    return null;
  }

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
        </View>
      );
    }
    return null;
  }

  renderUsername() {
    const username = this.props.currentMessage.user.name;
    if (username) {
      const { containerStyle, wrapperStyle, ...usernameProps } = this.props;
      if (this.props.renderUsername) {
        return this.props.renderUsername(usernameProps);
      }
      return (
        <Text style={[styles.standardFont, styles.headerItem, styles.username, this.props.usernameStyle]}>
          {username}
        </Text>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return (
        <Time
          {...timeProps}
          containerStyle={{ left: [styles.timeContainer] }}
          textStyle={{ left: [styles.standardFont, styles.headerItem, styles.time, timeProps.textStyle] }}
        />
      );
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  render() {
    const isSameThread = isSameUser(this.props.currentMessage, this.props.previousMessage)
      && isSameDay(this.props.currentMessage, this.props.previousMessage);

    const messageHeader = isSameThread ? null : (
      <View style={styles.headerView}>
        {this.renderUsername()}
        {this.renderTime()}
        {this.renderTicks()}
      </View>
    );

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          onLongPress={this.onLongPress}
          accessibilityTraits="text"
          {...this.props.touchableProps}
        >
          <View
            style={[
              styles.wrapper,
              this.props.wrapperStyle,
            ]}
          >
            <View>
              {this.renderCustomView()}
              {messageHeader}
              {this.renderMessageImage()}
              {this.renderMessageText()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTime: null,
  currentMessage: {
    text: null,
    createdAt: null,
    image: null,
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  tickStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
};

Bubble.propTypes = {
  touchableProps: PropTypes.object,
  onLongPress: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderCustomView: PropTypes.func,
  renderUsername: PropTypes.func,
  renderTime: PropTypes.func,
  renderTicks: PropTypes.func,
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  wrapperStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  messageTextStyle: Text.propTypes.style,
  usernameStyle: Text.propTypes.style,
  tickStyle: Text.propTypes.style,
  containerToNextStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
};