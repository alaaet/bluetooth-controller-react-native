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
import { faTrashAlt ,faEdit} from "@fortawesome/free-solid-svg-icons";
import {globalColors} from "../../styles/global"
import {useTheme} from '../../components/theme/ThemeProvider';
import {CustomPicker} from "../../components/customPicker";
import { PROGRAMS } from "../../shared/constants";
import{checkControllerIsConnected}from '../../utils/bleManager'
import {useNavigation } from "@react-navigation/native";

const Alarm = ({alarm,deleteAlarm,program,updateProgram,deactivateAlarm,activateAlarm}) => { 
console.log("programe:",alarm.program)
  const {colors} = useTheme();
  const [isEnabled, setIsEnabled] = useState(alarm.isActive);
  const [isRepeated, setIsRepeated] = useState(alarm.scheduleType!=="once");
  const [selectedProgram, setSelectedProgram] = useState(alarm.program);
  const navigation = useNavigation();
  const period = alarm.hour>12?"pm":"am";
  let hour = (period=="pm"?alarm.hour-12:alarm.hour);  
  const label = (hour<10?"0"+hour:hour)+ ":"+(alarm.minute<10?"0"+alarm.minute:alarm.minute);
  console.log("Label",label);
  useEffect(() => {
    updateProgram(parseInt(alarm.id),selectedProgram)
  }, [selectedProgram])

  const toggleSwitch = async(val) => {
    setIsEnabled(val);
    if(!val)deactivateAlarm(alarm);
    else activateAlarm(alarm);
  };  
  const editAlarm = async(alarm,alarmId) => {
    //console.log("editAlarm, alarm id = ",alarmId)
    navigation.navigate('EditAlarm', {item:alarm},{AlarmId:alarmId})
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
       < CustomPicker selectedOption={selectedProgram} setSelectedOption={ setSelectedProgram}options={PROGRAMS}/>
        </SafeAreaView>
        </View>
        <View style={styles.buttonsWrapper}>
        <Text style={{...styles.switchLabel,color:colors.text}}>Active: </Text>
        <Switch
          trackColor={{ false: globalColors.Darkgrey, true: globalColors.blue }}
          thumbColor={isEnabled? globalColors.yellow : globalColors.yellow}
          style={styles.switch}
          onValueChange={(x)=>{
           if(checkControllerIsConnected())
           toggleSwitch(x)}}
          value={isEnabled}
        />
       
        <Pressable onPress={()=>{
           if(checkControllerIsConnected())
           deleteAlarm(alarm.id)}}>
          <FontAwesomeIcon icon={faTrashAlt} style={styles.delIcon} size={25} />
        </Pressable>
        <Pressable onPress={()=>{
           if(checkControllerIsConnected())
           editAlarm(alarm,alarm.id)}}>
          <FontAwesomeIcon icon={faEdit} style={{...styles.editIcon,color:globalColors.blue}} size={25} />
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
    marginVertical:Platform.OS === 'ios' ? 3 : 0,
    width:"100%"
   
  },
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent:Platform.OS === 'ios' ? "space-between" : 'center',
    marginVertical:Platform.OS === 'ios' ? 6 : 3,
    //width:"100%"
   
  },
  timeWrapper: {
    flexDirection: "row",
    marginRight: Platform.OS === 'ios' ? 3 : 0,
    width:"30%"

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
  switchLabel:{
    fontSize: 20
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],width:"10%",marginHorizontal:10
  },
  delIcon: {
    color: "#d9534f",
    marginHorizontal:10
  },
  editIcon:{
    alignItems:"center",
    justifyContent:"center",
   //marginTop:20,
   marginHorizontal:10

  },
  safearea:{
    width: Platform.OS === 'ios' ?80:120,
    width:"45%",
   
  }
});
export default Alarm;
