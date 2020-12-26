import React,{useState}  from "react";
import { View, Pressable, StyleSheet,Text } from "react-native";
import Separator from "../../components/separator";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { globalColors } from "../../styles/global";
import {useTheme} from '../../components/theme/ThemeProvider';
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import {getDeviceIdFromStorage} from "../../utils/phoneStorage";


const Mode = (props) => {
  const {item,setSelectedModeId,selectedModeId,setSpinner} = props;
  const {colors} = useTheme();
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.wrapper} >
        <View style={{width:!item.static?130:"100%",backgroundColor:item.id==selectedModeId?globalColors.darkBlue:globalColors.blue}}>
        <Pressable
          style={styles.button}
          onPress={async(e)=>{
            let deviceID = await getDeviceIdFromStorage();
            if(deviceID==null)
            {
              
              Toast.show({
                text1: 'Error😯',
                text2: 'No controller found, please connect to the controller using Bluetooth!',
                visibilityTime: 5000,
              });
              navigation.navigate('beds');
            }
            else 
            {
           await setSelectedModeId(item.id);
           await setSpinner(true);
            Toast.show({
              text1: 'Mode Alert:',
              text2:item.name+`  is Activated👋` 
              ,visibilityTime: 5000,
            });
            }
          
        }}
          
        >
          <Text style={styles.btnText}>{item.name}</Text>
        </Pressable>
        </View>
        {!item.static&&
        <Pressable style={{...styles.wrapper,marginRight:6}} onPress={
          async(e)=>{
            let deviceID = await getDeviceIdFromStorage();
            if(deviceID==null)
            {
              
              Toast.show({
                text1: 'Error😯',
                text2: 'No controller found, please connect to the controller using Bluetooth!'
                ,visibilityTime: 5000,
              });
              navigation.navigate('beds');
            }
            else 
            {
              navigation.navigate('EditMode', {item:item})
            }
          }	}>
          <FontAwesomeIcon icon={faEdit} style={styles.icon} size={30} />
        </Pressable>
        }
      </View>
      {!item.static&&<Separator color={colors.separator} ml={1} mr={1} />}
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
  icon: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: globalColors.blue,    
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],

  },
  button: {
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
