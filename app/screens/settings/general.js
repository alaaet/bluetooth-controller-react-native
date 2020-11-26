import React, {useState, useEffect }   from 'react'
import {
  StyleSheet,
  View,
  Text,
  Switch ,
  Pressable
} from 'react-native';
import { globalStyles, globalColors } from '../../styles/global';
import {decode as atob, encode as btoa} from 'base-64';
import {useTheme} from '../../components/theme/ThemeProvider';
import Separator from "../../components/separator";
import { BleManager } from "react-native-ble-plx";
import AsyncStorage from '@react-native-community/async-storage'
import {useIsFocused } from "@react-navigation/native";

function  General () {
  const isFocused = useIsFocused();
  const manager = new BleManager();
  const DEVICE_STORAGE_KEY = "Device";
  const [deviceId,setDeviceID] = useState([]);
  const [info, setInfo] = useState([]);
  const {colors, isDark, setScheme} = useTheme();
  const text = isDark ? 'Dark mode 🌙' : 'Light mode 🌞';
  const [soundsList, setSoundsList] = useState({});
  const separatorColor = colors.separator;
  let Start='40';
  let End='40';
  let type='02';
  let command='72';
  let length1='00' ;
  let length2='08' ;
  let checkSum='ff';
  let setTime='10';
  const toggleScheme = () => {
    isDark ? setScheme('light') : setScheme('dark');
  }
  const hexToBase64 = (str) =>{
    console.log("string to be converted to base64: ", str);
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
  }
  function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}
  const readDeviceIdFromStorage = async () => {
    try {
      const DeviceIdFromStorage =JSON.parse( await AsyncStorage.getItem(DEVICE_STORAGE_KEY))  
      if (DeviceIdFromStorage!== null) {
        setDeviceID(DeviceIdFromStorage);
       console.log(" Device Id were read from storage memory!");
      }
    } catch (e) {
     console.log(e.message)
    }
  }
  useEffect( ()=>{
    readDeviceIdFromStorage
  },[isFocused]);
 const SetTime=async()=>{
   let date=new Date(Date.now());
   let year=decimalToHex(date.getFullYear()%2000);
   let month=decimalToHex((date.getMonth())+1);
   let Dow=decimalToHex(date.getDay())
   let day=decimalToHex(date.getDate());
   let hour=decimalToHex(date.getHours());
   let minute=decimalToHex(date.getMinutes());
   let seconds=decimalToHex(date.getSeconds());
   var base64String =hexToBase64(Start+type+command+length1+length2+checkSum+setTime+seconds+minute+hour+Dow+day+month+year+End);
   const DeviceId =JSON.parse( await AsyncStorage.getItem(DEVICE_STORAGE_KEY))
   console.log(DeviceId);
   manager.isDeviceConnected(DeviceId)
   .then(async(deviceIsConnected)=>{
     if(deviceIsConnected){
       await manager.discoverAllServicesAndCharacteristicsForDevice(DeviceId);
       manager.writeCharacteristicWithoutResponseForDevice(DeviceId,"FFE0", 'FFE1',base64String)
       .then((x)=>{
         console.log("Device is already connected and instruction was executed successfully!");
       })       
     }
     else{          
       manager.connectToDevice(DeviceId)
       .then(async(device) => {
         await device.discoverAllServicesAndCharacteristics();
         manager.writeCharacteristicWithoutResponseForDevice(DeviceId,"FFE0", 'FFE1',base64String)
         .then((x)=>{
         console.log("connection has been created and instruction was executed successfully!");
         })
         .catch((e)=>{
           //console.error(e)
         });  
       })
       .catch((e)=>{
         //console.error(e)
       });
     }
 });

 

 }

  return (
    <View style={{...globalStyles.container, backgroundColor:colors.background }}>   
    <Pressable style={styles.button}  onPress={SetTime} ><Text style={styles.btnText}>
				Reset Controller Time</Text></Pressable> 
      <Text style={{...globalStyles.titleText,color:colors.text}}>Theme
      </Text>
      <Separator color={separatorColor} ml={1} mr={1}/>
      <View style={styles.switchWrapper}>
        <Switch 
        trackColor={{ false: globalColors.blue, true: globalColors.blue }}
        thumbColor={isDark ? globalColors.yellow : globalColors.yellow}
        value={isDark} onValueChange={toggleScheme}/> 
        <View style={{...styles.messagecontainer, borderColor: colors.primary , borderColor: colors.primary}}>
            <Text style={{...styles.messagestyle, color: colors.text, }}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({  
  soundsList: {
    backgroundColor: 'white',
  },
  soundText: {
    fontSize: 18,
    paddingVertical: 4,
    fontWeight: '400',
    color: globalColors.blue,  
  },
  wrapper:{
    flex:4,
    justifyContent: 'center',
  },
  switchWrapper:{
    flex:4,
    justifyContent: 'flex-start',
    alignItems: 'center',    
  }, 
  messagestyle:{
    fontSize: 18,
  },
  messagecontainer:{
    margin: 24,
    padding: 12,
    borderRadius: 4,
    borderWidth: 2,        
  },
  button: {
		alignSelf:"center",
         justifyContent:"center",
		width: '100%',
		marginTop: 20,
		backgroundColor : '#2196f3',
		padding: 15,
		borderRadius: 5,
		marginBottom:10,

	  },
	  btnText: {
		color: "white",
		fontSize: 20,
		justifyContent: "center",
		textAlign: "center",
	  },
});

export default General;
