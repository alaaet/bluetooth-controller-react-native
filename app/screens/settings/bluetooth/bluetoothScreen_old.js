import React, { useState, useEffect } from "react";
import { FlatList,View } from "react-native";
import Layout from "../../../components/bluetooth-list-layout";
import Empty from "../../../components/empty";
import Toggle from "../../../components/toggle";
import Subtitle from "../../../components/subtitle";
import Device from "../../../components/device";
import BluetoothSerial from "react-native-bluetooth-serial-next";
import { useNavigation } from "@react-navigation/native";
import {globalStyles} from '../../../styles/global';
import {useTheme} from '../../../components/theme/ThemeProvider';

function BluetoothList(props) {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [list, setList] = useState([]);
  const [bolEnable, setBolEnable] = useState(false);
  const renderEmpty = () => <Empty text="This page is clean" />;
  const renderItem = (item) => {
    return (
      <Device 
        {...item}
        iconLeft={require("../../../icons/bt-device.png")}
        iconRight={require("../../../icons/gear.png")}
        onPress={() => {
          console.log(item);
          navigation.navigate("DeviceView", { title: "test", body: "test" });
        }}
      />
    );
  };

  useEffect(() => {
    async function init() {
      const enable = await BluetoothSerial.requestEnable();
      const list = await BluetoothSerial.list();
      console.log(list);
      setBolEnable(enable);
      setList(list);
    }
    init();
    return () => {
      async function remove() {
        await BluetoothSerial.stopScanning();
        console.log("Finished scanning");
      }
      remove();
    };
  }, []);

  const toggleBluetooth = (value) => {
    console.log("bluetooth is: ", value);
    if (value) {
      return enableBluetooth();
    }
    disableBluetooth();
  };
  const enableBluetooth = async () => {
    try {
      const enable = await BluetoothSerial.requestEnable();
      const list = await BluetoothSerial.list();
      console.log(list);
      setBolEnable(enable);
      setList(list);
    } catch (error) {
      console.log(error);
    }
  };
  const disableBluetooth = () => {
    try {
      BluetoothSerial.disable();
      BluetoothSerial.stopScanning();
      setBolEnable(false);
      setList([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{...globalStyles.container, backgroundColor:colors.background}} >
    <Layout title="Bluetooth">
      <Toggle value={bolEnable} onValueChange={toggleBluetooth} />
      <Subtitle title="Devices List" />
      <FlatList 
        data={list}
        ListEmptyComponent={() => renderEmpty()}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
      />
    </Layout>
    </View>
  );
}
export default BluetoothList;
