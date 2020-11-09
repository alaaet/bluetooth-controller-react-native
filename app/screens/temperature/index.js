import React,{useState} from "react";
import { View, Text,StyleSheet, Switch } from "react-native";
import { globalColors } from "../../styles/global";
import Thermometer from "./thermometer";
import {useTheme} from '../../components/theme/ThemeProvider';

export default function Temperature(props) {
  const {colors} = useTheme();
  const [degree,setDegree] =useState(100);
const[isFahrenheit,setIsFahrenheit]=useState(true);
const toggleSwitch = () => setIsFahrenheit(previousState => !previousState);


  const styles = StyleSheet.create({
    title: {
      fontSize: 30,
      fontWeight: "bold",
      color: globalColors.black,
    },
    wrapper: {
      flexDirection: "row",
      alignItems: "center",
      padding: 50,
      justifyContent: "center",
    },
    container:{
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 25,
      flexDirection: 'column',
      alignItems:"center",
      justifyContent:"center",
  },
    degreeContainer:{
      alignItems:"center",
      //justifyContent:"center",
    },
    degree:{
        fontSize: 25,
        color: '#000',
    },
    switchContainer:{
      flexDirection:"row",      
      alignItems:"center",
      justifyContent:"space-between",
    },
    switch: {
      margin:15,
      transform: [{ scaleX:1.5 }, { scaleY: 1.5 }],  
    },
  });
  return (
    <View style={{...styles.container, backgroundColor:colors.background}}>
            <View style={styles.wrapper}>
        <Text style={{...styles.title,color:colors.text}}>Temperature</Text>
      </View>
      <Thermometer degree={degree}/>
      <View style={styles.degreeContainer}>
        <Text style={{...styles.degree,color:colors.text}}>{isFahrenheit?((degree* 9/5) + 32)+'\u2109':degree+'\u2103'}</Text>
        <View style={styles.switchContainer}>
        <Text style={{color:colors.text}}>{'\u2103'}</Text>
        <Switch
         trackColor={{ false: globalColors.blue, true: globalColors.blue }}
         thumbColor={isFahrenheit ? globalColors.yellow : globalColors.yellow}
          style={styles.switch}
          onValueChange={toggleSwitch}
          value={isFahrenheit}
        />
        <Text style={{color:colors.text}}>{'\u2109'}</Text>
        </View>
      </View>    
    </View>
  );
}

