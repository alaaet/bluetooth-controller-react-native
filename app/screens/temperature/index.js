import React,{useState} from "react";
import { View, Text,StyleSheet, Switch } from "react-native";
import { globalColors } from "../../styles/global";
import Thermometer from "./thermometer";

export default function Temperature(props) {
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
    <View style={styles.container}>
            <View style={styles.wrapper}>
        <Text style={styles.title}>Temperature</Text>
      </View>
      <Thermometer degree={degree}/>
      <View style={styles.degreeContainer}>
        <Text style={styles.degree}>{isFahrenheit?((degree* 9/5) + 32)+'\u2109':degree+'\u2103'}</Text>
        <View style={styles.switchContainer}>
        <Text>{'\u2103'}</Text>
        <Switch
         trackColor={{ false: globalColors.blue, true: globalColors.blue }}
         thumbColor={isFahrenheit ? globalColors.yellow : globalColors.yellow}
          style={styles.switch}
          onValueChange={toggleSwitch}
          value={isFahrenheit}
        />
        <Text>{'\u2109'}</Text>
        </View>
      </View>    
    </View>
  );
}

