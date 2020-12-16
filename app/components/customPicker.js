import React from "react";
import { StyleSheet, View } from "react-native";
import {Picker} from '@react-native-community/picker';
import RNPickerSelect from 'react-native-picker-select';
import {globalColors} from "../styles/global";

export function CustomPicker({ selectedOption,  setSelectedOption, options}) {
  renderPicker=()=>{
    if (Platform.OS === "ios") {
      return(
        <RNPickerSelect
          style={{ ...iOSStyles }}
          value={selectedOption}
            onValueChange={(value) => {
              setSelectedOption(value);
            }}
          items={options}
        />
      )
    }
    else{
      return(
        <Picker
        selectedValue={selectedOption}
        style={androidStyles.picker}
        itemStyle={{padding:0,margin:0}}
        onValueChange={(itemValue, itemIndex) =>{
          setSelectedOption(itemValue)}}
        >
          {options.map((option,index)=>(<Picker.Item key={index.toString()} label={option.label} value={option.value} />))}
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


const androidStyles = StyleSheet.create({
  picker: { height: 20, width:140, color: globalColors.blue},    
});
  
const iOSStyles = StyleSheet.create({
  input: {
    fontSize: 16,
    color: globalColors.blue,
  },
});
