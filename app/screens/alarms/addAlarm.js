import React, {useState} from 'react'
import { View, Text, StyleSheet,Switch, Pressable } from 'react-native'
import DatePicker from 'react-native-date-picker'
import ReactNativeAN from 'react-native-alarm-notification';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-community/async-storage'
import CheckBox from "@react-native-community/checkbox"
import {globalColors} from "../../styles/global"
import Separator from "../../components/separator";
import {AddAlarmPicker} from "../../shared/picker";
import Toast from 'react-native-toast-message';
import {useTheme} from '../../components/theme/ThemeProvider';
let alarmData = {
	active:1,
	title: 'Smoothly Awake!',
	message: 'Mattress is moving!',
	vibrate: true,
	play_sound: true,
	schedule_type: '',
	channel: 'wakeup',
	loop_sound: true,
	has_button: true,
	repeat_interval: '',
	large_icon:"ic_launcher",
	sound_name: "argon.mp3",
	small_icon:"ic_launcher",
	color:globalColors.blue,
};



const AddAlarm = (props) => {
	const {colors} = useTheme();
	const navigation = useNavigation();
	const [selectedProgram, setSelectedProgram] = useState("Program1");
	const [frequency, setFrequency] = useState(0);
	const [isEnabled, setIsEnabled] = useState(true);
	const separatorColor = colors.separator;
	const alarmsPrograms = props.route.params?.alarmsPrograms;
	const ALARMS_PROGRAMS_STORAGE_KEY = "AlarmsPrograms";

	//ToggelSwitch
	const toggleSound = (val) => {
		setIsEnabled(val);
	}
	const [date, setDate] = useState(new Date(Date.now()))
   	
	const saveAlarmsProgramsToStorage = async (programs) => {
		try {
		  if(programs.length>0)
		  await AsyncStorage.setItem(ALARMS_PROGRAMS_STORAGE_KEY,JSON.stringify(programs));
		  console.log("Alarm Program was added to storage memory!");
		} catch (e) {
		  console.warn(e.message)
		}
	  }

	//Set Alarm
	const  setAlarm = async () => {
	alarmData.play_sound=isEnabled;
	alarmData.sound_name=isEnabled?"argon.mp3":"empty.mp3";
	alarmData.volume=0.0;
	console.log("volume "+alarmData.volume)
     if(frequency>0){
	alarmData.schedule_type="repeat" ;
	 }
	 switch (frequency) {
		 case 1:
			alarmData.repeat_interval="daily"
			 break;
		case 2:
			alarmData.repeat_interval="weekly"
			break;
		 default:
			 break;
	 }
	alarmData.fire_date=ReactNativeAN.parseDate(date);
	console.log(`alarm set: ${date}`);
	if( new Date(Date.now())>new Date(date))
    {
	let	newdate=new Date(date);
		newdate.setDate(date.getDate()+1);
		alarmData.fire_date=ReactNativeAN.parseDate(newdate);
		try {
			const alarm = await ReactNativeAN.scheduleAlarm(alarmData);
			console.log("alarm id: ",alarm.id);
			 await saveAlarmsProgramsToStorage([...alarmsPrograms,{alarmId:alarm.id,program:selectedProgram}])
			navigation.goBack();
		} catch (e) {
			Toast.show({
				text1: 'Error😯',
				text2: e
			  });
		}
		/*
		Toast.show({
			text1: 'Error😯',
			text2: "failed to schedule alarm because fire date is in the past"
		  });*/
    }else{
	try {
		const alarm = await ReactNativeAN.scheduleAlarm(alarmData);
		console.log("alarm id: ",alarm.id);
		 await saveAlarmsProgramsToStorage([...alarmsPrograms,{alarmId:alarm.id,program:selectedProgram}])
		navigation.goBack();
	} catch (e) {
		Toast.show({
			text1: 'Error😯',
			text2: e
		  });
	}
}		
		
	};
  
    return (
        <View style={{...styles.container, backgroundColor:colors.background}}>
			<View style={styles.wrapper}>
            	<DatePicker
                date={date} 
                onDateChange={setDate}
				mode="time"
				fadeToColor={colors.Picker}
				textColor= {colors.text}
                />
			</View>
			<Separator color={separatorColor} ml={1} mr={1}/>
			<View style={styles.daysRow}  >
				<View style={styles.daysColumn}>
					<View style={styles.checkboxContainer}>
					<CheckBox 
					value={frequency==0}
					onValueChange={()=>setFrequency(0)}
					style={styles.checkbox}
					tintColors={{ true: globalColors.blue, false: colors.text }}
					/>
					<Text style={{...styles.label,color:colors.text}}>Only today</Text>
					</View>
					<View style={styles.checkboxContainer}>
					<CheckBox 
					value={frequency==1}
					onValueChange={()=>setFrequency(1)}
					style={styles.checkbox}
					tintColors={{ true: globalColors.blue, false: colors.text }}
					/>
					<Text style={{...styles.label,color:colors.text}}>Daily</Text>
					</View>
					<View style={styles.checkboxContainer}>
					<CheckBox 
					value={frequency==2}
					onValueChange={()=>setFrequency(2)}
					style={styles.checkbox}
					tintColors={{ true: globalColors.blue, false: colors.text }}
					/>
					<Text style={{...styles.label,color:colors.text}}>Weekly</Text>
					</View>
				</View>
			</View>
			<Separator color={separatorColor} ml={1} mr={1}/>
			<View style={styles.pickerWrapper}>
				<Text style={{...styles.label,color:colors.text }}>Program: </Text>	
				
				    < AddAlarmPicker selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} />
			
			</View>
			<Separator color={separatorColor} ml={1} mr={1}/>
			<View style={styles.mb}>
				<View style={styles.Switch} >
					<Text style={{...styles.label,color:colors.text}}>Enable Sound</Text>	
					<Switch
					trackColor={{ false: separatorColor, true: globalColors.blue }}
					thumbColor={isEnabled ? globalColors.yellow : globalColors.grey}
						
						onValueChange={(x)=>toggleSound(x)}
						value={isEnabled}
					/>
				</View>
			</View>	
				
			<Pressable style={styles.button}  onPress={()=> setAlarm(alarmData) }><Text style={styles.btnText}>
				Add</Text></Pressable>
        </View>
		
    )
}


