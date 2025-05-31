import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postImage: {
        minWidth: '100%',
        height: 'auto',
        aspectRatio: 1,
    },
    userDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    online: {
        width: 10,
        height: 10,
        marginLeft: 5
    },
    timeDate: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    date: {
        fontSize: 10,
        color: 'gray'
    },
    diff: {
        fontSize: 10,
        color: 'gray'
    },
    post_type: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    public_type: {
        paddingHorizontal: 5,
        marginRight: 10
    },
    private_type: {
        paddingHorizontal: 5
    },
    more: {
        color: 'black',
        marginRight: 5,
        fontSize: 24
    },
    heart: {
        color: 'red',
        marginRight: 5,
        fontSize: 24
    },
    likeCmnt: {
        fontSize: 16,
        marginLeft: 5
    },
    comment: { marginLeft: 5 },
    imageWrapper: { backgroundColor: 'lightgray', }
    , thumbnail: { backgroundColor: 'lightgray' }

});

export default styles;