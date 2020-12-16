import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet,Switch, Pressable } from 'react-native'
import DatePicker from 'react-native-date-picker'
import {parseDate,SetAlarm} from '../../utils/alarmManager';
import { useNavigation } from "@react-navigation/native";
import {getDeviceIdFromStorage} from "../../utils/phoneStorage";
import CheckBox from "@react-native-community/checkbox"
import {globalColors} from "../../styles/global"
import Separator from "../../components/separator";
import {CustomPicker} from "../../components/customPicker";
import Toast from 'react-native-toast-message';
import {useTheme} from '../../components/theme/ThemeProvider';
import {WEEKDAYS,FREQUENCIES,PROGRAMS} from "../../shared/constants";
import{DeleteAlarm} from '../../utils/alarmManager';



export default function EditAlarm(props) {
    const navigation = useNavigation();
    const {colors} = useTheme();    
    const [alarmGroup,setAlarmGroup] = useState(props.route.params?.item);  
    const [selectedProgram, setSelectedProgram] = useState(alarmGroup.alarms[0].program); 
    const [selectedFrequency, setSelectedFrequency] = useState(alarmGroup.alarms[0].frequency);
    const [date, setDate] = useState(new Date(alarmGroup.alarms[0].date));
    const [showWeekDays, setShowWeekDays] = useState(false);
    const [isEnabled, setIsEnabled] = useState(alarmGroup.alarms[0].play_sound);
    const [selectedCustomDays, setSelectedCustomDays] = useState([]);
    const [weekDaysObjs, setWeekDaysObjs] = useState(WEEKDAYS);
    const [deviceId,setDeviceId] = useState(null);
    const separatorColor = colors.separator;
    
    //console.log("Alarm after edit: ",props.route.params?.item)
    let alarmData = {
        active:1,
        id:0,
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
    useEffect(() => {
		const init = async()=>{
			let _deviceID = await getDeviceIdFromStorage();
			if(_deviceID!=null) setDeviceId(_deviceID);
		};	
		init();
		
	}, [])

	useEffect(() => {
		//console.log("Frequency has changed to: ", selectedFrequency)
		setShowWeekDays(selectedFrequency == 'Custom')
    }, [selectedFrequency,selectedCustomDays])

	//ToggelSwitch
	const toggleSound = (val) => {
		setIsEnabled(val);
	}
	
    //Set Alarm
	const  ProcessAlarm = async () => {
		alarmData.play_sound=isEnabled;
		alarmData.sound_name=isEnabled?"argon.mp3":"empty.mp3";
		alarmData.frequency = selectedFrequency;
        alarmData.program = selectedProgram;
        alarmData.volume=0.0;
		//console.log("volume "+alarmData.volume)
		if(selectedCustomDays>0){
		alarmData.schedule_type="repeat" ;
		}
		switch (selectedCustomDays) {
			case 1:
				alarmData.repeat_interval="daily"
				break;
			case 2:
				alarmData.repeat_interval="weekly"
				break;
			default:
				break;
		}
		alarmData.date = date;
		alarmData.hour=date.getHours();
		alarmData.minute=date.getMinutes();
		alarmData.fire_date=parseDate(date);
		console.log(`alarm set: ${date}`);
		if( selectedFrequency !== 'Custom' &&new Date(Date.now())>new Date(date))
		{
		let	newdate=new Date(date);
			newdate.setDate(date.getDate()+1);
			alarmData.date = newdate;
			alarmData.fire_date=parseDate(newdate);
		}
			try {

			let res = await SetAlarm(deviceId,alarmData,weekDaysObjs);
				
			
			} catch (e) 
			{
                console.log("edit alarm screen, processAlarm function: ",e)
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
			<View style={styles.pickerWrapper}>
				<Text style={{...styles.label,color:colors.text }}>Repeat: </Text>	
				
				    < CustomPicker selectedOption={selectedFrequency} setSelectedOption={setSelectedFrequency} options={FREQUENCIES}/>
			
			</View>
			{showWeekDays&&<View style={styles.daysRow}  >
				<View style={styles.daysColumn}>
				{WEEKDAYS.map((day,index)=>{if(index<4)
				return(
					<View style={styles.checkboxContainer} key={index.toString()}>
						<CheckBox 	
						disabled={false}					
						onValueChange={(val)=>{
							let days = [];
							weekDaysObjs.forEach(dayObj=>{
							if(dayObj.name==day.name)
							{ dayObj.isSelected=val;
							}
							days.push(dayObj);
						}
						)
						setWeekDaysObjs(days)}}
						value={weekDaysObjs.find(element => element.name == day.name)?.isSelected}
						style={styles.checkbox}
						tintColors={{ true: globalColors.blue, false: colors.text }}
						/>
						<Text style={{...styles.label,color:colors.text}}>{day.name}</Text>
					</View>
				)})}					
				</View>
				<View style={styles.daysColumn}>
				{weekDaysObjs.map((day,index)=>{if(index>=4)
				return(
					<View style={styles.checkboxContainer} key={index.toString()}>
						<CheckBox 	
						disabled={false}					
						onValueChange={(val)=>{
							let days = [];
							weekDaysObjs.forEach(dayObj=>{
							if(dayObj.name==day.name)
							{ dayObj.isSelected=val;
							}
							days.push(dayObj);
						}
						)
						setWeekDaysObjs(days)}}
						value={weekDaysObjs.find(element => element.name == day.name)?.isSelected}
						style={styles.checkbox}
						tintColors={{ true: globalColors.blue, false: colors.text }}
						/>
						<Text style={{...styles.label,color:colors.text}}>{day.name}</Text>
					</View>
				)})}					
				</View>
			</View>}
			<Separator color={separatorColor} ml={1} mr={1}/>
			<View style={styles.pickerWrapper}>
				<Text style={{...styles.label,color:colors.text }}>Movement Model: </Text>	
				
				    < CustomPicker selectedOption={selectedProgram} setSelectedOption={setSelectedProgram} options={PROGRAMS}/>
			
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
     


     
      <Pressable style={styles.button} backgroundColor = {globalColors.blue}  onPress={async()=>{
          //await saveBedToStorage(bed);
          await DeleteAlarm(alarmGroup.id);//_deleteAlarm(alarmId)
         await ProcessAlarm(alarmData);
          navigation.goBack();
          } }><Text style={styles.btnText}>
				Save</Text></Pressable>
        </View>
  )
}

const styles = StyleSheet.create({
    container: {	
        padding: 10,
        marginBottom: 0,
        height: "100%"
      },
    input: {
        fontSize:25,
        color: '#555555',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 5,
        width: '100%', 
        borderBottomColor: globalColors.blue,
        borderBottomWidth: 1,
        alignSelf: 'center',
        backgroundColor: '#ffffff'
    },
    button: {
        alignSelf:"center",
            justifyContent:"center",
        width: '100%',
       
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
          
      
          
        },
        mb:{
         marginBottom:20,
        },
})