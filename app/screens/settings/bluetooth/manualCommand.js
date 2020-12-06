import React,{useState} from "react";
import { StyleSheet, View, Text ,Pressable,ScrollView} from "react-native";
import { globalStyles,globalColors } from "../../../styles/global";
import { TextInput } from "react-native-paper";
import {useTheme} from '../../components/theme/ThemeProvider';
import AsyncStorage from '@react-native-community/async-storage';
import {sendToPeripheralWithResponse} from "../../../utils/bleManager";
import {decode as atob, encode as btoa} from 'base-64';

export default function GenerateCommand() {
  const {colors} = useTheme();
  const [command,setCommand] = useState();
  const [consoleText,setConsoleText] = useState(" ");
  const DEVICE_STORAGE_KEY = "Device";
  const hexToBase64 = (str) =>{
    return btoa(String.fromCharCode.apply(null,
     str.replace(/0x/g,"").replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
   );
 }


  const SendCommand=async(command)=>{
    const DeviceId =JSON.parse( await AsyncStorage.getItem(DEVICE_STORAGE_KEY))
    var base64String =hexToBase64(command);
  let result= await sendToPeripheralWithResponse(DeviceId,base64String);
  setConsoleText(consoleText+result);
  
  
  
  }
  return (
    <View style={globalStyles.container}>  
        <Text style={globalStyles.titleText}>Manual Command In Hex</Text>
        <TextInput
         style={{...styles.textInput,color:colors.text}}
         onChangeText={text => setCommand(text)}
         value={command} 
         placeholder="Your instruction en HEX segments"  />
      <View style={styles.btnWrapper} >

        <Pressable style={styles.button} backgroundColor ={globalColors.blue}   onPress={()=>{SendCommand(command);} }><Text style={styles.btnText}>
             Add</Text></Pressable>
      </View>
      <ScrollView   style={{backgroundColor:globalColors.black}}>
     <Text  style={{color:globalColors.white}}>
     {consoleText}
     </Text>
      </ScrollView>
     
        <Pressable style={{...styles.button,marginTop:10}} backgroundColor ='red'   onPress={()=>setConsoleText("") } ><Text style={styles.btnText}>
            Clear console</Text></Pressable>
    
    </View>
  );
}

const styles = StyleSheet.create({
  textInput:{
    fontSize:18
}, 
btnWrapper: {
    marginVertical: 5
  },
  button: {
    alignSelf:"center",
     justifyContent:"center",
    width: '100%',
    padding: 15,
    borderRadius: 5,
  },
  btnText: {
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
  },
});

