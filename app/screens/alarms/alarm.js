import React , {useState,useEffect }from "react";
import {
  View,
  SafeAreaView,
  Pressable,
  Text,
  Switch,
  StyleSheet,
  Platform
} from "react-native";
import Separator from "../../components/separator";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {globalColors} from "../../styles/global"
import {useTheme} from '../../components/theme/ThemeProvider';
import {AlarmPicker} from "../../shared/picker";
import { color } from "react-native-reanimated";


const Alarm = (props) => { 
  const {colors} = useTheme();
  const {alarm,deleteAlarm,program,updateProgram,deactivateAlarm,activateAlarm} = props;
  const [isEnabled, setIsEnabled] = useState(alarm.isActive);
  const [isRepeated, setIsRepeated] = useState(alarm.scheduleType!=="once");
  const [selectedProgramPicker, setSelectedProgramPicker] = useState(program);
  const period = alarm.hour>12?"pm":"am";
  let hour = (period=="pm"?alarm.hour-12:alarm.hour);  
  const label = (hour<10?"0"+hour:hour)+ ":"+(alarm.minute<10?"0"+alarm.minute:alarm.minute);

  const toggleSwitch = async(val) => {
    setIsEnabled(val);
    if(!val)deactivateAlarm(alarm);
    else activateAlarm(alarm);
  };  


  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.timeWrapper}>
          <Text style={{...styles.hour,color:colors.text}}>{label}</Text>
          <View style={styles.periodWrapper}>
            <Text style={{...styles.period,color:colors.period}}>{period}</Text>
          </View>
         
        </View>
        <SafeAreaView style={styles.safearea}>
       < AlarmPicker program={program} setSelectedProgramPicker={setSelectedProgramPicker} updateProgram={updateProgram} alarm={alarm}/>
        </SafeAreaView>
        <Switch
          trackColor={{ false: globalColors.Darkgrey, true: globalColors.blue }}
          thumbColor={isEnabled? globalColors.yellow : globalColors.yellow}
          style={styles.switch}
          onValueChange={(x)=>toggleSwitch(x)}
          value={isEnabled}
        />
        <Pressable onPress={() =>deleteAlarm(alarm.id)}>
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
    justifyContent:Platform.OS === 'ios' ? "space-between" : 'center',
    padding: 0,
    marginVertical:Platform.OS === 'ios' ? 3 : 0
   
  },
  timeWrapper: {
    flexDirection: "row",
    marginRight: Platform.OS === 'ios' ? 3 : 0
  },
  hour: { fontSize: 35 },
  periodWrapper:{
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 1,
    marginTop: 12,
  },
  period: { flex: 1, fontSize: 10,  },
  programPicker: { height: 20, width: 100, color: globalColors.blue},
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],marginHorizontal:7
  },
  delIcon: {
    color: "#d9534f",
  },
  button:{
    alignItems:"center",
    justifyContent:"center",
   marginTop:20

  },
  safearea:{
    width: Platform.OS === 'ios' ? 80 :120,
  }
});
export default Alarm;
