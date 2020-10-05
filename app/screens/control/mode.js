import React from "react";
import {
  View,
  Pressable,
  Text,
  Button,
  Switch,
  StyleSheet,
} from "react-native";
import Separator from "../../components/separator";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
const Mode = (props) => {
  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.btnWrapper}>
          <Button onPress={props.onPress} title={props.name} />
        </View>
        <Pressable style={styles.wrapper} onPress={props.onPress}>
          <FontAwesomeIcon icon={faEdit} style={styles.icon} size={30} />
        </Pressable>
        <Pressable style={styles.wrapper} onPress={props.onPress}>
          <FontAwesomeIcon icon={faSave} style={styles.icon} size={30} />
        </Pressable>
        <Switch
          style={styles.switch}
          value={props.value}
          onValueChange={props.onValueChange}
        />
      </View>
      <Separator />
    </>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  btnWrapper: {
    width: 130,
  },
  icon: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#5a2e81",
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
export default Mode;
