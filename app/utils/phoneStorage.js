import AsyncStorage from '@react-native-community/async-storage'
import {DEVICE_STORAGE_KEY, ALARM_GROUPS_KEY} from "../../shared/constants";
import Toast from 'react-native-toast-message';

    const getDeviceIdFromStorage = async()=>{
      try{
        return JSON.parse( await AsyncStorage.getItem(DEVICE_STORAGE_KEY));
      }
      catch (e){
        Toast.show({
          text1: 'Error😯',
          text2: 'No controller found, please connect to the controller using Bluetooth!'
        });
      }
    }

  //ALARM_GROUPS
  const saveAlarmGroupsToStorage = async (alarmGroups) => {
    try {
      await AsyncStorage.setItem(ALARM_GROUPS_KEY,JSON.stringify(alarmGroups));
      console.log("Alarm Groups were saved to storage memory:",JSON.stringify(alarmGroups));
    } catch (e) {
      console.log(e.message)
    }
  }
  const readAlarmGroupsFromStorage = async () => {
    try {
      const alarmGroups =JSON.parse( await AsyncStorage.getItem(ALARM_GROUPS_KEY))  
      if (alarmGroups !== null) {
       //console.log(" Alarm Groups were read from storage memory!");
       return alarmGroups;
      }
      else
      return [];
    } catch (e) {
     console.log(e.message)
     return [];
    }
  }



  export {getDeviceIdFromStorage, readAlarmGroupsFromStorage, saveAlarmGroupsToStorage}