import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    backgroundContainer: {
        position: 'relative',
        backgroundColor: '#1da1f2',
        height: 200,
    },
    container: {
        overflow: 'visible',
        backgroundColor: 'white',
        flex: 1
    },
    imgsize: {
        height: 60,
        width: 60,
        alignSelf: 'center',
        marginTop: 30,
    },
    card: {
        position: 'relative',
        margin: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'gray',
        shadowOpacity: 1,
        elevation: 3,
        backgroundColor: "#FFF",
        top: -100
    },
    savebtn: {
        flexDirection: 'row',
        height: 40,
        width: 120,
        alignSelf: 'flex-start',
        marginVertical: 10,
        marginHorizontal: 60
    },
    card2: {
        position: 'relative',
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'gray',
        shadowOpacity: 1,
        elevation: 3,
        backgroundColor: "#FFF",
        top: -100,
        margin: 10,
        width: 'auto'
    },
    textStyle: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
    },
    pushSwitch: {
        marginVertical: 10,
        width: 5
    },

    pickerStyle: {
        height: 150,
        width: "100%",
        color: '#344953',
        justifyContent: 'center',
    },
    DeactiveView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    backview: {
        height: 200,
        backgroundColor: 'blue'
    },
    btnSubmit: { borderRadius: 20 },
    btnCancel: { marginHorizontal: 10, borderRadius: 20 },

    pushLabels: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }
});
export default styles;