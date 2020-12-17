import React, {useState,useEffect,useRef} from "react";
import { View, Pressable, Text,FlatList,ScrollView, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Alarm from "./alarm";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import { globalColors } from "../../styles/global";
import {checkPermissions,requestPermissions,DeleteAlarm,DeactivateAlarm,ActivateAlarm,GetAlarmsFromPhone,UpdateAlarmProgram,stopAlarmSound} from '../../utils/alarmManager';
import {getDeviceIdFromStorage} from "../../utils/phoneStorage";
import Toast from 'react-native-toast-message';
import Empty from "../../components/empty";
import {readAlarmGroupsFromStorage,saveAlarmGroupsToStorage} from "../../utils/phoneStorage";
import { NativeEventEmitter, NativeModules } from 'react-native';
import {useTheme} from '../../components/theme/ThemeProvider';

const Bed = (props) => {
  const isFirstRun = useRef(true);
  const {colors} = useTheme();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [alarmGroups, setAlarmGroups] = useState([]);
  const [deleteCount, setDeleteCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const { RNAlarmNotification } = NativeModules;
  const RNAlarmEmitter = new NativeEventEmitter(RNAlarmNotification);
  const showPermissions = () => {
		checkPermissions((permissions) => {
			console.log(permissions);
		});
	};

const Permmissions =()=>{

  if (Platform.OS === 'ios') {
    showPermissions();

    requestPermissions({
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
    const init = async()=>{
      setAlarmGroups(await readAlarmGroupsFromStorage()); 
      if (isFirstRun.current) 
      {
        isFirstRun.current = false;
      }     
    }
    init();
    const dismissSubscription = RNAlarmEmitter.addListener(
      'OnNotificationDismissed', async(data) => 
      {
        Toast.show({
          text1: 'Alarm',
          text2:  `The alarm was dismissed! 👋`
        });
        stopAlarmSound();
      });
      console.log("Listener was added");
      return(()=>{
        dismissSubscription.remove();
      });
  },[]);

  // When Alarm Groups change
  useEffect( ()=>{
    console.log("First run value: ",isFirstRun.current);
    console.log("Bed component: Alarm groups: ", alarmGroups)
    if(!isFirstRun.current)
    {
      saveAlarmGroupsToStorage(alarmGroups);
    }
  },[alarmGroups]);

  // When Alarm is deleted or updated
  useEffect(()=>{     
     const init = async()=>{
      setAlarmGroups(await readAlarmGroupsFromStorage());   
    }
    init(); 
  },[deleteCount,updateCount]);

  // When screen is in focus
  useEffect(()=>{   
    if(isFocused)
    {  
      console.log("Bed component is in focus")
      const init = async()=>{
        const alarmsFromSystem = await GetAlarmsFromPhone();
        console.log("alarms From System: ", alarmsFromSystem)
      setAlarmGroups(alarmsFromSystem);  
      }
      init(); 
    }
 },[isFocused]);

  const _addAlarm = async()=>{
    let deviceID = await getDeviceIdFromStorage();
    if(deviceID==null)
    {
      
     Toast.show({
        text1: 'Error😯',
        text2: 'No controller found, please connect to the controller using Bluetooth!'
      });
      setTimeout(() => {
        navigation.navigate('beds');
      }, 100);
     
    }
    else 
    {
      console.log("Device ID: ", deviceID);
      navigation.navigate('AddAlarm');
    }
  }	
  const _deleteAlarm = async (id) => {
		if (id !== '') {
      await DeleteAlarm(id)

      setDeleteCount(deleteCount+1);
      Toast.show({
        text1: 'Alarm',
        text2: 'Alarm deleted! 👋'
      });      
		}
  };

  // VISUAL FUNCTIONS - needed for rendering
  const renderEmpty = () => <Empty hideImage text="No Alarms yet!" />;
  const renderItem = (alarmGroup,index) => {
    //console.log("alarmGroup",alarmGroup)
    return (
<Alarm key={index} alarm={alarmGroup} index={index} deleteAlarm={_deleteAlarm} program={alarmGroup.program} updateProgram={UpdateAlarmProgram} deactivateAlarm={DeactivateAlarm} activateAlarm={ActivateAlarm}/>
    );
  };


  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={{...styles.title,color:colors.text}}>{props.name}</Text>
          <Pressable onPress={_addAlarm }>
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
        {alarmGroups.length>0?(alarmGroups.map((alarmGroup,index)=>renderItem(alarmGroup,index))):renderEmpty()}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginBottom: 5,
    flexDirection:"column",
     //height:250
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
