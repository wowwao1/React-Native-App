import { AsyncStorage } from 'react-native';
import { sendRequest } from './../api';
import { Toast } from 'native-base';
export const storeData = async (name, value) => {
    try {
        console.log(value);
        await AsyncStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
        // Error saving data
    }
};

export const getData = async (name) => {
    try {
        return await AsyncStorage.getItem(name);
    } catch (error) {
        // Error saving data
    }
};

export const convertUnicode = (input) => {
    return input.replace(/\\u(\w{4,4})/g, function (a, b) {
        var charcode = parseInt(b, 16);
        return String.fromCharCode(charcode);
    });
}


export const onIds = (device) => {
    console.log('Device information: ', device);
    console.log('player id: ', device.userId);
    if (device) updateToken(device);
}

const updateToken = async (device) => {
    console.log("Updating FCM");
    console.log(device);
    let authUser = await getData('user');
    let data = new FormData();
    data.append("action", "updateFCM");
    data.append("user_id", JSON.parse(authUser).id);
    data.append("token", device.userId);
    console.log(data);
    //updateFCM("POST", data);
    sendRequest("POST", data);
}

export const checkField = (field) => {
    if (field == "" || field == undefined || field == null) {
        return true;
    } else {
        return false;
    }
}
export const showToastMessage = (message) => {
    Toast.show({
        text: message,
    })
}
