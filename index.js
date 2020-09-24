//import { registerRootComponent } from "expo";
import { AppRegistry } from "react-native";
import BluetoothList from "./app/bluetooth/containers/bluetooth-list";
import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
//registerRootComponent(BluetoothList);

AppRegistry.registerComponent("main", () => BluetoothList);
