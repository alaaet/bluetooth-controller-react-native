import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Alarm from "./alarm";
import { globalColors } from "../../styles/global";
const Bed = (props) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>{props.name}</Text>
          <Pressable>
            <View style={styles.plusIconContainer}> 
            <FontAwesomeIcon
              icon={faPlus}
              style={styles.plusIcon}
              size={25}
            />
            </View>
          </Pressable>
        </View>
        <View style={styles.container}>
          <Alarm name={"06:00"} period={"am"} />
          <Alarm name={"07:00"} period={"am"} />
          <Alarm name={"08:00"} period={"am"} />
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 5,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  plusIconContainer: {
    marginLeft: 10,
    padding:5,
    backgroundColor: globalColors.blue,
    borderRadius: 100,
  },
  plusIcon: {
    color: globalColors.yellow,
  },
});
export default Bed;
