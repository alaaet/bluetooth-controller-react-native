import React, {useState, useEffect }   from 'react'
import { FlatList,Text, View,PermissionsAndroid } from 'react-native'
import { BleManager } from "react-native-ble-plx";
import Toggle from "../../../components/toggle";
import Device from "../../../components/device";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import {globalStyles} from '../../../styles/global';
import {useTheme} from '../../../components/theme/ThemeProvider';
import Layout from "../../../components/bluetooth-list-layout";
import Empty from "../../../components/empty";
import Subtitle from "../../../components/subtitle";
import AsyncStorage from '@react-native-community/async-storage'
import Toast from 'react-native-toast-message';
export async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
          title: 'Location permission for bluetooth scanning',
          message: 'wahtever',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ); 
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
    const manager = new BleManager()
    const [info, setInfo] = useState([]);
    const [values, setValue] = useState([]);
    const[bolstate,setBolstate]=useState();
    const [bleStatus, setBleStatus] = useState({emitter:"",value:false});
    const [bleDevicePrevState, setBleDevicePrevState] = useState("");
    const {colors} = useTheme();
    const navigation = useNavigation();
    const [list, setList] = useState([]);
    const [deviceId,setDeviceID] = useState([]);
    const DEVICE_STORAGE_KEY = "Device";
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
    const handleConnect=(deviceId)=>{
      manager.connectToDevice(deviceId)
      .then(async(device) => {
          setInfo("Discovering services and characteristics");
         
          Toast.show({
            text1: 'Controller',
            text2: "Controller is conected 👋"
            });
          return device.discoverAllServicesAndCharacteristics()
      }).catch((e)=>{
        Toast.show({
          text1: 'Controller',
          text2: e+" 👋"
          });
      });
    }
    const renderEmpty = () => <Empty text="This page is clean" />;
    
    const renderItem = (item) => {
      return (
        <Device 
          {...item}
          iconLeft={require("../../../icons/bt-device.png")}
         // iconRight={require("../../../icons/connect.png")}
          onPress={() => {
            handleConnect(item.id)
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
        requestLocationPermission(); 
        setBleStatus({emitter:"user",value:true});
        return () => {
            if (Platform.OS === 'ios') {
              manager.onStateChange((state) => {
                  if (state === 'PoweredOn') scanAndConnect()
                });
            } else {
            // scanAndConnect()
            }
        }    
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

      
   const scanAndConnect=()=> {
    const permission = requestLocationPermission();
    if (permission) { 
        manager.startDeviceScan (null, null, async(error, device) => {
          
            if(device && device.name){
                console.log("DEVICE:",{ device})
                const existingDevice = list.find(d => d.id == device.id);
                if(existingDevice==null) setList([...list,{name:device.name,id:device.id}]);
                //console.log(error) 
                if (device.name === "OCTO2" ) {
                  await AsyncStorage.setItem(DEVICE_STORAGE_KEY,JSON.stringify(device.id)); 
                
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
