import React,{useState,useEffect} from "react";
import { StyleSheet, View,ScrollView,Text} from "react-native";
import { globalStyles } from "../../styles/global";
import CardWithButtons from "./cardWithButtons";
import Mode from "./mode";
import {useTheme} from '../../components/theme/ThemeProvider';
import { useIsFocused } from "@react-navigation/native";
import { globalColors } from "../../styles/global";
import AsyncStorage from '@react-native-community/async-storage'

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
  const isFocused = useIsFocused();
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
  useEffect(()=>{
    readModeFromStorage();
  },[isFocused])

  
  useEffect(()=>{
    readModeFromStorage();
  },[])
  

useEffect(()=>{
  saveModeToStorage();
},[currentModes]);

  return (
    <ScrollView   style={{...globalStyles.container, backgroundColor:colors.background}}>      
      <CardWithButtons icon={require("../../icons/Rectangle1-1.png") } message={" Motor one and two"}/>
      <CardWithButtons icon={require("../../icons/Rectangle2-1.png")} message={" Motor two"} />
      <CardWithButtons icon={require("../../icons/Rectangle3-1.png")} message={" Motor one "} />
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
