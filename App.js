import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomStack from "./app/navigation/bottomStack";
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <BottomStack />
    </NavigationContainer>
  );
};

export default App;
