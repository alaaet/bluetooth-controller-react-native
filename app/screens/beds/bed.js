import React from "react";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit ,faWindowClose} from "@fortawesome/free-solid-svg-icons";
import { globalColors } from "../../styles/global";



export default function Bed(props) {

  return (
  
      <View style={styles.wrapper}>
        <Pressable  style={styles.btnWrapper} onPress={()=>{props.bedEdit()}}>
        <FontAwesomeIcon icon={faEdit} style={styles.icon} size={35} />
        </Pressable>
        <View style={styles.bedwrapper}>
          <ScrollView style={styles.bedNameWrapper}>
            <Text style={styles.reading}>{props.name}</Text>
           </ScrollView>
           <Text style={{fontSize:18 ,color:globalColors.white}}>{props.device}</Text>
        </View>
        <Pressable style={styles.btnWrapper} onPress={()=>{props.disconnect()}}>
        <FontAwesomeIcon icon={faWindowClose} style={styles.icon} size={35} />
        </Pressable>
      </View>
    
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
   
  },
  btnWrapper:{
    width: "20%"
  },
  bedwrapper: {
    flexDirection: "column",
    width: "60%",     
  },
  bedNameWrapper:{
    maxHeight: 80, 
  },
  reading: { fontSize: 35, color: globalColors.yellow },
  icon: { color: globalColors.white, margin: 5 },
});
