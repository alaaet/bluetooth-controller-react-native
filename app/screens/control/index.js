import React,{useState,useEffect} from "react";
import { StyleSheet, View,ScrollView,Text} from "react-native";
import { globalStyles } from "../../styles/global";
import CardWithButtons from "./cardWithButtons";
import Mode from "./mode";
import {useTheme} from '../../components/theme/ThemeProvider';
import { useIsFocused } from "@react-navigation/native";
import { globalColors } from "../../styles/global";
import AsyncStorage from '@react-native-community/async-storage';
import {sendToPeripheral,createCommandFromString} from "../../utils/bleManager"
import {decode as atob, encode as btoa} from 'base-64';
import {
  MOVE_SINGLE_UP, MOVE_SINGLE_DOWN, MOVE_DUAL_HEAD_UP, MOVE_DUAL_HEAD_DOWN, MOVE_DUAL_LEGS_UP, MOVE_DUAL_LEGS_DOWN, MOVE_DUAL_BOTH_UP, MOVE_DUAL_BOTH_DOWN, MOTOR_ONE_ON, MOTOR_ONE_OFF, MOTOR_TWO_ON, MOTOR_TWO_OFF, MOTOR_THREE_ON, MOTOR_THREE_OFF, MOTOR_FOUR_ON, MOTOR_FOUR_OFF, MOTOR_ONE_AND_TWO_ON, MOTOR_ONE_AND_TWO_OFF, MOTOR_THREE_AND_FOUR_ON, MOTOR_THREE_AND_FOUR_OFF, MOTOR_ONE_TWO_THREE_FOUR_OFF
} from "../../shared/constants";


const initialModes=[
  {id:"1",name:"Reading Mode",motor1scale:0 ,motor2scale:0,motor1direction:"Up",motor2direction:"Up"},
  {id:"2",name:"Sleep Mode",motor1scale:0 ,motor2scale:0,motor1direction:"Down",motor2direction:"Down"},
  {id:"3",name:"Relax Mode",motor1scale:0 ,motor2scale:0,motor1direction:"Up",motor2direction:"Up"}
];

