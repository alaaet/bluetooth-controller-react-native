import React,{ useEffect,Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RootStack from "./app/navigation/rootStack";
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();
const App = () => {
  
  useEffect(()=>{
    SplashScreen.hide();
  },[]);
  return (
    
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
   
  );
};

export default App;
