import React, {useState, useEffect }   from 'react'
import {
  StyleSheet,
  View,
  Text,
  Switch ,
  Pressable
} from 'react-native';
import { globalStyles, globalColors } from '../../styles/global';
import {useTheme} from '../../components/theme/ThemeProvider';
import Separator from "../../components/separator";
import {useIsFocused } from "@react-navigation/native";
import {sendToPeripheral,hexToBase64,decimalToHex} from "../../utils/bleManager";
import {getDeviceIdFromStorage} from "../../utils/phoneStorage";
import{START,END,TYPE,COMMAND,LENGTH1,LENGTH2,CHECKSUM,SET_TIME} from '../../../shared/constants'
function  General () {
  const isFocused = useIsFocused();
  const [deviceId,setDeviceID] = useState([]);
  const {colors, isDark, setScheme} = useTheme();
  const text = isDark ? 'Dark mode 🌙' : 'Light mode 🌞';
  const separatorColor = colors.separator;
  const toggleScheme = () => {
    isDark ? setScheme('light') : setScheme('dark');
  }

  useEffect( ()=>{    
    setDeviceID(getDeviceIdFromStorage());
  },[isFocused]);


 const SetTime=async()=>{
   let date=new Date(Date.now());
   let year=decimalToHex(date.getFullYear()%2000);
   let month=decimalToHex((date.getMonth())+1);
   let Dow=decimalToHex(date.getDay())
   let day=decimalToHex(date.getDate());
   let hour=decimalToHex(date.getHours());
   let minute=decimalToHex(date.getMinutes());
   let seconds=decimalToHex(date.getSeconds());
   var base64String =hexToBase64(START+TYPE+COMMAND+LENGTH1+LENGTH2+CHECKSUM+SET_TIME+seconds+minute+hour+Dow+day+month+year+END);
   const DeviceId =await getDeviceIdFromStorage();
   await sendToPeripheral(DeviceId,base64String);

 }

  return (
    <View style={{...globalStyles.container, backgroundColor:colors.background ,flex:4}}> 
      <View style={styles.content}>
        <Text style={{...globalStyles.titleText,color:colors.text}}>Controller Time
        </Text>
        <Separator color={separatorColor} ml={1} mr={1}/>

          <View style={{flex:4}}>
            <Pressable style={styles.button}  onPress={()=>SetTime()} ><Text style={styles.btnText}>
              Reset Controller Time</Text></Pressable>
              </View>
        </View>  
    
      <View style={styles.content}>
        <Text style={{...globalStyles.titleText,color:colors.text}}>Theme
        </Text>
        <Separator color={separatorColor} ml={1} mr={1}/>
        <View style={styles.switchWrapper}>
          <Switch 
          trackColor={{ false: globalColors.blue, true: globalColors.blue }}
          thumbColor={isDark ? globalColors.yellow : globalColors.yellow}
          value={isDark} onValueChange={toggleScheme}/> 
          <View style={{...styles.messagecontainer, borderColor: colors.primary , borderColor: colors.primary}}>
              <Text style={{...styles.messagestyle, color: colors.text, }}>{text}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({  

  wrapper:{
    flex:4,
    justifyContent: 'center',
  },
  switchWrapper:{
    flex:4,
    justifyContent: 'flex-start',
    alignItems: 'center',    
  }, 
  messagestyle:{
    fontSize: 18,
  },
  messagecontainer:{
    margin: 24,
    padding: 12,
    borderRadius: 4,
    borderWidth: 2,        
  },
  button: {
		alignSelf:"center",
         justifyContent:'flex-start',
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
    content:{
      marginVertical:20,
      flex:2
    }
});

export default General;
