import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { globalStyles } from "../styles/global";

export default function Splash({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text>Splash Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: {} });
