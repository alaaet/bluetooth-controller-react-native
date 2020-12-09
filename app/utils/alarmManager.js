import ReactNativeAN from 'react-native-alarm-notification';
import {WEEKDAYS,FREQUENCIES,PROGRAMS,START,END,TYPE,COMMAND,LENGTH1,LENGTH2,CHECKSUM,CONTROLLER_PROGRAM} from '../shared/constants';
import {saveAlarmGroupsToStorage,readAlarmGroupsFromStorage,getDeviceIdFromStorage} from './phoneStorage';
import {sendToPeripheral,decimalToHex,hexToBase64} from './bleManager';


export const SetAlarm = async(deviceId,alarmData,weekDays)=>{
    //console.log("alarmData",alarmData);
    let alarmDate= alarmData.date;
    let scenario;
    let alarmGroups = await readAlarmGroupsFromStorage();
    const count = alarmGroups.length;
    let newAlarmGroup = {id:alarmGroups.length,type:alarmData.frequency,program:alarmData.program,isActive:true,hour:alarmData.hour,minute:alarmData.minute,alarms:[]};
    let dayIndex = alarmData.date.getDay()-1;			
    let day = decimalToHex(WEEKDAYS[dayIndex].dow);
    let idObj = 0;
    const clone = (obj)=> {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
    switch(alarmData.program){
        case PROGRAMS[0].value:
            scenario='00';
            break;
        case PROGRAMS[1].value:
            scenario='01';
            break;
        case PROGRAMS[2].value:
            scenario='02';
            break;
        case PROGRAMS[3].value:
            scenario='03';
            break;
        case PROGRAMS[4].value:
            scenario='04';
            break;
        default:
            break;


    }

    switch (alarmData.frequency) {
        case FREQUENCIES[0].value: // ONCE
            alarmData.schedule_type="once"
            idObj=  await scheduleAlarm(alarmData);
            //console.log("id",idObj.id)
            alarmData.id =  idObj.id;
            newAlarmGroup.alarms.push(alarmData);
            //console.log("alarmGroups",newAlarmGroup)
            break;
        case FREQUENCIES[1].value: // DAILY
            alarmData.schedule_type="repeat";
            alarmData.repeat_interval="daily";
            idObj=  await scheduleAlarm(alarmData);
            //console.log("id",idObj.id)
            alarmData.id =  idObj.id;
            newAlarmGroup.alarms.push(alarmData);
            day = "7f"
            break;
        case FREQUENCIES[2].value: // WEEKLY
            alarmData.schedule_type="repeat";
            alarmData.repeat_interval="weekly";
            idObj=  await scheduleAlarm(alarmData);
            //console.log("id",idObj.id)
            alarmData.id =  idObj.id;
            newAlarmGroup.alarms.push(alarmData);
            break;
        case FREQUENCIES[3].value: //CUSTOM
            alarmData.schedule_type="repeat";
            alarmData.repeat_interval="daily";
            let selectedDays = weekDays.filter(day=>day.isSelected);
            let total = 0;
            selectedDays.forEach(day=>total+=day.dow);
            //console.log("selectedDays",selectedDays)
            day = decimalToHex(total);
            let today = WEEKDAYS[(new Date(Date.now())).getDay()-1];
            selectedDays.forEach(async day=>{
                alarmData.date=alarmDate;
                alarmData.fire_date=alarmDate;
                let alarm = clone(alarmData);
                
                //console.log("alarm",alarm)
                //console.log("day of week:",day.dow)
                //console.log("Today is equal to date:",today.dow == day.dow)
                if(today.dow>day.dow)
                {
                    
                    let diff = 7-(today.index-day.index);
                    //console.log("diff",diff)
                    let	newdate=new Date(alarm.date);
                    newdate.setDate(alarm.date.getDate()+diff);
                    //console.log("newdate",newdate)

                    alarm.date = newdate;
                    alarm.fire_date=parseDate(newdate);
                }
                else 
                if(today.dow<day.dow)
                {
                    let diff = day.index-today.index;
                    //console.log("diff",diff)
                    let	newdate=new Date(alarm.date);
                    newdate.setDate(alarm.date.getDate()+diff);
                    //console.log("newdate",newdate)
                    alarm.date = newdate;
                    alarm.fire_date=parseDate(newdate);
                }
                else{
                    let	newdate=new Date(alarm.date);
                    newdate.setDate(alarm.date.getDate());
                    //console.log("newdate",newdate)
                    alarm.date = newdate;
                    alarm.fire_date=parseDate(newdate);
                }
                idObj=  await scheduleAlarm(alarm);              
                alarm.id =  idObj.id;
                //console.log("NEW ALARM INSTANCE:" , alarm)
                newAlarmGroup.alarms.push(alarm);
            });
            break;
        default:
            break;
    }
    //console.log("alarmGroups",newAlarmGroup)
    // SEND ALARM TO CONTROLLER
    await sendAlarmToController(deviceId,alarmData,day,scenario);
    // SAVE TO STORAGE
    await saveAlarmGroupsToStorage([...alarmGroups,newAlarmGroup]);
    //console.log("alarmGroups",alarmGroups)
    return newAlarmGroup;
}

export const DeleteAlarm = async (alarmGroupId)=>{
    //console.log("Deleting alarm group with id: " ,alarmGroupId);
    let alarmGroups = await readAlarmGroupsFromStorage();
    let alarmGroupToBeDeleted = alarmGroups.find(alarmGroup=>alarmGroup.id==alarmGroupId);
    if(alarmGroupToBeDeleted !=null)
    {
        alarmGroupToBeDeleted.alarms.forEach(async alarm=>{
            const alarmId = parseInt(alarm.id, 10);
            console.log("Deleting alarm :",alarm.id)
            await ReactNativeAN.deleteAlarm(alarmId);
        });
    }
    else 
    {
        throw new Error('The alarm you are trying to delete does not exist');
    }
    //console.log("type of alarmGroupId", typeof alarmGroupId);
    const newArr = alarmGroups.filter(alarmGroup=>alarmGroup.id!=alarmGroupId);
    //console.log("alarmGroups after delete:", newArr);
    await saveAlarmGroupsToStorage(newArr);
    await GetAlarmsFromPhone();
}

export const DeactivateAlarm = async(_alarmGroup)=>{
    //console.log("Deactivating alarm group with id: " ,_alarmGroup.id);
    // Set alarm group as inactive in storage and delete subsequent alarms from phone
    let alarmGroups = await readAlarmGroupsFromStorage();
    let alarmGroupToBeDeactivated = alarmGroups.find(alarmGroup=>alarmGroup.id==_alarmGroup.id);
    if(alarmGroupToBeDeactivated !=null)
    {
        alarmGroupToBeDeactivated.alarms.forEach(async alarm=>{
            const alarmId = parseInt(alarm.id, 10);
            await deleteAlarm(alarmId);
        });
    }
    else 
    {
        throw new Error('The alarm you are trying to deactivate does not exist');
    }
    alarmGroups = alarmGroups.map(alarmGroup=>{
        if(alarmGroup.id == _alarmGroup.id) {
            alarmGroup.isActive = false;
        }
        return alarmGroup;
    });
    await saveAlarmGroupsToStorage(alarmGroups);
}

export const ActivateAlarm = async(_alarmGroup)=>{
    //console.log("Activating alarm group with id: " ,_alarmGroup.id);
    // Set alarm group as active in storage and schedule subsequent alarms to phone
    let alarmGroups = await readAlarmGroupsFromStorage();
    let alarmGroupToBeActivated = alarmGroups.find(alarmGroup=>alarmGroup.id==_alarmGroup.id);
    if(alarmGroupToBeActivated !=null)
    {
        alarmGroupToBeActivated.alarms.forEach(async alarm=>{
            await scheduleAlarm(alarm);
        });
    }
    else 
    {
        throw new Error('The alarm you are trying to activate does not exist');
    }
    alarmGroups = alarmGroups.map(alarmGroup=>{
        if(alarmGroup.id == _alarmGroup.id) {
            alarmGroup.isActive = true;
        }
        return alarmGroup;
    });
    await saveAlarmGroupsToStorage(alarmGroups);
}

export const GetAlarmsFromPhone= async()=>{
    let alarmGroups = await readAlarmGroupsFromStorage();
    const list = await getScheduledAlarms();
    // loop though the list and activate matching alarm groups
    if(list!=null) 
    {
      list.forEach(element => {
        alarmGroups.forEach(alarmGroup=>{
            alarmGroup.isActive = false;
            alarmGroup.alarms.forEach(alarm=>{
                if (alarm.id == element.id){
                    alarmGroup.isActive = true;
                }
            })
        })
      });
      await saveAlarmGroupsToStorage(alarmGroups);
      //console.log("Alarms were read from phone system!", list);
    }
  }

export const UpdateAlarmProgram = async(alarmGroupId, program)=>{
    let alarmGroups = await readAlarmGroupsFromStorage();
    alarmGroups = alarmGroups.map(alarmGroup=>{
        if(alarmGroup.id == alarmGroupId) {
            alarmGroup.program = program;
        }
        return alarmGroup;
    });
    await saveAlarmGroupsToStorage(alarmGroups);
    //console.log("Alarm program was updated!");
}


/**HELPERS */

	//set alarm controller
	const sendAlarmToController=async(deviceId,alarm,day,scenario)=>{
        console.log("FIRE_DATE IS: ",alarm.fire_date)
		//const controlDate=  (alarm.fire_date).split(" ")[1];
		//let hour =parseInt(controlDate.split(":")[0]) ;
        //let minute =parseInt(controlDate.split(":")[1]);
        let hour = alarm.hour;
        let minute = alarm.minute;
		let hexHour=decimalToHex(hour);
		let hexminute=decimalToHex(minute);		
		var base64String =hexToBase64(START+TYPE+COMMAND+LENGTH1+LENGTH2+CHECKSUM+scenario+day+hexHour+hexminute+END); 
		await sendToPeripheral(deviceId,base64String);
    }
    

export const {parseDate, scheduleAlarm , checkPermissions,requestPermissions,stopAlarmSound,deleteAlarm ,getScheduledAlarms} = ReactNativeAN;