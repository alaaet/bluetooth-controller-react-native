import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "./splash";
import BottomStack from "./bottomStack";

const Stack = createStackNavigator();
const RootStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={BottomStack} />
    <Stack.Screen name="splash" component={Splash} />
  </Stack.Navigator>
);
export default RootStack;
