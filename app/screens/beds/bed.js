import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { globalColors } from "../../styles/global";

export default function Bed(props) {
  return (
    <Pressable>
      <View style={styles.wrapper}>
        <FontAwesomeIcon icon={faBars} style={styles.icon} size={50} />
        <Text style={styles.reading}>{props.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  reading: { fontSize: 35, color: globalColors.yellow },
  icon: { color: globalColors.white, marginRight: 50 },
});
