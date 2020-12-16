import AsyncStorage from '@react-native-community/async-storage'
import {DEVICE_STORAGE_KEY, ALARM_GROUPS_KEY,MODES_STORAGE_KEY,BED_STORAGE_KEY,INITIALMODES} from "../../shared/constants";
import Toast from 'react-native-toast-message';

  const saveDeviceIdToStorage = async (deviceId) => {
    try {
      if(deviceId?.length>0)
      await AsyncStorage.setItem(DEVICE_STORAGE_KEY,JSON.stringify(deviceId));
      //console.log("Device ID was saved to storage memory!",deviceId);
    } catch (e) {
      console.log(e.message)
    }
  }
  const getDeviceIdFromStorage = async()=>{
    try{
      return JSON.parse( await AsyncStorage.getItem(DEVICE_STORAGE_KEY));
    }
    catch (e){      
      Toast.show({
        text1: 'Error😯',
        text2: 'No controller found, please connect to the controller using Bluetooth!'
      });
     return ""; 
    }
  }

  //ALARM_GROUPS
  const saveAlarmGroupsToStorage = async (alarmGroups) => {
    if(alarmGroups){
      try {
        await AsyncStorage.setItem(ALARM_GROUPS_KEY,JSON.stringify(alarmGroups));
        //console.log("Alarm Groups were saved to storage memory:",JSON.stringify(alarmGroups));
      } catch (e) {
        console.log(e.message)
      }
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

  const readModesFromStorage = async () => {
    try {
      const modesFromStorage =JSON.parse( await AsyncStorage.getItem(MODES_STORAGE_KEY))  
      if (modesFromStorage !== null) {
       return modesFromStorage;
       //console.log("Mode were read from storage memory!", modesFromStorage);
      }
      else{
        return INITIALMODES;
      }
    } catch (e) {
     console.log(e.message)
     return INITIALMODES;
    }
  }
  
  const saveModesToStorage = async (currentModes) => {
    try {
      if(currentModes?.length>0)       
      await AsyncStorage.setItem(MODES_STORAGE_KEY,JSON.stringify(currentModes));
      //console.log("Modes were saved to storage memory!");
    } catch (e) {
      console.log(e.message)
    }
  }
  const saveBedToStorage = async (currentbed) => {
    try {
      if(currentbed!==null)       
      await AsyncStorage.setItem(BED_STORAGE_KEY,JSON.stringify(currentbed));
      console.log("Bed was saved to storage memory!");
    } catch (e) {
      console.log(e.message)
    }
  }
  const readBedFromStorage = async () => {
    try {
      const bedFromStorage =JSON.parse( await AsyncStorage.getItem(BED_STORAGE_KEY))  
      if (bedFromStorage !== null) {
       return bedFromStorage;
       //console.log("Bed was read from storage memory!", modesFromStorage);
      }
      else{
        return {id:null,name:null,device:null};
      }
    } catch (e) {
     console.log(e.message)
     return {id:null,name:null,device:null};
    }
  }


  export {saveDeviceIdToStorage, getDeviceIdFromStorage, readAlarmGroupsFromStorage, saveAlarmGroupsToStorage,readModesFromStorage,saveModesToStorage,saveBedToStorage,readBedFromStorage}