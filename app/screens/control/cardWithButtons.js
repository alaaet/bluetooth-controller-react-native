import React from "react";
import { StyleSheet, Image, Pressable, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { globalColors,globalStyles } from "../../styles/global";
import {useTheme} from '../../components/theme/ThemeProvider';
import Toast from 'react-native-toast-message';

import {
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../../components/card";

export default function CardWithButtons(props) {
  const {message,icon,btns,handleAction} = props;
  let timer = null;
  const {colors} = useTheme();
  const Up="up";
 const Down="down";
  const Showtoast =  (data,direction) => {
    //	const {alarmId} = this.state;
        let icon=direction=='up'?'⬆️':'⬇️';
        Toast.show({
          text1:  'Motor',
          text2: data+' '+'moving'+' '+direction+' '+icon
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
          <Pressable onPressIn={(e) =>{handleUp();Showtoast(message,Up)}} onPressOut={(e) =>stopTimer()} onPress={()=>{handleAction(btns[0]);Showtoast(message,Up)}}>
            <FontAwesomeIcon
              icon={faChevronCircleUp}
              style={styles.arrow}
              size={50}
            />
          </Pressable>
        </View>
        <View style={styles.wrapperCenter}>
          <Image style={styles.icon}source={icon} />
        </View>
        <View style={styles.arrowWrapper}>
          <Pressable onPressIn={() =>{handleDown();Showtoast(message,Down)}} onPressOut={(e) =>stopTimer()} onPress={()=>{handleAction(btns[1]);Showtoast(message,Down)}}>
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
