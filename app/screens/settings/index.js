import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./settingsIndex";
import General from './general'
import BluetoothList from "./bluetooth/bluetoothScreen";
import DeviceView from "./bluetooth/bt-detailed-view";
import GenerateCommand from './bluetooth/manualCommand'
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} options={{ title: "Home" }} />
      <Stack.Screen
        name="Bluetooth"
        component={BluetoothList}
        options={{ title: "Bluetooth List" }}
      />
      <Stack.Screen
        name="General"
        component={General}
        options={{ title: "General Settings" }}
      />
      <Stack.Screen
        name="DeviceView"
        component={DeviceView}
        options={{ title: "Device View" }}
      />
       <Stack.Screen
        name="GenerateCommand"
        component={GenerateCommand}
        options={{ title: "Manual Command" }}
      />
    </Stack.Navigator>
    
  );
};

export default HomeStack;
