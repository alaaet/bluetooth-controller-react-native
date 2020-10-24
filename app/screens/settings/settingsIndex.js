import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";
import Card from "../../shared/card";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Bluetooth")}>
        <Card>
          <Text style={globalStyles.titleText}>Bluetooth</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Help")}>
        <Card>
          <Text style={globalStyles.titleText}>Help Center</Text>
        </Card>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
