import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import PropTypes from 'prop-types';
import Colors from './Colors';
import { getShadow } from './Styles';

const BtnRound = (props) => {
  return (
    <TouchableOpacity 
      style={[
        {
          height: props.size || 30,
          width: props.size || 30,
          borderRadius: props.size || 30,
          backgroundColor: props.color || Colors.cartButtonColor,
          alignItems: 'center',
          justifyContent: 'center',
          backfaceVisibility: 'hidden',
          ...getShadow()
        },
        props.style
      ]}
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      {
        props.customIcon ? (
          props.customIcon
        ) : (
          <Icon solid={props.solid} name={props.icon} size={props.iconSize || 18} color={props.iconColor || Colors.primary} />
        )
      }
    </TouchableOpacity>
  )
}

BtnRound.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  onPress: PropTypes.func,
  customIcon: PropTypes.node,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  solid: PropTypes.bool,
  style: PropTypes.instanceOf(PropTypes.any),
}

BtnRound.defaultProps = {
  size: 30,
  color: Colors.cartButtonColor,
  onPress: null,
  customIcon: null,
  iconSize: 18,
  iconColor: Colors.primary,
  solid: false,
  style: null
};

export default BtnRound
