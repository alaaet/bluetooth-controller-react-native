import React , {useState }from "react";
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
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Picker } from "@react-native-community/picker";
import {globalColors} from "../../styles/global"


const Alarm = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.timeWrapper}>
          <Text style={styles.hour}>{props.name}</Text>
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: 1,
              marginTop: 12,
            }}
          >
            <Text style={styles.period}>{props.period}</Text>
          </View>
        </View>
        <Picker
          selectedValue={"pg1"}
          style={styles.programPicker}
          onValueChange={(itemValue, itemIndex) => {}}
        >
          <Picker.Item label="Program1" value="pg1" />
          <Picker.Item label="Program2" value="pg2" />
        </Picker>
        <Switch
          trackColor={{ false: globalColors.blue, true: globalColors.blue }}
          thumbColor={isEnabled ? globalColors.yellow : globalColors.yellow}
          style={styles.switch}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Pressable>
          <FontAwesomeIcon icon={faTrashAlt} style={styles.delIcon} size={25} />
        </Pressable>
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
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hour: { fontSize: 35 },
  period: { flex: 1, fontSize: 10, color: "grey" },
  programPicker: { height: 50, width: 140, color: globalColors.blue },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  delIcon: {
    color: "#d9534f",
  },
});
export default Alarm;
