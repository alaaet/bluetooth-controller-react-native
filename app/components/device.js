import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Separator from "./separator";
import {useTheme} from './theme/ThemeProvider';
const Device = (props) => {
  const {colors} = useTheme();
  return (
    <>
      <TouchableOpacity style={styles.wrapper} onPress={props.onPress}>
        <View style={{...styles.wrapperLeft,background:colors.card}}>
          <Image style={styles.iconLeft} source={props.iconLeft} />
        </View>
        <View style={styles.wrapperName}>
          <Text style={{...styles.name,color:colors.text}}>{props.name}</Text>
        </View>
        <Image style={styles.iconRight} source={props.iconRight} />
      </TouchableOpacity>
      <Separator  color={colors.separator}  />
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
  wrapperLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "grey",
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  iconLeft: {
    width: 20,
    height: 20,
  },
  wrapperName: { flex: 1, justifyContent: "flex-start", marginLeft: 15 },
  name: { fontSize: 20 },
  iconRight: {
    width: 20,
    height: 20,
  },
});
export default Device;
