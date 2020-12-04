import { BleManager } from "react-native-ble-plx";
import {decode as atob, encode as btoa} from 'base-64';
import {getDeviceIdFromStorage} from "../utils/phoneStorage";
import Toast from 'react-native-toast-message';
const manager = new BleManager();
const sendToPeripheral = async(deviceId, message)=>{
    console.log("Instruction:",message)
   await manager.isDeviceConnected(deviceId)
    .then(async(deviceIsConnected)=>{
      if(deviceIsConnected)
      {
        await manager.discoverAllServicesAndCharacteristicsForDevice(deviceId);
        await manager.writeCharacteristicWithoutResponseForDevice(deviceId,"FFE0", 'FFE1',message)
          .then((x)=>{
            console.log("Device is already connected and instruction was executed successfully!");
          })       
      }
      else
      {          
       await manager.connectToDevice(deviceId)
        .then(async(device) => {
          await device.discoverAllServicesAndCharacteristics();
         await manager.writeCharacteristicWithoutResponseForDevice(deviceId,"FFE0", 'FFE1',message)
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
  }).catch((e)=>{
    console.error(e)
  });
  
}
const sendToPeripheralWithResponse = async(deviceId, message)=>{
    let result = "";
    console.log("Instruction:",message)
    await manager.isDeviceConnected(deviceId)
    .then(async(deviceIsConnected)=>{
      if(deviceIsConnected){
        
        await manager.discoverAllServicesAndCharacteristicsForDevice(deviceId);
        result = await manager.writeCharacteristicWithResponseForDevice(deviceId,"FFE0", 'FFE1',message)
        .then((x)=>{
          console.log("Device is already connected and instruction was executed successfully!");
          return "............\n"+JSON.stringify(filterBleResponse(x), null, 4).replace(/["{[,\}\]]/g, "")
        })       
      }
      else{          
        await manager.connectToDevice(deviceId)
        .then(async(device) => {
          await device.discoverAllServicesAndCharacteristics();
          result = await manager.writeCharacteristicWithResponseForDevice(deviceId,"FFE0", 'FFE1',message)
          .then((x)=>{
          console.log("connection has been created and instruction was executed successfully!");
          return "............\n"+JSON.stringify(filterBleResponse(x), null, 4).replace(/["{[,\}\]]/g, "");
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
  //console.log("RESULT : ",result)
 return result ;
}

const calculateCheckSum= (hexDigits, isArray) =>{
    // console.log({hexDigits});
    let csum = 0x00;
    if (!isArray) {
        hexDigits = hexDigits.split(' ');
    }

    hexDigits.forEach((item) => {
        csum = (parseInt(csum, 16) + parseInt(item, 16)).toString(16);
        csum = `0x${csum}`;
    });

    csum = `0x${(csum % 0x100).toString(16)}`;
    csum = `0x${decimalToHex((csum ^ 0xFF) + 1)}`;

    if (parseInt(csum) >= 256) {
        csum = `0x${((csum % 0x100).toString(16)).padStart(2, '0')}`;
        console.warn({ csum });
    }

    // 0x40 masking

    if (csum === '0x40') {
        csum = '0x3C 0x01';
    }

    // 0x0C masking
    if (csum === '0x3c' || csum === '0x3C') {
        csum = '0x3C 0x02';
    }

    // 0x4F masking
    if (csum === '0x4f' || csum === '0x4F') {
        csum = '0x3C 0x03';
    }
    
    // 0x41 masking
    if (csum === '0x41') {
        csum = '0x3C 0x04'
    }

    return csum;
}

const createCommandFromString = (hexString) =>{
    let checkSum = '';
    let hexDigits = hexString.split(' ');

    checkSum = calculateCheckSum(hexDigits, true);
    hexDigits.splice(5, 0, checkSum);
    //console.log("hexDigits: ",hexDigits.join(" "));
    return hexDigits.join(" ");
}

const decimalToHex=(d, padding) =>{
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}
const hexToBase64 = (str) =>{
  console.log("string to be converted to base64: ", str);
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

const filterBleResponse=(response)=>{
    let result = {};
    const keys = Object.keys(response).filter(prop=>!prop.startsWith("_"));
    //console.log("KEYS: ",keys)
    keys.forEach(key=>{result[key]=response[key]});
    //console.log("result: ",result)
    return result;
}
const checkControllerIsConnected =async()=>{
  let checked=false; 
  let deviceID = await getDeviceIdFromStorage();
  if(deviceID==null)
  {
    checked=false;
    Toast.show({
      text1: 'Error😯',
      text2: 'No controller found, please connect to the controller using Bluetooth!'
    });
  }
  else
  {
    await manager.isDeviceConnected(deviceID)
    .then(async(deviceIsConnected)=>{
      console.log("deviceIsConnected",deviceIsConnected)
      if(deviceIsConnected){
         checked=true; 
      }
      else{          
        await manager.connectToDevice(deviceID)
        .then(async() => {
          checked=true;   
        })
        .catch((e)=>{
          console.log(e)
        });
      }
  });

  }
 console.log("checked",checked)
 return checked;
 
}


export {sendToPeripheral,createCommandFromString,calculateCheckSum,decimalToHex,hexToBase64,manager,filterBleResponse,sendToPeripheralWithResponse,checkControllerIsConnected}