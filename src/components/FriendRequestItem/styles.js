import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    userWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    details: { marginLeft: 20 },
    userEmail: { fontSize: 12, color: 'gray' },
    actionWrapper: {
        flexDirection: 'row',
        marginLeft: 20,
        marginTop: 10,
        justifyContent: 'space-evenly',
        width: '100%'
    },
    button: {
        width: 100,
        justifyContent: 'center',
        //height: 30, 
        borderColor: 'blue',
        borderWidth: 1,
        backgroundColor: 'blue',
    },
    reject: {
        backgroundColor: 'white',
        borderColor: 'gray'
    },
    confirmText: { color: 'white' },
    wrapper: { width: '100%' }

})



export default styles;