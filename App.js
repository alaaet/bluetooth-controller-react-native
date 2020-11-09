import React,{ useEffect,Component } from "react";
import { StatusBar} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RootStack from "./app/navigation/rootStack";
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {AppearanceProvider} from 'react-native-appearance';
import {ThemeProvider} from './app/components/theme/ThemeProvider';

const Stack = createStackNavigator();
const App = () => {
  
  useEffect(()=>{
    SplashScreen.hide();
  },[]);
  return (
    <AppearanceProvider>
      <ThemeProvider>
        <NavigationContainer>
          <RootStack />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </ThemeProvider>
    </AppearanceProvider>
  );
};

export default App;
