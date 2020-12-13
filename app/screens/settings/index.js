import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Pressable} from "react-native";
import Home from "./settingsIndex";
import General from './general'
import BluetoothList from "./bluetooth/bluetoothScreen";
import DeviceView from "./bluetooth/bt-detailed-view";
import GenerateCommand from './bluetooth/manualCommand';
import Help from '../settings/help';
import {useTheme} from '../components/theme/ThemeProvider';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
 faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
const Stack = createStackNavigator();

const HomeStack = () => {
  const {colors, isDark, setScheme} = useTheme();
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
        options={{ headerTitle: props => <LogoTitle {...props} />, headerStyle: {
          backgroundColor:colors.header
           }, headerLeft:  <Pressable  onPress={() => navigation.goBack()}>
           <FontAwesomeIcon
             icon={faArrowLeft}
             size={50}
           />
         </Pressable> }}
         
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
       <Stack.Screen
        name="Help"
        component={Help}
        options={{ title: " Help" }}
      />
    </Stack.Navigator>
    
  );
};

export default HomeStack;
