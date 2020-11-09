import React, {useState, useEffect} from 'react'
import { Text, View,StyleSheet } from 'react-native'
import { globalColors, globalStyles } from '../../styles/global';
import Rainbow from "rainbowvis.js";
const Thermometer=(props)=> {
    const {degree} = props;
    let clippedDegree = degree<0?0:degree>100?100:degree;
    let stemPer = ((clippedDegree/100)*210)+30;
    const [color,setColor] =useState("red");
    useEffect(()=>{
        var numberOfItems = 100;
        var rainbow = new Rainbow(); 
        rainbow.setNumberRange(1, numberOfItems);
        rainbow.setSpectrum(globalColors.blue, globalColors.yellow,'red');
        setColor("#"+rainbow.colourAt(clippedDegree));
    },[degree]);
    const styles = StyleSheet.create({
        thermometer: {
position:"relative",
            alignItems:"center",
            height: "50%",
            marginRight:45,
        },
        bulb :{
          borderWidth:3,
          borderColor:"#222",
          width: 50,
          height: 50,
          borderRadius: 25,
          position: "absolute",
          left: 0,
          bottom: 0,
          borderTopWidth: 3,
          borderTopColor:"transparent",
          backgroundColor: color,
        },
        stem:{
            justifyContent:"flex-start",
            alignItems:"center",
          borderWidth:3,
          borderColor:"#222",
          width: 35,
          height: 250,
          borderRadius: 20,
          borderTopWidth: 3,
          borderTopColor:"transparent",
          position: "absolute",
          bottom: 31,//26
          left: 7.5,
          transform: [{rotate:'180deg'}],
          zIndex: 10,
          paddingBottom: 0,
        }
        ,stemPerct: {
          height: stemPer,
          width: 25,
          backgroundColor: color,
          borderRadius: 10,
        }
        ,bulbAfter: {
          height: 10,
          width: 25,
          backgroundColor: color,
          position: "absolute",
          left: 12.5,
          bottom: 32.5,
          zIndex: 12,
        }
      });

    return (
            <View style={styles.thermometer}>
                <View style={styles.stem}>
                    <View style={styles.stemPerct}></View>
                </View>
                <View style={styles.bulb}></View>
                <View style={styles.bulbAfter}></View>
            </View>
    )
}


export default Thermometer
