import React from "react";
import { Image ,Text,View, StyleSheet} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "./splash";
import BottomStack from "./bottomStack";
import DeviceView from "../screens/settings/bluetooth/bt-detailed-view";
const Stack = createStackNavigator();

const RootStack = () => {
  return(
  <Stack.Navigator>
    <Stack.Screen name="Home" component={BottomStack}  options={{ headerTitle: props => <LogoTitle {...props} /> }}/>
    <Stack.Screen name="splash" component={Splash} />
    <Stack.Screen
      name="DeviceView"
      component={DeviceView}
      options={{ title: "Device View" }}
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
     alignItems:"center"     
   },
 });
export default RootStack;
