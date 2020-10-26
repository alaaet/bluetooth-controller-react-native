import React from "react";
import { StyleSheet, View, Text, TouchableOpacity,Platform } from "react-native";
import { globalStyles, globalColors } from "../../styles/global";
import Card from "../../shared/card";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={globalStyles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
   
});

  

