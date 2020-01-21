import {AsyncStorage} from 'react-native';
export const storeData = async (name,value) => {
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