export default function Control() {
  const {colors} = useTheme();
  const Modes_STORAGE_KEY="modes";
  const [currentModes,setCurrentModes] = useState([]);
  const [selectedModeId,setSelectedModeId] = useState(0);
  const [deviceId, setDeviceId] = useState("");
  const isFocused = useIsFocused();
  const DEVICE_STORAGE_KEY = "Device";
  
  const readModeFromStorage = async () => {
    try {
      const modesFromStorage =JSON.parse( await AsyncStorage.getItem(Modes_STORAGE_KEY))  
      if (modesFromStorage !== null) {
        setCurrentModes(modesFromStorage);
       console.log("Mode were read from storage memory!", modesFromStorage);
      }
      else{
        setCurrentModes(initialModes);
        console.log("!!INITIAL DATA!!")
      }
    } catch (e) {
     console.log(e.message)
    }
  }
  
  const saveModeToStorage = async () => {
    try {
      if(currentModes.length>0)       
      await AsyncStorage.setItem(Modes_STORAGE_KEY,JSON.stringify(currentModes));
      console.log("Modes were saved to storage memory!");
    } catch (e) {
      console.log(e.message)
    }
  }

  const readDeviceIdFromStorage = async () => {
    try {
      const deviceIdFromStorage =JSON.parse( await AsyncStorage.getItem(DEVICE_STORAGE_KEY))  
      if (deviceIdFromStorage !== null) {
        setDeviceId(deviceIdFromStorage);
       console.log("Device Id was read from storage memory!", deviceIdFromStorage);
      }
    } catch (e) {
     console.log(e.message)
    }
  }

  useEffect(()=>{
    readModeFromStorage();
  },[isFocused])

  
  useEffect(()=>{
    readModeFromStorage();
    readDeviceIdFromStorage();
  },[])
  

useEffect(()=>{  
  saveModeToStorage();  
},[currentModes]);

useEffect(()=>{
  let motor1count = 0;
  let motor2count = 0;
  let timer1 = null;
  let timer2 = null;
  const move = (motorNum,maxCount, instruction)=>{
    if(motorNum==1){
      if(motor1count/3<maxCount){
        motor1count++;
        sendToPeripheral(deviceId,instruction);
        timer1 = setTimeout(() => {move(motorNum,maxCount, instruction)}, 100);
      }
      else{
        clearTimeout(timer1);
      }
    }
    else if(motorNum==2){
      if(motor2count/3<maxCount){
        motor2count++;
        sendToPeripheral(deviceId,instruction);
        timer2 = setTimeout(() => {move(motorNum,maxCount, instruction)}, 100);
      }      
      else{
        clearTimeout(timer2);
      }
    }

  }
  if(deviceId!=""){
    console.log("selected mode changed, device id: ",deviceId);
    console.log("selected mode changed, mode: ",currentModes[selectedModeId-1]);
    const mode = currentModes[selectedModeId-1];
    if(mode.motor1direction=="Up")
    {
      move(1,mode.motor1scale,hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x04 0x40')));
    }else if(mode.motor1direction=="Down"){
      move(1,mode.motor1scale,hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x04 0x40')));    
    }

    if(mode.motor2direction=="Up")
    {
      move(2,mode.motor2scale,hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x02 0x40')));
      
    }else if(mode.motor1direction=="Down"){
      move(2,mode.motor2scale,hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x02 0x40')));
    }
  }
},[selectedModeId]);

const moveMotor  = async (movement)=>{
  let base64String = "";
  switch (movement) {
    case MOVE_SINGLE_UP:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x02 0x40'));
        break;
    case MOVE_SINGLE_DOWN:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x02 0x40'));
        break;
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
    case MOTOR_ONE_ON:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x02 0x40'));
        break;
    case MOTOR_ONE_OFF:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x02 0x40'));
        break;
    case MOTOR_TWO_ON:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x04 0x40'));
        break;
    case MOTOR_TWO_OFF:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x04 0x40'));
        break;
    case MOTOR_THREE_ON:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x08 0x40'));
        break;
    case MOTOR_THREE_OFF:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x08 0x40'));
        break;
    case MOTOR_FOUR_ON:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x10 0x40'));
        break;
    case MOTOR_FOUR_OFF:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x10 0x40'));
        break;
    case MOTOR_ONE_AND_TWO_ON:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x06 0x40'));
        break;
    case MOTOR_ONE_AND_TWO_OFF:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x06 0x40'));
        break;
    case MOTOR_THREE_AND_FOUR_ON:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x70 0x00 0x01 0x18 0x40'));
        break;
    case MOTOR_THREE_AND_FOUR_OFF:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x18 0x40'));
        break;
    case MOTOR_ONE_TWO_THREE_FOUR_OFF:
        base64String = hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x1E 0x40'));
        break;
    }
    const DeviceId =JSON.parse( await AsyncStorage.getItem(DEVICE_STORAGE_KEY))	
    sendToPeripheral(DeviceId,base64String);

}

   const hexToBase64 = (str) =>{
     return btoa(String.fromCharCode.apply(null,
      str.replace(/0x/g,"").replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
  }

  return (
    <ScrollView   style={{...globalStyles.container, backgroundColor:colors.background}}>      
      <CardWithButtons icon={require("../../icons/Rectangle3-1.png")} message={" Back"} handleAction={moveMotor} btns={[MOVE_DUAL_HEAD_UP,MOVE_DUAL_HEAD_DOWN]}/>
      <CardWithButtons icon={require("../../icons/Rectangle2-1.png")} message={" Leg"} handleAction={moveMotor} btns={[MOVE_DUAL_LEGS_UP,MOVE_DUAL_LEGS_DOWN]}/>
      <CardWithButtons icon={require("../../icons/Rectangle1-1.png") } message={" Leg & Back"} handleAction={moveMotor} btns={[MOVE_DUAL_BOTH_UP,MOVE_DUAL_BOTH_DOWN]}/>
      
      <Text style={{...styles.title,color:colors.text}}>Modes</Text>
      <View style={{...globalStyles.container, backgroundColor:colors.card}}>
        {currentModes.map((item,index)=>(<Mode item={item} key={index} selectedModeId={selectedModeId} setSelectedModeId={setSelectedModeId}/>))}
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
});
