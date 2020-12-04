import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { globalStyles } from "../../../styles/global";
import Card from "../../../components/card";

export default function DeviceView({ navigation, route }) {
  const { title, body } = route.params;

  return (
    <View style={globalStyles.container}>
      <Card>
        <Text style={globalStyles.titleText}>{title}</Text>
        <Text>{body}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  rating: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
