import { StyleSheet } from 'react-native';

export const getShadow = ({ width = 0, height = 0, color = "#aaaaaa", opacity = 0.3, radius = 5 } = {}) => {
  return {
    shadowColor: color,
    shadowOffset: {
      width,
      height,
    },
    shadowOpacity: opacity,
    shadowRadius: radius,

    elevation: 3,
  }
}

const styles = StyleSheet.create({
  btnWrapper: {
    height: props.size || 30,
    width: props.size || 30,
    borderRadius: props.size || 30,
    backgroundColor: props.color || Colors.cartButtonColor,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    ...getShadow()
  }

});


export default styles;