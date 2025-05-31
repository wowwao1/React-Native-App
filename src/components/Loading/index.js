import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';

export default Loading = () => {
    return (
        <View>
            <Image
                style={styles.img}
                source={require('../../assets/images/NoRecordWOWWAO1.jpg')} />

        </View>
    )
}
