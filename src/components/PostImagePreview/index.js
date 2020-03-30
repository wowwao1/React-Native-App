import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
export default class PostImagePreview extends React.Component {

  render() {
    const { image, onClose } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image
            resizeMode="cover"
            style={styles.cover}
            source={image}
          />
          <TouchableOpacity style={styles.close} onPress={() => onClose()}>
            <Ionicons
              style={styles.closeIcon}
              name="ios-close-circle"
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

