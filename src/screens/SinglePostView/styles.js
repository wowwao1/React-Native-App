import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pic: {
    flexDirection: 'row',
    borderRadius: 30,
    width: 45,
    height: 45,
    marginLeft: 10,
    marginTop: 10
  },

  nameTxt1: {
    flexDirection: 'row',
    marginLeft: 80,
    fontWeight: '400',
    color: '#222',
    fontSize: 14,
    width: 'auto',
    marginTop: -40,
    flex: 1,
  },
  statusdiff: {
    alignSelf: 'center',
    position: 'absolute',
    fontSize: 10,
    marginTop: 15,
    marginLeft: 20
  },
  publicPost: {
    height: 18,
    width: 18,

  },

  dateTxt: {
    flexDirection: 'row',
    fontWeight: '100',
    color: 'black',
    fontSize: 9,
    marginLeft: 80,
    marginTop: 'auto',

  },
  postTextSize: {
    fontFamily: 'fontAwesome',
    width: 'auto',
    marginLeft: 10,
    paddingTop: 20,
    paddingBottom: 5,
    flex: 1,
  },

  postImage: {
    minWidth: '100%',
    aspectRatio: 1,
  },
  combine: {

    position: 'absolute',
    right: 0,
    top: 0
  },
  verticalImg: {
    right: 20,

  },
  privacyImage: {
    right: 40,
    top: 25
  },
  userPost: {
    textAlign: 'center'
  },
  iconRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  heartIcon: {
    width: 20,
    height: 20,
  },
  pulstab: {
    height: 70,
    width: 70,
    resizeMode: 'contain'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  norecordImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  postContainer: {
    flex: 1,
    paddingBottom: 20,
  }
  ,
  activityInd: {
    justifyContent: 'center',
    alignItems: 'center'
  }
  , contentContainer: {
    flex: 1,
    justifyContent: 'center'
  }
});
export default styles;