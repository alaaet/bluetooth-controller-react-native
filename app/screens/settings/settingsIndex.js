import React from "react";
import { StyleSheet, View, Text, TouchableOpacity,Switch } from "react-native";
import { globalStyles, globalColors } from "../../styles/global";
import Card from "../../components/card";
import {useTheme} from '../../components/theme/ThemeProvider';




export default function SettingsScreen({ navigation }) {
  const {colors} = useTheme();

  return (
    <View style={{...styles.containerStyle, backgroundColor:colors.background }}>
      <TouchableOpacity onPress={() => navigation.navigate("Bluetooth")}>
      <Card bgColor={globalColors.blue}>
      <Text style={globalStyles.titleText}>Bluetooth</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Help")}>
        <Card bgColor={globalColors.blue}>
          <Text style={globalStyles.titleText}>Help Center</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("General")}>
        <Card bgColor={globalColors.blue}>
          <Text style={globalStyles.titleText}>General Settings</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("GenerateCommand")}>
        <Card bgColor={globalColors.blue}>
          <Text style={globalStyles.titleText}>Manual Command</Text>
        </Card>
      </TouchableOpacity>
      
     
     
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 25,},
    wrapper:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messagecontainer:{
      margin: 24,
      padding: 12,
      borderRadius: 4,
      borderWidth: 2,
    },
    messagestyle:{
      fontSize: 18, 
    }

    

});

  

