import React, {useState, useEffect }   from 'react'
import { FlatList,Text, View,PermissionsAndroid } from 'react-native'
import { BleManager ,BleRestoredState} from "react-native-ble-plx"
import Toggle from "../../../components/toggle";
import Device from "../../../components/device";
import { useNavigation } from "@react-navigation/native";
import {globalStyles} from '../../../styles/global';
import {useTheme} from '../../../components/theme/ThemeProvider';
import Layout from "../../../components/bluetooth-list-layout";
import Empty from "../../../components/empty";
import Subtitle from "../../../components/subtitle";
export async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
          title: 'Location permission for bluetooth scanning',
          message: 'wahtever',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ); 
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission for bluetooth scanning granted');
        
        return true;
      } else {
        console.log('Location permission for bluetooth scanning revoked');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

 
const BluetoothScreen = ()=>{
    const manager = new BleManager();
    const [info, setInfo] = useState([]);
    const [values, setValue] = useState([]);
    const[bolstate,setBolstate]=useState();
    const [bleStatus, setBleStatus] = useState({emitter:"",value:false});
    const [bleDevicePrevState, setBleDevicePrevState] = useState("");
    const {colors} = useTheme();
    const navigation = useNavigation();
    const [list, setList] = useState([]);
    
    
    const renderEmpty = () => <Empty text="This page is clean" />;
    
    const renderItem = (item) => {
      return (
        <Device 
          {...item}
          iconLeft={require("../../../icons/bt-device.png")}
          iconRight={require("../../../icons/gear.png")}
          onPress={() => {
            console.log(item);
            navigation.navigate("DeviceView", { title: item.name, body:item.id });
          }}
        />
      );
    };
  
    useEffect(()=>{
        switch (bleStatus.emitter) {
            case 'user':
                if (bleStatus.value) 
                {
                    manager.enable();
                    setTimeout(() => {   scanAndConnect(); }, 1000);
                }
                else
                {
                    manager.stopDeviceScan();
                    setList([]);
                    manager.disable();
                    //setTimeout(() => {manager.disable(); }, 3000);     
               }
                console.log("BLE STATUS CHANGE BY USER : ", bleStatus.value);
                break;           
            case 'device':
                if(bleStatus.value)
                {
                    setTimeout(() => {   scanAndConnect(); }, 1000);
                }
                else 
                {
                    manager.stopDeviceScan();
                    setList([]);
                }
                break;
            default:                
                break;
            }
      },[bleStatus]);

      
      useEffect(()=>{
        if(Platform.OS === 'android'){
          requestLocationPermission(); 
          
        }
        
        setBleStatus({emitter:"user",value:true});
   
      },[]);
      useEffect(()=>{
        let subscription =manager.onStateChange((state) => {            
            if(state != bleDevicePrevState){
            console.log("BLE STATUS CHANGE BY DEVICE: "+state)
            setBleDevicePrevState(state);
            switch (state) {
            case 'Resetting':
                subscription.remove();
                break;   
            case 'PoweredOff':
                setBleStatus({emitter:"device",value:false});
                subscription.remove();
                break;            
            case 'PoweredOn':            
                setBleStatus({emitter:"device",value:true});
                subscription.remove();
                break;
            default:                
                break;
            }}
        }); 
        return(()=>{subscription.remove();});      
      },[ bleDevicePrevState]);

      
   const scanAndConnect=()=> {
      if(Platform.OS === 'android'){
      const permission = requestLocationPermission();
        if(permission){
          manager.startDeviceScan(null, null, (error, device) => {
            console.log("Scan:")
            
              if(device && device.name){
                  console.log("DEVICE:",{ device})
                  const existingDevice = list.find(d => d.id == device.id);
                  if(existingDevice==null) setList([...list,{name:device.name,id:device.id}]);
                  //console.log(error) 
                  if (device.name === "Mi Band 3" ) {
              
                      manager.stopDeviceScan();
                  /* device.connect()
                          .then((device) => {
                              this.info("Discovering services and characteristics");
                              return device.discoverAllServicesAndCharacteristics()
                          })
                          .then((device) => {
                              this.info(device.id);
                              device.writeCharacteristicWithResponseForService('12ab', '34cd', 'aGVsbG8gbWlzcyB0YXBweQ==')//Where I use 12ab, insert the UUID of your BLE service. Similarly, where I use 34cd, insert the UUID of your BLE characteristic. Lastly, include a base64 encoding of whatever message you're trying to send where I have aGVsbG8gbWlzcyB0YXBweQ==.
                              .then((characteristic) => {
                                  this.info(characteristic.value);
                                  return 
                              })
                          })
                          .catch((error) => {
                              this.error(error.message)
                          })
                      }
                  });*/
                }
          
              }
          
          
          
          });
              

        }
    }
   else{
    manager.startDeviceScan(null, null, (error, device) => {
      console.log("Scan:")
      
        if(device && device.name){
            console.log("DEVICE:",{ device})
            const existingDevice = list.find(d => d.id == device.id);
            if(existingDevice==null) setList([...list,{name:device.name,id:device.id}]);
            //console.log(error) 
            if (device.name === "Mi Band 3" ) {
        
                manager.stopDeviceScan();
            /* device.connect()
                    .then((device) => {
                        this.info("Discovering services and characteristics");
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then((device) => {
                        this.info(device.id);
                        device.writeCharacteristicWithResponseForService('12ab', '34cd', 'aGVsbG8gbWlzcyB0YXBweQ==')//Where I use 12ab, insert the UUID of your BLE service. Similarly, where I use 34cd, insert the UUID of your BLE characteristic. Lastly, include a base64 encoding of whatever message you're trying to send where I have aGVsbG8gbWlzcyB0YXBweQ==.
                        .then((characteristic) => {
                            this.info(characteristic.value);
                            return 
                        })
                    })
                    .catch((error) => {
                        this.error(error.message)
                    })
                }
            });*/
          }
    
        }
    
    
    
    });
        
   }
    
         

       
   
       
      }
    return (
        <View style={{...globalStyles.container, backgroundColor:colors.background}} >
    <Layout title="Bluetooth">
      <Toggle value={bleStatus.value} onValueChange={(val)=>{
          setBleStatus({emitter:"user",value:val}); 
          console.log("TOGGLE SWITCHED BY USER: ", val);
          }} />
      <Subtitle title="Devices List" />
      <FlatList 
        data={list}
        ListEmptyComponent={() => renderEmpty()}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
      />
    </Layout>
    </View>
    )
}

export default BluetoothScreen;
