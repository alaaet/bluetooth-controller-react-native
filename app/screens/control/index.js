import React,{useState,useEffect} from "react";
import { StyleSheet, View,ScrollView,Text} from "react-native";
import { globalStyles } from "../../styles/global";
import CardWithButtons from "./cardWithButtons";
import Mode from "./mode";
import {useTheme} from '../../components/theme/ThemeProvider';
import { useIsFocused } from "@react-navigation/native";
import { globalColors } from "../../styles/global";
import {sendToPeripheral,createCommandFromString} from "../../utils/bleManager"
import {decode as atob, encode as btoa} from 'base-64';
import { BleManager } from "react-native-ble-plx";
import Spinner from 'react-native-loading-spinner-overlay';
import {
  MOVE_DUAL_HEAD_UP, MOVE_DUAL_HEAD_DOWN, MOVE_DUAL_LEGS_UP, MOVE_DUAL_LEGS_DOWN, MOVE_DUAL_BOTH_UP, MOVE_DUAL_BOTH_DOWN,MOTOR_LATENCY
} from "../../shared/constants";
import {getDeviceIdFromStorage,readModesFromStorage,saveModesToStorage} from "../../utils/phoneStorage"


export default function Control() {
  const {colors} = useTheme();
  const manager = new BleManager();
  const [currentModes,setCurrentModes] = useState([]);
  const [selectedModeId,setSelectedModeId] = useState(0);
  const [deviceId, setDeviceId] = useState("");
  const [spinner, setSpinner] = useState(false);
  const isFocused = useIsFocused();
  const handleConnect=async(deviceId)=>{
    if(deviceId!==""){
      manager.isDeviceConnected(deviceId).then(async(isConnected)=>{
        console.log("CONNECTION CHECK RESULT: ", isConnected)
        if(!isConnected)
        {          
            await manager.connectToDevice(deviceId)
            .then(async(device) => {                 
                console.log("CONNECTION done:",deviceId)
                await device.discoverAllServicesAndCharacteristics();
                return true;
            }).catch(async(e)=>{
              console.log("CONNECTION ERROR:",e)
              return false;
            });
           return false;
        }
        
       
      }).catch((e)=>{
        console.log("Error while checking device connection: ",deviceId);
        return false
      });
      return false;

    }

 }
 
  useEffect(()=>{
    const init = async()=>{
      setCurrentModes( await readModesFromStorage());    
      setDeviceId(await getDeviceIdFromStorage());
      setTimeout(async() => {
      handleConnect(await getDeviceIdFromStorage());
      //console.log(" device Id",await getDeviceIdFromStorage())
      }, 200);
   
     
   
  }
    init();
    
  },[])

  useEffect(()=>{
    const init= async()=>{
    setCurrentModes( await readModesFromStorage());
  }
  init();
  },[isFocused])
  
useEffect(()=>{  
  saveModesToStorage(currentModes);  
},[currentModes]);

useEffect(()=>{
  let motor1count = 0;
  let motor2count = 0;
  let timer1 = null;
  let timer2 = null;
  const move = (motorNum,maxCount, instruction)=>{
    //console.log("MAX COUNT: ",maxCount)
    if(motorNum==1){
      //back
      if(motor1count<maxCount){
        motor1count++;
        sendToPeripheral(deviceId,instruction);
        timer1 = setTimeout(() => {move(motorNum,maxCount, instruction)}, MOTOR_LATENCY);
      }
      else{
        clearTimeout(timer1);
      }
    }
    else if(motorNum==2){
      //leg
      if(motor2count<maxCount){
        motor2count++;
        sendToPeripheral(deviceId,instruction);
        timer2 = setTimeout(() => {move(motorNum,maxCount, instruction)}, MOTOR_LATENCY);
      }      
      else{
        clearTimeout(timer2);
      }
    }

  }
  if(deviceId!=""&&selectedModeId!==0){    
   move(1,16,hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x06 0x40')));  
   setTimeout(() => {
    motor1count = 0;
    motor2count = 0;
    move(1,20,hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x02 0x40')));  
   }, MOTOR_LATENCY * 23);
   

   // WAIT for the controller to reset then execute the order
    setTimeout(() => {
       motor1count = 0;
       motor2count = 0;
      console.log("selected mode changed, device id: ",deviceId);
      console.log("selected mode changed, mode: ",currentModes[selectedModeId-1]);
      const mode = currentModes[selectedModeId-1];
      if(mode.motor1scale!==0)
      {
        move(1,mode.motor1scale,hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x02 0x40')));
      }

      if(mode.motor2scale!==0)
      {
        move(2,mode.motor2scale,hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x04 0x40')));
        
      }
     
    }, MOTOR_LATENCY *53);

    if(selectedModeId==4){
      setTimeout(() => {
        setSelectedModeId(0);
      }, MOTOR_LATENCY*53);
    }
    else{
      const mode = currentModes[selectedModeId-1];
      setTimeout(() => {
        setSelectedModeId(0);
        setSpinner(false);
      }, MOTOR_LATENCY*(53+mode.motor1scale+mode.motor2scale));
    }
    
  }
  
},[selectedModeId]);


const moveMotor  = async (movement)=>{
  let base64String = "";
  switch (movement) {
    case MOVE_DUAL_HEAD_UP:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x02 0x40'));
        break;
    case MOVE_DUAL_HEAD_DOWN:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x02 0x40'));
        break;
    case MOVE_DUAL_LEGS_UP:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x04 0x40'));
        break;
    case MOVE_DUAL_LEGS_DOWN:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x04 0x40'));
        break;
    case MOVE_DUAL_BOTH_UP:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x06 0x40'));
        break;
    case MOVE_DUAL_BOTH_DOWN:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x06 0x40'));
        break;    
    }
    sendToPeripheral(deviceId,base64String);

}

const hexToBase64 = (str) =>
{
  return btoa(String.fromCharCode.apply(null,
  str.replace(/0x/g,"").replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

  return (
    <ScrollView   style={{...globalStyles.container, backgroundColor:colors.background}}>  
      <Spinner
          visible={spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      <CardWithButtons icon={require("../../icons/Rectangle3-1.png")} message={" Back"} handleAction={moveMotor} btns={[MOVE_DUAL_HEAD_UP,MOVE_DUAL_HEAD_DOWN]}/>
      <CardWithButtons icon={require("../../icons/Rectangle2-1.png")} message={" Leg"} handleAction={moveMotor} btns={[MOVE_DUAL_LEGS_UP,MOVE_DUAL_LEGS_DOWN]}/>
      <CardWithButtons icon={require("../../icons/Rectangle1-1.png") } message={" Leg & Back"} handleAction={moveMotor} btns={[MOVE_DUAL_BOTH_UP,MOVE_DUAL_BOTH_DOWN]}/>
      
      <Text style={{...styles.title,color:colors.text}}>Modes</Text>
      <View style={{...globalStyles.container, paddingBottom:3,marginBottom:25,backgroundColor:colors.card}}>
        {currentModes.map((item,index)=>(<Mode item={item} key={index}setSpinner={setSpinner} selectedModeId={selectedModeId} setSelectedModeId={setSelectedModeId}/>))}
      </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  title: {
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    justifyContent: "center",
  },
  plusIconContainer: {
    marginLeft: 10,
    padding:5,
    backgroundColor: globalColors.blue,
    borderRadius: 100,
  },
  plusIcon: {
    color: globalColors.yellow,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf:"center"
   
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});
