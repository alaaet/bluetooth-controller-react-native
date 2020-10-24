import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "./splash";
import BottomStack from "./bottomStack";
import DeviceView from "../screens/settings/bluetooth/bt-detailed-view";

const Stack = createStackNavigator();
const RootStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={BottomStack} />
    <Stack.Screen name="splash" component={Splash} />
    <Stack.Screen
      name="DeviceView"
      component={DeviceView}
      options={{ title: "Device View" }}
    />
  </Stack.Navigator>
);
export default RootStack;
