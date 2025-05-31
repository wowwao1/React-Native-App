import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20
    },
    imageWrapper: {
        margin: 5,
        width: 160,
        height: 200,
    },
    cover: {
        flex: 1,
        borderRadius: 5,
    },
    close: {
        margin: 5,
        position: 'absolute',
        top: 0,
        right: 0,
        width: 25,
        height: 25,
        color: 'white',
    },
    closeIcon: {
        color: 'white'
    }
});

export default styles;