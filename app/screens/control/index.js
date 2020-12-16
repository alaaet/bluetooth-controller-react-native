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
import {
  MOVE_DUAL_HEAD_UP, MOVE_DUAL_HEAD_DOWN, MOVE_DUAL_LEGS_UP, MOVE_DUAL_LEGS_DOWN, MOVE_DUAL_BOTH_UP, MOVE_DUAL_BOTH_DOWN,MOTOR_LATENCY
} from "../../shared/constants";
import {getDeviceIdFromStorage,readModesFromStorage,saveModesToStorage} from "../../utils/phoneStorage"


export default function Control() {
  const {colors} = useTheme();
  const [currentModes,setCurrentModes] = useState([]);
  const [selectedModeId,setSelectedModeId] = useState(0);
  const [deviceId, setDeviceId] = useState("");
  const isFocused = useIsFocused();
 
  useEffect(()=>{
    const init = async()=>{
      setCurrentModes( await readModesFromStorage());    
    setDeviceId(await getDeviceIdFromStorage())
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
      if(motor1count/3<maxCount){
        motor1count++;
        sendToPeripheral(deviceId,instruction);
        timer1 = setTimeout(() => {move(motorNum,maxCount, instruction)}, MOTOR_LATENCY);
      }
      else{
        clearTimeout(timer1);
      }
    }
    else if(motorNum==2){
      if(motor2count/3<maxCount){
        motor2count++;
        sendToPeripheral(deviceId,instruction);
        timer2 = setTimeout(() => {move(motorNum,maxCount, instruction)}, MOTOR_LATENCY);
      }      
      else{
        clearTimeout(timer2);
      }
    }

  }
  if(deviceId!=""){    
    move(1,15,hexToBase64(createCommandFromString('0x40 0x02 0x71 0x00 0x01 0x06 0x40')));   
    // WAIT for the controller to reset then execute the order
    setTimeout(() => {
       motor1count = 0;
       motor2count = 0;
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
    }, MOTOR_LATENCY * 4 * 15);
    
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
      <CardWithButtons icon={require("../../icons/Rectangle3-1.png")} message={" Back"} handleAction={moveMotor} btns={[MOVE_DUAL_HEAD_UP,MOVE_DUAL_HEAD_DOWN]}/>
      <CardWithButtons icon={require("../../icons/Rectangle2-1.png")} message={" Leg"} handleAction={moveMotor} btns={[MOVE_DUAL_LEGS_UP,MOVE_DUAL_LEGS_DOWN]}/>
      <CardWithButtons icon={require("../../icons/Rectangle1-1.png") } message={" Leg & Back"} handleAction={moveMotor} btns={[MOVE_DUAL_BOTH_UP,MOVE_DUAL_BOTH_DOWN]}/>
      
      <Text style={{...styles.title,color:colors.text}}>Modes</Text>
      <View style={{...globalStyles.container, paddingBottom:3,backgroundColor:colors.card}}>
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
