import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home";
import BluetoothList from "../screens/settings/bluetooth/bluetoothScreen";
import DeviceView from "../screens/settings/bluetooth/bt-detailed-view";
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Bluetooth"
        component={BluetoothList}
        options={{ title: "Bluetooth List" }}
      />
      <Stack.Screen
        name="DeviceView"
        component={DeviceView}
        options={{ title: "Device View" }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
