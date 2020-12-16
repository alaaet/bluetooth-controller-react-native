import React, { useState,useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { globalStyles } from "../../styles/global";
import Bed from "./bed";
import Empty from "../../components/empty";
import {useTheme} from "../../components/theme/ThemeProvider" ;
import{readBedFromStorage} from "../../utils/phoneStorage"; 
import {useIsFocused} from "@react-navigation/native";

const renderEmpty = () =>   <Bed
name="Bed A"

/>;
export default function Alarms() {
  const {colors, isDark, setScheme} = useTheme();
  const isFocused = useIsFocused();
  const [bed, setBed] = useState({id:null,name:null,device:null});
  useEffect(()=>{
    const init = async()=>{
    setBed( readBedFromStorage())  }
    init();
  },[])
  useEffect(()=>{
    const init = async()=>{
    setBed(await readBedFromStorage())  }
    init();
  },[isFocused])
  const renderItem = () => {
    return (
      <Bed
        name={bed.name}
        
      />
    );
  };
  return (
    <View style={{...globalStyles.container, backgroundColor:colors.background}}>
       {bed.name!==null?renderItem():renderEmpty()}
     
    </View>
  );
}

const styles = StyleSheet.create({
  
});
