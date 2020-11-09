import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import {useTheme} from '../../components/theme/ThemeProvider';
const Empty = (props) => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      {!props.hideImage&&<Image style={styles.icon} source={require("../icons/empty.png")} />}
      <Text style={{...styles.text,color:colors.text}}>{props.text}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  icon: { width: 200, height: 200, marginVertical: 50 },
  text: {
    fontSize: 20,
  },
});
export default Empty;