const styles = StyleSheet.create({
	container: {	
	  padding: 10,
	  marginBottom: 0,
	  height: "100%"
	},
	wrapper: {
	  flexDirection: "row",
	  alignItems: "center",
	  padding: 0,
	  justifyContent: "center",
	},
	daysRow:{ flexDirection: "row"},
	daysColumn:{flexDirection:"column"},
	checkboxContainer: {
		flexDirection: "row",
		marginHorizontal: 20,
		marginVertical:1,
	
	
	  },
	  checkbox: {
		alignSelf: "center",
	  }, 
	  label: {
		margin: 8,
		fontSize: 17,
		alignSelf:"center"
		
	  },
	  Switch:{
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingLeft:3
	  },
	  pickerWrapper:{flexDirection: "row", paddingRight:3,justifyContent: 'flex-start', alignItems:"center"},
	  programPicker: { height: 50, width: 140, color: globalColors.blue },
	  submitBtn:{
		
		position:'absolute',
		bottom:0,
		
	  },
	  mb:{
       marginBottom:20,
	  },
	  
	button: {
		alignSelf:"center",
         justifyContent:"center",
		width: '100%',
		marginTop: 20,
		backgroundColor : '#2196f3',
		padding: 15,
		borderRadius: 5,
		marginBottom:10,

	  },
	  btnText: {
		color: "white",
		fontSize: 20,
		justifyContent: "center",
		textAlign: "center",
	  },
})

export default AddAlarm