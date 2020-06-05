import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
// import { Subheading, Avatar } from 'react-native-paper';
// import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";
// const Pulse = require('react-native-pulse').default;
const keyboardVerticalOffset = Platform.OS === "ios" ? 20 : 0;
export default class CardViewContainer extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    const { recordVoice, playRecording } = this.props;
    return (
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.contentContainer}>
          <View style={styles.custom_view}>
            {/*<Text>Press and hold to record</Text>
                        <Icon style={styles.icmicrophone} name='microphone' /> */}
            <TouchableOpacity onPress={recordVoice}>
              <MaterialCommunityIcons
                name="record-rec"
                size={50}
                color={"red"}
              />
              {/* <Animatable.View animation="pulse" easing="ease-in-out" iterationCount="infinite" style={{ textAlign: 'center' }}>
                            <Avatar.Icon style={styles.icmicrophone} size={64} icon="microphone" />
                            <Pulse color='#3e4f5f' numPulses={2} diameter={120} speed={20} duration={1000} />
                        </Animatable.View> */}
            </TouchableOpacity>
            {/*<Subheading style={styles.recordtime}>00:00:15</Subheading>*/}
          </View>
        </View>
        {/* { this.props.isRecordingDone && <TouchableOpacity onPress={playRecording}><Text style={styles.playrecord}>CLICK TO PLAYBACK RECORDING</Text></TouchableOpacity>} */}
      </KeyboardAvoidingView>
    );
  }
}
