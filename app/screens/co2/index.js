import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { globalColors, globalStyles } from "../../styles/global";

export default function Co2(props) {
  return (
    <View style={globalStyles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>CO2 Reading</Text>
      </View>
      <View style={styles.cardWrapper}>
        <Text style={styles.reading}>Current Reading</Text>
        <Text style={{ ...styles.reading, color: globalColors.white }}>15%</Text>
        <Text style={styles.reading}>Last Time Reading</Text>
        <Text style={{ ...styles.reading, color: globalColors.white }}>10%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: globalColors.black,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 50,
    justifyContent: "center",
  },
  cardWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: globalColors.blue,
    height: 300,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
  },
  reading: { fontSize: 35, color: globalColors.yellow },
});
