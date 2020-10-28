import React from "react";
import { StyleSheet, View, Text,ScrollView  } from "react-native";
import { globalStyles } from "../../styles/global";
import CardWithButtons from "./cardWithButtons";
import Mode from "./mode";


export default function Control() {
  return (
    <ScrollView  style={globalStyles.container}>
      
      {/* <Text style={styles.title}>Remote Control</Text> */}
      <CardWithButtons icon={require("../../icons/Rectangle1-1.png")} />
      <CardWithButtons icon={require("../../icons/Rectangle2-1.png")} />
      <CardWithButtons icon={require("../../icons/Rectangle3-1.png")} />
      <View style={globalStyles.container}>
        <Mode name={"Reading Mode"} />
        <Mode name={"Sleep Mode"} />
        <Mode name={"Relax Mode"} />
      </View>
    </ScrollView >
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
