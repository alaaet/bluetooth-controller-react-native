import React from "react";
import { StyleSheet, View } from "react-native";
import {Picker} from '@react-native-community/picker';
import RNPickerSelect from 'react-native-picker-select';
import {globalColors} from "../styles/global"
export  function AlarmPicker(props) {
  const {alarm,updateProgram,setSelectedProgramPicker,program} = props;

 renderPicker=()=>{
    if (Platform.OS === "ios") {
    return(
        <RNPickerSelect
         style={{ ...pickerSelectStyles }}
        value={program}
             onValueChange={(value) => {
              setSelectedProgramPicker(value);
                updateProgram(parseInt(alarm.id),value);
            }}
             items={[
                 { label: 'Program1', value: 'Program1' },
                 { label: 'Program2', value: 'Program2' },
                 { label: 'Program3', value: 'Program3' },
                 { label: 'Program4', value: 'Program4' },
             ]}
         />
    )

    }
    else{
        return(
            <Picker
          selectedValue={program}
          style={styles.programPicker}
   
         itemStyle={{padding:0,margin:0}}
          onValueChange={(itemValue, itemIndex) =>{
            setSelectedProgramPicker(itemValue);
            updateProgram(parseInt(alarm.id),itemValue);
        }}
          >
        <Picker.Item label="Program1" value="Program1" />
        <Picker.Item label="Program2" value="Program2" />
        <Picker.Item label="Program3" value="Program3" />
        <Picker.Item label="Program4" value="Program4" />
          </Picker>
        )
    }
}
  return (
  <View>
      {renderPicker()}
  </View>
  );
}
export function AddAlarmPicker(props) {
    const {selectedProgram,setSelectedProgram} = props;
  
   renderPicker=()=>{
      if (Platform.OS === "ios") {
      return(
          <RNPickerSelect
          style={{ ...pickerSelectStyles }}
          value={selectedProgram}
               onValueChange={(value) => {
                setSelectedProgram(value);
              }}
               items={[
                   { label: 'Program1', value: 'Program1' },
                   { label: 'Program2', value: 'Program2' },
                   { label: 'Program3', value: 'Program3' },
                   { label: 'Program4', value: 'Program4' },
               ]}
           />
      )
  
      }
      else{
          return(
            <Picker
            selectedValue={selectedProgram}
            style={styles.programPicker}
            itemStyle={{padding:0,margin:0}}
            onValueChange={(itemValue, itemIndex) =>{
              setSelectedProgram(itemValue)}}
            >
          <Picker.Item label="Program1" value="Program1" />
          <Picker.Item label="Program2" value="Program2" />
          <Picker.Item label="Program3" value="Program3" />
          <Picker.Item label="Program4" value="Program4" />
            </Picker>
          )
      }
  }
    return (
    <View>
        {renderPicker()}
    </View>
    );
  }

const styles = StyleSheet.create({
    programPicker: { height: 20, width: 140, color: globalColors.blue},
    
    programPickerIos: { 
         color:globalColors.blue,
         justifyContent:"center",
         alignSelf:"center",
         
        
    } ,
  });
  
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        color: globalColors.blue,
    },
});
