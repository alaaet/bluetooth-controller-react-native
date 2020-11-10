import React from "react";
import { Image ,Text,View, StyleSheet} from "react-native";
import { createStackNavigator, HeaderBackground } from "@react-navigation/stack";
import BottomStack from "./bottomStack";
//import DeviceView from "../screens/settings/bluetooth/bt-detailed-view";
import AddAlarm from '../screens/alarms/addAlarm';
import {useTheme} from '../components/theme/ThemeProvider'
import EditMode from "../screens/control/editMode";
const Stack = createStackNavigator();

const RootStack = () => {
  const {colors} = useTheme();
  return(
  <Stack.Navigator>
    <Stack.Screen 
    name="Home" 
    component={BottomStack}  
    options={{ headerTitle: props => <LogoTitle {...props} />, headerStyle: {
          backgroundColor:colors.header
           } }}/>
    {/* <Stack.Screen
      name="DeviceView"
      component={DeviceView}
      options={{ title: "Device View" }}
    /> */}
     <Stack.Screen
      name="AddAlarm"
      component={AddAlarm}
      options={{ title: "AddAlarm", headerStyle: {
        backgroundColor:colors.header        
         },headerTintColor:colors.text  }}
    />
  <Stack.Screen
      name="EditMode"
      component={EditMode}
      options={{ title: "Mode", headerStyle: {
        backgroundColor:colors.header        
         },headerTintColor:colors.text  }}
    />
  </Stack.Navigator>
)};

const LogoTitle=(props)=> {
  return (
    <View style={styles.container}>
    <Image
      style={{ width: 84, height: 50 }}
      source={require('../icons/logo.png')}
    />
  </View>
  );
}
 const styles = StyleSheet.create({
   container:{
     flexDirection: 'row',
     alignItems:"center",  
     
   },
 });
export default RootStack;
