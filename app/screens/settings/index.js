import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./settingsIndex";
import BluetoothList from "./bluetooth/bluetoothScreen";
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
    </Stack.Navigator>
  );
};

export default HomeStack;
