import React ,{ useState }  from "react";
import { View, Pressable, Switch, StyleSheet,Text } from "react-native";
import Separator from "../../components/separator";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import { globalColors } from "../../styles/global";
const Mode = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.btnWrapper}>
        <Pressable
          style={styles.button}
          onPress={props.onPress}
        >
          <Text style={styles.btnText}>{props.name} 
			</Text>
</Pressable>
        </View>
        <Pressable style={styles.wrapper} onPress={props.onPress}>
          <FontAwesomeIcon icon={faEdit} style={styles.icon} size={30} />
        </Pressable>
        <Pressable style={styles.wrapper} onPress={props.onPress}>
          <FontAwesomeIcon icon={faSave} style={styles.icon} size={30} />
        </Pressable>
        <Switch
         trackColor={{ false: globalColors.blue, true: globalColors.blue }}
         thumbColor={isEnabled ? globalColors.yellow : globalColors.yellow}
          style={styles.switch}
          onValueChange={toggleSwitch}
          value={isEnabled}
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
    color: "#3C99DC",
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],

  },
  button: {
    width: 130,
    backgroundColor: globalColors.blue,
    paddingVertical:10,
    paddingHorizontal:6,
    borderRadius:5
    
  },
  btnText: {
    color: globalColors.yellow,
    fontSize: 18,
    justifyContent: "center",
    textAlign: "center",
  },
});

export default Mode;
