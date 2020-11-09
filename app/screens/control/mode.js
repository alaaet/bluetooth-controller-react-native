import React,{useState}  from "react";
import { View, Pressable, StyleSheet,Text } from "react-native";
import Separator from "../../components/separator";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { globalColors } from "../../styles/global";
import {useTheme} from '../../components/theme/ThemeProvider';
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';

const Mode = (props) => {
  const {item,setSelectedModeId,selectedModeId} = props;
  const {colors} = useTheme();
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.wrapper} >
        <View style={{...styles.btnWrapper,backgroundColor:item.id==selectedModeId?"#6993b5":globalColors.blue}}>
        <Pressable
          style={styles.button}
          onPress={()=>{
            setSelectedModeId(item.id);
            Toast.show({
              text1: 'Mode Alert:',
              text2: 'Selected Mode is: '+item.name+`👋` 
            });
          }}
          
        >
          <Text style={styles.btnText}>{item.name}</Text>
        </Pressable>
        </View>
        <Pressable style={{...styles.wrapper,marginRight:6}} onPress={() => navigation.navigate('EditMode', {item:item})}>
          <FontAwesomeIcon icon={faEdit} style={styles.icon} size={30} />
        </Pressable>
      </View>
      <Separator color={colors.separator} ml={1} mr={1} />
    </>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    justifyContent: "space-between",
  },
  btnWrapper: {
    width: 130,      
  },
  icon: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#3C99DC",    
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],

  },
  button: {
    width: 130,
   
    paddingVertical:10,
    paddingHorizontal:6,
    borderRadius:5
    
  },
  btnText: {
    color: globalColors.yellow,
    fontSize: 18,
    justifyContent: "center",
    textAlign: "center",
  },
});

export default Mode;
