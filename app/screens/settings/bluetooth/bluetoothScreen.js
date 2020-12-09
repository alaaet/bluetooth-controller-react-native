import React, {useState, useEffect }   from 'react'
import { FlatList, View,PermissionsAndroid, Platform } from 'react-native'
import { BleManager } from "react-native-ble-plx";
import Toggle from "../../../components/toggle";
import Device from "../../../components/device";
import {useIsFocused } from "@react-navigation/native";
import {globalStyles} from '../../../styles/global';
import {useTheme} from '../../../components/theme/ThemeProvider';
import Layout from "../../../components/bluetooth-list-layout";
import Empty from "../../../components/empty";
import Subtitle from "../../../components/subtitle";
import AsyncStorage from '@react-native-community/async-storage'
import Toast from 'react-native-toast-message';
import {sendToPeripheral,hexToBase64,decimalToHex} from "../../../utils/bleManager";
import{START,END,TYPE,COMMAND,LENGTH1,LENGTH2,CHECKSUM,SET_TIME,DEVICE_STORAGE_KEY} from '../../../shared/constants'
export async function requestLocationPermission() {
    try {
      let result = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION])
      let granted = true;
      console.log("RESULT OF PERMISSION: ", result);
      Object.entries(result).forEach(([key, value]) => {
        if(value!== PermissionsAndroid.RESULTS.GRANTED)
        {
          granted = false;
        }
      });
      if (granted) {
        console.log('Location permission for bluetooth scanning granted');        
        return true;
      } else {
        console.log('Location permission for bluetooth scanning revoked');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

 
const BluetoothScreen = ()=>{
    const manager = new BleManager();
    const [info, setInfo] = useState([]);
    const [bleStatus, setBleStatus] = useState({emitter:"",value:false});
    const [bleDevicePrevState, setBleDevicePrevState] = useState("");
    const {colors} = useTheme();
    const [list, setList] = useState([]);
    const [deviceId,setDeviceID] = useState([]);
 
    const isFocused = useIsFocused();

    // Save Devices
    const saveDeviceIdToStorage = async () => {
      try {
        if(deviceId.length>0)
        await AsyncStorage.setItem(DEVICE_STORAGE_KEY,JSON.stringify(deviceId));
        console.log("Device ID were saved to storage memory!",deviceId);
      } catch (e) {
        console.log(e.message)
      }
    }
    //Read Devices
    const readDeviceIdFromStorage = async () => {
      try {
        const DeviceIdFromStorage =JSON.parse( await AsyncStorage.getItem(DEVICE_STORAGE_KEY))  
        if (DeviceIdFromStorage!== null) {
          setDeviceID(DeviceIdFromStorage);
         console.log(" Device Id were read from storage memory!",DeviceIdFromStorage);
        }
      } catch (e) {
       console.log(e.message)
      }
    }
    
    const handleConnect=async(deviceId,Name)=>{
      if (Name.toLowerCase().includes("octo") ) {
        await AsyncStorage.setItem(DEVICE_STORAGE_KEY,JSON.stringify(deviceId));                 
        await manager.connectToDevice(deviceId)
        .then(async(device) => {
            //setInfo("Discovering services and characteristics");
              let date=new Date(Date.now());
              let year=decimalToHex(date.getFullYear()%2000);
              let month=decimalToHex((date.getMonth())+1);
              let Dow=decimalToHex(date.getDay())
              let day=decimalToHex(date.getDate());
              let hour=decimalToHex(date.getHours());
              let minute=decimalToHex(date.getMinutes());
              let seconds=decimalToHex(date.getSeconds());
              var base64String =hexToBase64(START+TYPE+COMMAND+LENGTH1+LENGTH2+CHECKSUM+SET_TIME+seconds+minute+hour+Dow+day+month+year+END);
              await sendToPeripheral(deviceId,base64String);
        
          
            Toast.show({
              text1: 'Controller',
              text2: "The controller is connected, and the Time has been reset.   👋"
              });
            return device.discoverAllServicesAndCharacteristics()
        }).catch(async(e)=>{
          // TRY AGAIN
          await manager.connectToDevice(deviceId)
        .then(async(device) => {
          let date=new Date(Date.now());
          let year=decimalToHex(date.getFullYear()%2000);
          let month=decimalToHex((date.getMonth())+1);
          let Dow=decimalToHex(date.getDay())
          let day=decimalToHex(date.getDate());
          let hour=decimalToHex(date.getHours());
          let minute=decimalToHex(date.getMinutes());
          let seconds=decimalToHex(date.getSeconds());
          var base64String =hexToBase64(START+TYPE+COMMAND+LENGTH1+LENGTH2+CHECKSUM+SET_TIME+seconds+minute+hour+Dow+day+month+year+END);
          await sendToPeripheral(deviceId,base64String);

            Toast.show({
              text1: 'Controller',
              text2: "The controller is connected, and the Time has been reset.   👋"
              });
            return device.discoverAllServicesAndCharacteristics()
        }).catch((e)=>{
          console.error("CONNECTION ERROR:",e)
          Toast.show({
            text1: 'Controller',
            text2: e+" 👋"
            });
        });
        });
      }
    }
    const renderEmpty = () => <Empty text="This page is clean" />;
    
    const renderItem = (item) => {
      return (
        <Device 
          {...item}
          iconLeft={require("../../../icons/bt-device.png")}
         // iconRight={require("../../../icons/connect.png")}
          onPress={() => {
            handleConnect(item.id,item.name)
            console.log(item);

          //  navigation.navigate("DeviceView", { title: item.name, body:item.id });
          }}
        />
      );
    };
    useEffect( ()=>{
      saveDeviceIdToStorage();
    },[deviceId]);
    useEffect( ()=>{
      readDeviceIdFromStorage();
    },[isFocused]);
    useEffect(()=>{
        switch (bleStatus.emitter) {
            case 'user':
                if (bleStatus.value) 
                {
                    manager.enable();
                    setTimeout(() => {   scanAndConnect(); }, 1000);
                }
                else
                {
                    manager.stopDeviceScan();
                    setList([]);
                    manager.disable();
                    //setTimeout(() => {manager.disable(); }, 3000);     
               }
                console.log("BLE STATUS CHANGE BY USER : ", bleStatus.value);
                break;           
            case 'device':
                if(bleStatus.value)
                {
                    setTimeout(() => {   scanAndConnect(); }, 1000);
                }
                else 
                {
                    manager.stopDeviceScan();
                    setList([]);
                }
                break;
            default:                
                break;
            }
      },[bleStatus]);

      
      useEffect(()=>{
        const init = async()=>{await requestLocationPermission();}
        if(Platform.OS=='android') {
          init();}
        setBleStatus({emitter:"user",value:true});
   
      },[]);
      useEffect(()=>{
        let subscription =manager.onStateChange((state) => {            
            if(state != bleDevicePrevState){
            console.log("BLE STATUS CHANGE BY DEVICE: "+state)
            setBleDevicePrevState(state);
            switch (state) {
            case 'Resetting':
                subscription.remove();
                break;   
            case 'PoweredOff':
                setBleStatus({emitter:"device",value:false});
                subscription.remove();
                break;            
            case 'PoweredOn':            
                setBleStatus({emitter:"device",value:true});
                subscription.remove();
                break;
            default:                
                break;
            }}
        }); 
        return(()=>{subscription.remove();});      
      },[ bleDevicePrevState]);

      
  const scanAndConnect=async()=> {
     console.log("SCANNING...")
   
    if(Platform.OS=='android'){
      const permission = await requestLocationPermission();
      if (permission) 
      { 
       await manager.startDeviceScan (null, null, async(error, device) => 
        {
          console.log("DEVICE:",device)
          if(error) console.log("ERROR:",error)
            if(device && device.name)
            {                
              const existingDevice = list.find(d => d.id == device.id);
              if(existingDevice==null && device.name.toLowerCase().includes("octo")) setList([...list,{name:device.name,id:device.id}]);
              //console.log(error) 
              if (device.name.toLowerCase().includes("octo")) 
              {               
                manager.stopDeviceScan();
              }        
            }
        });
      }     
    }
    else{
      await manager.startDeviceScan (null, null, async(error, device) => 
      {
        console.log("DEVICE:",device)
        if(error) console.log("ERROR:",error)
          if(device && device.name)
          {                
            const existingDevice = list.find(d => d.id == device.id);
            if(existingDevice==null && device.name.toLowerCase().includes("octo")) setList([...list,{name:device.name,id:device.id}]);
            //console.log(error) 
            if (device.name.toLowerCase().includes("octo") ) 
            {              
              manager.stopDeviceScan();
            }        
          }
      });
    }

  }
    return (
        <View style={{...globalStyles.container, backgroundColor:colors.background}} >
    <Layout title="Bluetooth">
      <Toggle value={bleStatus.value} onValueChange={(val)=>{
          setBleStatus({emitter:"user",value:val}); 
          console.log("TOGGLE SWITCHED BY USER: ", val);
          }} />
      <Subtitle title="Devices List" />
      <FlatList 
        data={list}
        ListEmptyComponent={() => renderEmpty()}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
      />
    </Layout>
    </View>
    )
}

export default BluetoothScreen;
