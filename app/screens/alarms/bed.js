import React, {useState,useEffect} from "react";
import { View, Pressable, Text,FlatList,ScrollView, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Alarm from "./alarm";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import { globalColors } from "../../styles/global";
import ReactNativeAN from 'react-native-alarm-notification';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage'
import Empty from "../../components/empty";
import { NativeEventEmitter, NativeModules } from 'react-native';
import {useTheme} from '../../components/theme/ThemeProvider';

const Bed = (props) => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [activatedAlarms,setActivatedAlarms] = useState([]);
  const [deactivatedAlarms,setDeactivatedAlarms] = useState([]);
  const [alarmsPrograms,setAlarmsPrograms] = useState([]);
  const isFocused = useIsFocused();
  const [deleteCount, setDeleteCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const ALARMS_STORAGE_KEY = "Alarms";
  const Deactivated_ALARMS_STORAGE_KEY = "DeactivatedAlarms";
  const ALARMS_PROGRAMS_STORAGE_KEY = "AlarmsPrograms";
  const { RNAlarmNotification } = NativeModules;
  const RNAlarmEmitter = new NativeEventEmitter(RNAlarmNotification);
  showPermissions = () => {
		ReactNativeAN.checkPermissions((permissions) => {
			console.log(permissions);
		});
	};

const Permmissions =()=>{

  if (Platform.OS === 'ios') {
    showPermissions();

    ReactNativeAN.requestPermissions({
      alert: true,
      badge: true,
      sound: true,
    }).then(
      (data) => {
        console.log('RnAlarmNotification.requestPermissions', data);
      },
      (data) => {
        console.log('RnAlarmNotification.requestPermissions failed', data);
      },
    );
  }
}
useEffect(()=>{
  Permmissions(); 
},[]);

  // First time 
  useEffect(()=>{
   
     readAlarmsFromStorage() ;
     readAlarmsProgramsFromStorage();  
     readDeactivatedAlarmsFromStorage();
    const dismissSubscription = RNAlarmEmitter.addListener(
      'OnNotificationDismissed', async(data) => 
      {
        Toast.show({
          text1: 'Alarm',
          text2:  `The alarm was dismissed! 👋`
        });
        ReactNativeAN.stopAlarmSound();
      });
      console.log("Listener was added");
      return(()=>{
        dismissSubscription.remove();
      });
  },[]);

  // When Alarms change
  useEffect( ()=>{
    saveAlarmsToStorage();
  },[activatedAlarms]);

    // When Alarms Programs change
    useEffect(()=>{
      saveAlarmsProgramsToStorage();
    },[alarmsPrograms]);

    // When Deactivated Alarms change
    useEffect(()=>{
      saveDeactivatedAlarmsToStorage();
    },[deactivatedAlarms]);

  // When screen is in focus or an Alarm is deleted
  useEffect(()=>{
     getAlarmsFromPhone(); 
     readAlarmsProgramsFromStorage();
     readDeactivatedAlarmsFromStorage();  
    console.log("Activated Alarms: ", activatedAlarms);
    console.log("Deactivated Alarms: ", deactivatedAlarms);
    console.log("programs: ",alarmsPrograms);
  },[isFocused,deleteCount,updateCount]);


  // STORAGE FUNCTIONS

  const readAlarmsProgramsFromStorage = async () => {
    try {
      const alarmsProgramsFromStorage =JSON.parse( await AsyncStorage.getItem(ALARMS_PROGRAMS_STORAGE_KEY))  
      if (alarmsProgramsFromStorage !== null) {
       setAlarmsPrograms(alarmsProgramsFromStorage);
       console.log("Alarms Programs were read from storage memory!");
      }
    } catch (e) {
     console.log(e.message)
    }
  }

  const saveAlarmsProgramsToStorage = async () => {
    try {
      if(alarmsPrograms.length>0)
      await AsyncStorage.setItem(ALARMS_PROGRAMS_STORAGE_KEY,JSON.stringify(alarmsPrograms));
      console.log("Alarms Programs were saved to storage memory!");
    } catch (e) {
      console.log(e.message)
    }
  }

  const readAlarmsFromStorage = async () => {
    try {
      const alarmsFromStorage =JSON.parse( await AsyncStorage.getItem(ALARMS_STORAGE_KEY))  
      if (alarmsFromStorage !== null) {
       setActivatedAlarms(alarmsFromStorage);
       console.log("Alarms were read from storage memory!");
      }
    } catch (e) {
     console.log(e.message)
    }
  }

  const saveAlarmsToStorage = async () => {
    try {
      if(activatedAlarms.length>0)
      await AsyncStorage.setItem(ALARMS_STORAGE_KEY,JSON.stringify(activatedAlarms));
      console.log("Alarms were saved to storage memory!");
    } catch (e) {
      console.log(e.message)
    }
  }
  //Deactivated alarm
  const readDeactivatedAlarmsFromStorage = async () => {
    try {
      const DeactivatedalarmsFromStorage =JSON.parse( await AsyncStorage.getItem(Deactivated_ALARMS_STORAGE_KEY))  
      if (DeactivatedalarmsFromStorage !== null) {
        setDeactivatedAlarms(DeactivatedalarmsFromStorage);
       console.log(" Deactivated Alarms were read from storage memory!");
      }
    } catch (e) {
     console.log(e.message)
    }
  }

  const saveDeactivatedAlarmsToStorage = async () => {
    try {
      if(deactivatedAlarms.length>0)
      await AsyncStorage.setItem(Deactivated_ALARMS_STORAGE_KEY,JSON.stringify(deactivatedAlarms));
      console.log("Alarms were saved to storage memory!");
    } catch (e) {
      console.log(e.message)
    }
  }



  // ALARM LIBRARY FUNCTIONS

  const deleteAlarm = async (id, deleteProgram=false) => {
		if (id !== '') {
      const alarmId = parseInt(id, 10);
       await ReactNativeAN.deleteAlarm(alarmId);       
       if (deleteProgram) setAlarmsPrograms( alarmsPrograms.filter((obj)=>{
        return obj.alarmId != id;
      }))
      const newDeactivatedAlarms = deactivatedAlarms.filter((item)=>{return id != item.id});    
      setDeactivatedAlarms(newDeactivatedAlarms);
      await AsyncStorage.setItem(Deactivated_ALARMS_STORAGE_KEY,JSON.stringify(newDeactivatedAlarms));
      setDeleteCount(deleteCount+1);
      Toast.show({
        text1: 'Alarm',
        text2: 'Alarm deleted! 👋'
      });      
		}
  };

  async function getAlarmsFromPhone(){
    const list = await ReactNativeAN.getScheduledAlarms();
    if(list!=null) 
    {
      list.forEach(element => {
        element.isActive = true;
      });
      setActivatedAlarms(list);
      console.log("Alarms were read from phone system!");
    }
  }

  const deactivateAlarm = async(alarm)=>{
    console.log("Deactivating alarm: ",alarm);
    await ReactNativeAN.deleteAlarm(parseInt(alarm.id, 10));
    setActivatedAlarms(activatedAlarms.filter((item)=>{
      return alarm.id != item.id}))
    setDeactivatedAlarms([...deactivatedAlarms,{...alarm,isActive:false}])
  }

  const activateAlarm = async(alarm)=>{
    const newDeactivatedAlarms = deactivatedAlarms.filter((item)=>{return alarm.id != item.id});
    //console.warn("newDeactivatedAlarms: ",newDeactivatedAlarms)
    setDeactivatedAlarms(newDeactivatedAlarms);
    await AsyncStorage.setItem(Deactivated_ALARMS_STORAGE_KEY,JSON.stringify(newDeactivatedAlarms));
    //alarm.alarmId = null;
    //alarm.id = null;
    console.log("Activating alarm: ",alarm);
    let alarm_date=new Date(alarm.year,alarm.month-1,alarm.day,alarm.hour,alarm.minute,alarm.second);
    try{
    if( new Date(Date.now())>alarm_date)
    {
      alarm_date.setDate(alarm_date.getDate()+1);
    }
   alarm.fire_date = ReactNativeAN.parseDate(alarm_date);
    console.log("Äctive",alarm);
    alarm.id= (await ReactNativeAN.scheduleAlarm(alarm)).id;
    setActivatedAlarms([...activatedAlarms,{alarm,isActive:true}])}
    catch(e){
      console.log(e.message);
    }
    

  }

  // PROGRAM FUNCTIONS
  const updateProgram = (alarmId,program)=>{
    console.info("alarmId: "+alarmId+", program: "+program);

    setAlarmsPrograms(alarmsPrograms.map((alarmProgram)=>{
      if(alarmProgram.alarmId==alarmId)alarmProgram.program=program;
      return alarmProgram;
    }));
  } 

  // VISUAL FUNCTIONS - needed for rendering
  const renderEmpty = () => <Empty hideImage text="No Alarms yet!" />;
  const renderItem = (alarm,index) => {
    let alarmProgram = alarmsPrograms.find((obj)=>{
      return obj.alarmId == alarm.item.id
    });
    alarmProgram=alarmProgram==null?{program:"program4"}:alarmProgram;
    console.info("alarm id: ",alarm.item.id)
    console.info("program: ",alarmProgram.program)
    return (
<Alarm alarm={alarm.item} index={index} deleteAlarm={deleteAlarm} program={alarmProgram.program} updateProgram={updateProgram} deactivateAlarm={deactivateAlarm} activateAlarm={activateAlarm}/>
    );
  };


  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={{...styles.title,color:colors.text}}>{props.name}</Text>
          <Pressable onPress={() => navigation.navigate('AddAlarm', {alarmsPrograms:alarmsPrograms})}>
            <View style={styles.plusIconContainer}> 
            <FontAwesomeIcon
              icon={faPlus}
              style={styles.plusIcon}
              size={25}
            />
            </View>
          </Pressable>
        </View>
        <ScrollView >
        <FlatList
        data={[...activatedAlarms,...deactivatedAlarms]}
        ListEmptyComponent={() => renderEmpty()}
        renderItem={( alarm ) => renderItem(alarm)}
        keyExtractor={(alarm) => `${alarm.id}`}
        contentContainerStyle={styles.listView}
        style={styles.flatListWrapper}
      /></ScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginBottom: 5,
    flexDirection:"column",
     height:250
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    justifyContent: "center",
  },
  listView: {
    flex: 1,
    justifyContent: 'center',
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
  flatListWrapper:{
    padding:0,
    margin:0
  }
});
export default Bed;
