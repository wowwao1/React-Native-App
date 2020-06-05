import { StyleSheet, PixelRatio } from "react-native";

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : 0,
  },
  card: {
    position: "relative",
    margin: 10,
    marginRight: 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "gray",
    shadowOpacity: 1,
    elevation: 3,
    backgroundColor: "#FFF",
    justifyContent: "flex-start",
  },
  txtDescription: {
    padding: 3,
    flexDirection: "row",
    //flex: 1,
    //marginTop: 3,
    borderColor: "black",
    borderWidth: 1,
    paddingBottom: 10,
    height: 110,
    margin: 5,
  },

  profileCameraImage: {
    height: 40,
    top: 60,
    right: 2,
  },

  card: {
    padding: 20,
    margin: 5,
    backgroundColor: "#d9d9d9",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },

  appheaderStyle: {
    fontSize: 12,
    alignSelf: "flex-start",
  },
  titleHead: {
    flexDirection: "row",
  },

  postBtn: {
    fontSize: 12,
    fontWeight: "bold",
    width: 30,
    right: 0,
  },

  postSelect: {
    marginHorizontal: 10,
    fontSize: 16,
    marginVertical: 10,
  },
  privatePost: {
    margin: 10,
    height: 20,
    width: 20,
  },
  publicPost: {
    margin: 10,
  },
  recordBtn: {
    margin: 5,
  },

  Unfilledround: {
    margin: 10,
    height: 15,
    width: 15,
  },
  bottomView: {
    width: "100%",
    height: 40,
    backgroundColor: "#1778F2",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    borderColor: "#9B9B9B",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    aspectRatio: 1,
    resizeMode: "cover",
  },
  clearImage: {
    position: "absolute",
    left: 80,
    right: 0,
    top: -20,
    bottom: 0,
  },

  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  custom_view: {
    //flex: 1,
    justifyContent: "center",
    marginTop: 60,
    alignItems: "center",
  },
  playrecord: {
    color: "#696969",
    textDecorationLine: "underline",
    fontSize: 14,
    textAlign: "center",
    marginTop: 80,
  },
  stopImg: {
    alignSelf: "flex-end",
    height: 40,
    width: 40,
 
  },
});
export default styles;
