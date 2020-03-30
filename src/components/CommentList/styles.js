
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    commentViewHeight: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        height: 'auto',
        width: 'auto'
    },
    commenttxt: {
        marginLeft: 50,
        fontSize: 12,
        fontWeight: 'normal',
        marginTop: -10,
        height: 'auto',
        width: '100%'
    },
    pic: {
        flexDirection: 'row',
        borderRadius: 30,
        width: 30,
        height: 30,
        marginLeft: 10
    },
    userName: {
        fontWeight: '200',
        paddingLeft: 5,
        fontSize: 12
    },
    commentTimeStyle: {
        fontSize: 8,
        marginHorizontal: 50,
        marginTop: 5

    },
    commentStyle: {
        flexDirection: 'row',
    },
    commentReplyStyle: {
        fontSize: 8,
        marginTop: 5,
        marginHorizontal: 10,
    },




    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    container: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 15
    },
    userDetails: {
        marginLeft: 15,
    },
    name: {
        fontSize: 15,
    },
    comment: {
        marginTop: 10,
        marginRight: 26,
        paddingRight: 16
    },
    commnet_date: {
        marginLeft: 10,
        fontSize: 10,
        color: 'gray'
    }
});




export default styles;