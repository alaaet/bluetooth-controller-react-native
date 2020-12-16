import React from "react";
import { Image ,Text,View, StyleSheet} from "react-native";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import BottomStack from "./bottomStack";
import AddAlarm from '../screens/alarms/addAlarm';
import {useTheme} from '../components/theme/ThemeProvider'
import EditMode from "../screens/control/editMode";
import BluetoothScreen from '../screens/settings/bluetooth/bluetoothScreen';
import General from '../screens/settings/general';
import GenerateCommand from '../screens/settings/bluetooth/manualCommand';
import Help from '../screens/settings/help';
import Edit from '../screens/beds/edit';
import EditAlarm from'../screens/alarms/editAlarm';


const Stack = createStackNavigator();

const RootStack = () => {
  const {colors} = useTheme();
  const opt = ()=>({ 
    headerTitle: props => <LogoTitle {...props} />, 
    headerStyle: {backgroundColor:colors.header},
    headerLeft: (props) => (
      <HeaderBackButton
        {...props}
      />
    ), });
  return(
  <Stack.Navigator>
    <Stack.Screen 
    name="Home" 
    component={BottomStack}  
    options={{ headerTitle: props => <LogoTitle {...props} />, headerStyle: {
          backgroundColor:colors.header
           } }}/>
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
    <Stack.Screen
      name="Edit"
      component={Edit}
      options={{ title: "Bed", headerStyle: {
        backgroundColor:colors.header        
         },headerTintColor:colors.text  }}
    />
    <Stack.Screen
      name="EditAlarm"
      component={EditAlarm}
      options={{ title: "EditAlarm", headerStyle: {
        backgroundColor:colors.header        
         },headerTintColor:colors.text  }}
    />
      <Stack.Screen
        name="Bluetooth"
        component={BluetoothScreen}
        options={opt}/>
        <Stack.Screen
        name="General"
        component={General}
        options={opt}/>
           <Stack.Screen
        name="GenerateCommand"
        component={GenerateCommand}
        options={opt}/>
      <Stack.Screen
        name="Help"
        component={Help}
        options={opt}/>
   
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
