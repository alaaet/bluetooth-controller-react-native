import React from "react";
import { StyleSheet } from "react-native";
import Control from "../screens/control";
import Alarms from "../screens/alarms";
import Beds from "../screens/beds";
import Co2 from "../screens/co2";
import Settings from "../screens/settings";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCog,
  faSort,
  faBell,
  faBed,
  faWind,
} from "@fortawesome/free-solid-svg-icons";

const Tab = createMaterialBottomTabNavigator();

const BottomStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="control"
        component={Control}
        options={{
          tabBarLabel: "Control",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faSort}
              style={style.icon}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="alarms"
        component={Alarms}
        options={{
          tabBarLabel: "Alarms",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faBell}
              style={style.icon}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="beds"
        component={Beds}
        options={{
          tabBarLabel: "My Beds",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faBed}
              style={style.icon}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="co2"
        component={Co2}
        options={{
          tabBarLabel: "CO2",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faWind}
              style={style.icon}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faCog}
              style={style.icon}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const style = StyleSheet.create({
  icon: {},
});
export default BottomStack;
