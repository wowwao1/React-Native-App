import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15
    },
    btn: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        height: 30,
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 8
    },
    imageWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    profileWrapper: { flexDirection: 'row', paddingTop: 10 },
    profileImgWrapper: { flex: 1, alignItems: 'center' },
    profileImg: { width: 75, height: 75, borderRadius: 37.5 },
    profilePostMainWrapper: { flex: 3 },
    profilePostWrapper: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    post: { alignItems: 'center' },
    txtPost: { fontSize: 12, color: 'gray' },
    about: { paddingHorizontal: 10, paddingVertical: 10 },
    firstname: { fontWeight: 'bold' },
    editProfileBtnView: { flexDirection: 'row' },
    editBtn: { flex: 1, marginHorizontal: 10, justifyContent: 'center', height: 30, marginTop: 10 }
});


export default styles;