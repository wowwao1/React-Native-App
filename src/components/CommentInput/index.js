import { TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';

export default class CommentInput extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    placeholder: '',
  };

  render() {
    const { placeholder, onChangeText, value, onComment } = this.props;
    console.log(this.props)
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={value}
          multiline={true}
          placeholder={placeholder}
          underlineColorAndroid="transparent"
          onChangeText={(val) => onChangeText(val)}
          onSubmitEditing={this.handleSubmitEditing}
        />
        <TouchableOpacity onPress={() => onComment()}>
          <Icon name="send" size={24} />
        </TouchableOpacity>

      </View>
    );
  }
}


