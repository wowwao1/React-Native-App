import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
} from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from './styles';

class VideoPlayer extends Component {

  state = {
    rate: 1,
    volume: 1,
    muted: false,
    resizeMode: 'contain',
    duration: 0.0,
    currentTime: 0.0,
    paused: true,
  };

  onLoad = (data) => {
    this.setState({ duration: data.duration });
  }

  onProgress = (data) => {
    this.setState({ currentTime: data.currentTime });
  }

  onEnd = () => {
    this.setState({ paused: true });
    this.video.seek(0);
  }


  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    }
    return 0;
  };


  render() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
    const icon = (this.state.paused) ? 'play' : 'pause';

    const { uri } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.fullScreen}
          onPress={() => this.setState({ paused: !this.state.paused })}
        >
          {
            uri &&
            <Video
              //ref={(ref: Video) => { this.video = ref }}
              source={{ uri }}
              style={styles.fullScreen}
              paused={this.state.paused}
              resizeMode={'contain'}
              onLoad={this.onLoad}
              onProgress={this.onProgress}
              onEnd={this.onEnd}
              repeat={false}
            />
          }
        </TouchableOpacity>

        <View style={styles.controls}>
          <Icon name={icon} size={20} color={"#FFF"} />
          <View style={styles.progress}>
            <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
            <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
          </View>
        </View>
      </View>
    );
  }
}

export default VideoPlayer;
