import React from "react";
import { StyleSheet, Image, Pressable, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { globalColors,globalStyles } from "../../styles/global";
import {useTheme} from '../../components/theme/ThemeProvider';
import Toast from 'react-native-toast-message';
import {getDeviceIdFromStorage} from "../../utils/phoneStorage";
import { useNavigation } from "@react-navigation/native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import {
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../../components/card";

export default function CardWithButtons(props) {
  const {message,icon,btns,handleAction} = props;
  let timer = null;
  const {colors} = useTheme();
  const navigation = useNavigation();
  const Up="up";
 const Down="down";
 const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};
  const Showtoast =  (data,direction) => {
    //	const {alarmId} = this.state;
        let icon=direction=='up'?'⬆️':'⬇️';
        Toast.show({
          text1:  'Motor',
          text2: data+' '+'moving'+' '+direction+' '+icon
          ,visibilityTime: 5000,
        });
        
      }
      const handleUp =()=>{
        handleAction(btns[0]);

        //console.log("UP");
        timer = setTimeout(handleUp, 100);
      }
      const handleDown =()=>{
        handleAction(btns[1]);
        //console.log("DOWN");
        timer = setTimeout(handleDown, 100);
      }
    
      const stopTimer=()=> {
        clearTimeout(timer);
      }
  return (
    <Card style={styles.cardWrapper} bgColor={colors.card} >
      <View style={styles.wrapper}>
        <View style={styles.arrowWrapper}>
          <Pressable onPressIn={async(e)=>{
            let deviceID = await getDeviceIdFromStorage();
            if(deviceID==null)
            {
              
              Toast.show({
                text1: 'Error😯',
                text2: 'No controller found, please connect to the controller using Bluetooth!'
                ,visibilityTime: 5000,
              });
              setTimeout(() => {
                navigation.navigate('beds'); 
              }, 200);
              
            }
            else 
            {
              handleUp();
              ReactNativeHapticFeedback.trigger("impactHeavy", options);
              //Showtoast(message,Up);
            }
          }	}
          onPressOut={(e) =>stopTimer()} 
          onPress={
            async(e)=>{
              let deviceID = await getDeviceIdFromStorage();
              if(deviceID==null)
              {
                
                Toast.show({
                  text1: 'Error😯',
                  text2: 'No controller found, please connect to the controller using Bluetooth!'
                  ,visibilityTime: 5000,
                });
                setTimeout(() => {
                  navigation.navigate('beds'); 
                }, 200);
              }
              else 
              {
                handleAction(btns[0]);
                ReactNativeHapticFeedback.trigger("impactHeavy", options);
                //Showtoast(message,Up);
              }
              }
            }
            >
              {({ pressed }) => (
            <FontAwesomeIcon
              icon={faChevronCircleUp}
              style={{color:pressed?globalColors.darkBlue:globalColors.blue}}
              size={50}
            />)}
          </Pressable>
        </View>
        <View style={styles.wrapperCenter}>
          <Image style={styles.icon}source={icon} />
        </View>
        <View style={styles.arrowWrapper}>
          <Pressable onPressIn={async(e)=>{
            let deviceID = await getDeviceIdFromStorage();
            if(deviceID==null)
            {
              
              Toast.show({
                text1: 'Error😯',
                text2: 'No controller found, please connect to the controller using Bluetooth!'
                ,visibilityTime: 5000,
              });
              setTimeout(() => {
                navigation.navigate('beds'); 
              }, 200);
              
            }
            else 
            {
              handleDown();
            ReactNativeHapticFeedback.trigger("impactHeavy", options);
            //Showtoast(message,Down)
            }
          }	}
            onPressOut={(e) =>stopTimer()} 
            onPress={ 
              async()=>{
              let deviceID = await getDeviceIdFromStorage();
              if(deviceID==null)
              {
                
                Toast.show({
                  text1: 'Error😯',
                  text2: 'No controller found, please connect to the controller using Bluetooth!'
                  ,visibilityTime: 5000,
                });
                setTimeout(() => {
                  navigation.navigate('beds'); 
                }, 200);
              }
              else 
              {
              handleAction(btns[1]);
              ReactNativeHapticFeedback.trigger("impactHeavy", options);
              }
              //Showtoast(message,Down)
            }}>
            <FontAwesomeIcon
              icon={faChevronCircleDown}
              style={styles.arrow}
              size={50}
            />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardWrapper: { backgroundColor: "grey" },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    justifyContent: "space-between",
  },
  arrowWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    color: globalColors.blue,
  },
  wrapperCenter: {
    width: 120,
    height: 60,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 120,
    height: 60,
  },
});
