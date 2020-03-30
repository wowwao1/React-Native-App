import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controls: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center'
    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
        marginLeft: 10
    },
    innerProgressCompleted: {
        height: 10,
        backgroundColor: '#f1a91b',
    },
    innerProgressRemaining: {
        height: 10,
        backgroundColor: '#2C2C2C',
    }
});

export default styles;