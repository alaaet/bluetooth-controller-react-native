import React from "react";
import {
  View,
  Pressable,
  Text,
  Button,
  Switch,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../../styles/global";
import Separator from "../../components/separator";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Alarm from "./alarm";
const Bed = (props) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>{props.name}</Text>
          <Pressable>
            <FontAwesomeIcon
              icon={faPlusCircle}
              style={styles.plusIcon}
              size={50}
            />
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
  plusIcon: {
    marginLeft: 10,
    color: "#5a2e81",
  },
});
export default Bed;
