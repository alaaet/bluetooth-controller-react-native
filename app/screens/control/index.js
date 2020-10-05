import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { globalStyles } from "../../styles/global";
import CardWithButtons from "./cardWithButtons";
import Mode from "./mode";

export default function Control({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>Remote Control</Text>
      <CardWithButtons icon={require("../../icons/Rectangle1.png")} />
      <CardWithButtons icon={require("../../icons/Rectangle2.png")} />
      <CardWithButtons icon={require("../../icons/Rectangle3.png")} />
      <View style={globalStyles.container}>
        <Mode name={"Reading Mode"} />
        <Mode name={"Sleep Mode"} />
        <Mode name={"Relax Mode"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
});
