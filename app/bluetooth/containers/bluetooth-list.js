import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView,
} from "react-native";
import Layout from "../components/bluetooth-list-layout";
import Empty from "../components/empty";
import Toggle from "../components/toggle";
import Subtitle from "../components/subtitle";
import BleManager from "react-native-ble-manager";
import Device from "../components/device";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class BluetoothList extends Component {
  constructor() {
    super();

    this.state = {
      bolEnable: false,
      scanning: false,
      peripherals: new Map(),
      appState: "",
    };
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(
      this
    );
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(
      this
    );
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.handleUpdateBluetoothState = this.handleUpdateBluetoothState.bind(
      this
    );
  }

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);

    BleManager.start({ forceLegacy: true });

    this.handlerDiscover = bleManagerEmitter.addListener(
      "BleManagerDiscoverPeripheral",
      this.handleDiscoverPeripheral
    );
    this.handlerStop = bleManagerEmitter.addListener(
      "BleManagerStopScan",
      this.handleStopScan
    );
    this.handlerDisconnect = bleManagerEmitter.addListener(
      "BleManagerDisconnectPeripheral",
      this.handleDisconnectedPeripheral
    );
    this.handlerUpdate = bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      this.handleUpdateValueForCharacteristic
    );
    this.handlerUpdate = bleManagerEmitter.addListener(
      "BleManagerDidUpdateState",
      this.handleUpdateBluetoothState
    );

    BleManager.checkState(); // checks the state upon start

    if (Platform.OS === "android" && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ).then((result) => {
        if (result) {
          console.log("Location Permission is OK");
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
          ).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }
    if (Platform.OS === "android" && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ).then((result) => {
        if (result) {
          console.log("Storage Permission is OK");
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          ).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }
  }

  handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log("Connected peripherals: " + peripheralsArray.length);
      });
    }
    this.setState({ appState: nextAppState });
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
    }
    console.log("Disconnected from " + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log(
      "Received data from " +
        data.peripheral +
        " characteristic " +
        data.characteristic,
      data.value
    );
  }

  handleUpdateBluetoothState(args) {
    // The new state: args.state
    if (args.state === "on") {
      this.setState({ bolEnable: true });
    } else this.setState({ bolEnable: false });
  }

  handleStopScan() {
    console.log("Scan is stopped");
    this.setState({ scanning: false });
  }

  startScan() {
    if (!this.state.scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.scan([], 3, true).then((results) => {
        console.log("Scanning...");
        this.setState({ scanning: true });
      });
    }
  }

  /*
  retrieveConnected() {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log("No connected peripherals");
      }
      console.log(results);
      var peripherals = this.state.peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
      }
    });
  }*/

  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals;
    console.log("Got ble peripheral", peripheral);
    if (!peripheral.name) {
      peripheral.name = peripheral.id;
    }
    peripherals.set(peripheral.id, peripheral);
    this.setState({ peripherals });
  }

  test(peripheral) {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id)
          .then(() => {
            let peripherals = this.state.peripherals;
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              this.setState({ peripherals });
            }
            console.log("Connected to " + peripheral.id);

            setTimeout(() => {
              /* Test read current RSSI value
              BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                console.log('Retrieved peripheral services', peripheralData);
  
                BleManager.readRSSI(peripheral.id).then((rssi) => {
                  console.log('Retrieved actual RSSI value', rssi);
                });
              });*/

              // Test using bleno's pizza example
              // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
              BleManager.retrieveServices(peripheral.id).then(
                (peripheralInfo) => {
                  console.log(peripheralInfo);
                  var service = "13333333-3333-3333-3333-333333333337";
                  var bakeCharacteristic =
                    "13333333-3333-3333-3333-333333330003";
                  var crustCharacteristic =
                    "13333333-3333-3333-3333-333333330001";

                  setTimeout(() => {
                    BleManager.startNotification(
                      peripheral.id,
                      service,
                      bakeCharacteristic
                    )
                      .then(() => {
                        console.log("Started notification on " + peripheral.id);
                        setTimeout(() => {
                          BleManager.write(
                            peripheral.id,
                            service,
                            crustCharacteristic,
                            [0]
                          ).then(() => {
                            console.log("Writed NORMAL crust");
                            BleManager.write(
                              peripheral.id,
                              service,
                              bakeCharacteristic,
                              [1, 95]
                            ).then(() => {
                              console.log(
                                "Writed 351 temperature, the pizza should be BAKED"
                              );
                              /*
                          var PizzaBakeResult = {
                            HALF_BAKED: 0,
                            BAKED:      1,
                            CRISPY:     2,
                            BURNT:      3,
                            ON_FIRE:    4
                          };*/
                            });
                          });
                        }, 500);
                      })
                      .catch((error) => {
                        console.log("Notification error", error);
                      });
                  }, 200);
                }
              );
            }, 900);
          })
          .catch((error) => {
            console.log("Connection error", error);
          });
      }
    }
  }

  renderEmpty = () => <Empty text="This page is clean" />;
  renderItem(item) {
    return (
      <Device
        {...item}
        iconLeft={require("../../icons/bt-device.png")}
        iconRight={require("../../icons/gear.png")}
      />
    );
  }

  toggleBluetooth = (
    value
  ) => {}; /*
    if (value) {
      return enableBluetooth();
    }
    disableBluetooth();
  };
  const enableBluetooth = () => {
    try {
      manager.enable();
      const list = [];
      manager.startDeviceScan(null, null, (error, device) => {
        list.push(device);
      });
      manager.stopDeviceScan();
      setBolEnable(true);
      setList(list);
    } catch (error) {
      console.log(error);
    }
  };
  const disableBluetooth = () => {
    try {
      manager.disable();
      manager.stopDeviceScan();
      setBolEnable(false);
      setList([]);
    } catch (error) {
      console.log(error);
    }
  };*/

  render() {
    const list = Array.from(this.state.peripherals.values());
    return (
      <Layout title="Bluetooth">
        <Toggle
          value={this.state.bolEnable}
          onValueChange={() => this.toggleBluetooth()}
        />
        <View>
          <Button
            title="Refresh devices menu"
            color="#1491ee"
            onPress={() => this.startScan()}
          />
        </View>
        <Subtitle title="Devices List" />
        <FlatList
          data={list}
          ListEmptyComponent={() => this.renderEmpty()}
          renderItem={({ item }) => this.renderItem(item)}
          keyExtractor={(item) => item.id}
        />
      </Layout>
    );
  }
}
