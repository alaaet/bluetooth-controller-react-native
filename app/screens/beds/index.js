import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, FlatList,PermissionsAndroid, Platform ,ScrollView } from "react-native";
import { globalColors, globalStyles } from "../../styles/global";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Bed from "./bed";
import {useIsFocused,useNavigation } from "@react-navigation/native";
import {useTheme} from '../../components/theme/ThemeProvider';
import { BleManager } from "react-native-ble-plx";
import Device from "../../components/device";
import Subtitle from "../../components/subtitle";
import Empty from "../../components/empty";
import {getDeviceIdFromStorage,saveDeviceIdToStorage,readBedFromStorage,saveBedToStorage} from "../../utils/phoneStorage";
import Toast from 'react-native-toast-message';
import {sendToPeripheral,hexToBase64,decimalToHex} from "../../utils/bleManager";
import{START,END,TYPE,COMMAND,LENGTH1,LENGTH2,CHECKSUM,SET_TIME} from '../../shared/constants';
import { bedService } from "../../services";
export async function requestLocationPermission() {
  try {
    let result = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION])
    let granted = true;
    console.log("RESULT OF PERMISSION: ", result);
    Object.entries(result).forEach(([key, value]) => {
      if(value!== PermissionsAndroid.RESULTS.GRANTED)
      {
        granted = false;
      }
    });
    if (granted) {
      console.log('Location permission for bluetooth scanning granted');        
      return true;
    } else {
      console.log('Location permission for bluetooth scanning revoked');
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}
export default function Beds(props) {
  const manager = new BleManager();
  const [bleStatus, setBleStatus] = useState({emitter:"",value:false});
  const [bleDevicePrevState, setBleDevicePrevState] = useState("");
  const {colors} = useTheme();
  const [devicesList, setDevicesList] = useState([]);
  const [deviceId,setDeviceID] = useState(""); 
  const isFocused = useIsFocused();
  const [bed, setBed] = useState({id:null,name:null,device:null});
  const navigation = useNavigation();
    
  useEffect(()=>{
    const init = async()=>{await requestLocationPermission();}
    if(Platform.OS=='android') {
        init();        
    // setBleStatus({emitter:"user",value:true});
    }
    const subscription = bedService.onChange().subscribe((modifiedBed) => {
      if(modifiedBed)
      {
        console.log("edit return", modifiedBed)
        setTimeout(() => {
          setBed(modifiedBed);
        }, 100);  
      }    
    });
    return () => {
      // unsubscribe to avoid memory leaks
      subscription.unsubscribe();
    };
  },[]);
  useEffect( ()=>{
    const init = async()=>{
      await saveDeviceIdToStorage(deviceId); 
    }
    init();      
  },[deviceId]);

  useEffect( ()=>{
    const init = async()=>{
      setDeviceID(await getDeviceIdFromStorage())
      let bedFromStorage = await readBedFromStorage();
      console.log("bedFromStorage: ",bedFromStorage)
      const connectResult = await handleConnect(bedFromStorage.id,bedFromStorage.device,true);
      console.log("connectResult: ",connectResult)
      if(bedFromStorage?.device!==null)
      {
        setBed(bedFromStorage);
      }
    }
    if(isFocused && bedService.bedValue?.name && bedService.bedValue?.name!== bed.name )
    {
      manager.enable()
      .then(
        ()=>{
          console.log("Ble was enabled");
          init();
        }
      )
      .catch((e)=>{
        console.log(e);
        init();
      });
    }  
  },[isFocused]);

  useEffect( ()=>{
    const init = async()=>{
      await saveBedToStorage(bed);
    }
    init();
    console.log("BED: ", bed)
  },[bed]);


    const handleConnect=async(deviceId,Name,existing=false)=>{
       manager.isDeviceConnected(deviceId).then(async(isConnected)=>{
        console.log("CONNECTION CHECK RESULT: ", isConnected)
        if(!isConnected)
        {
          if (Name?.toLowerCase().includes("octo") ) {               
            await manager.connectToDevice(deviceId)
            .then(async(device) => {                 
                //setInfo("Discovering services and characteristics");
                  let date=new Date(Date.now());
                  let year=decimalToHex(date.getFullYear()%2000);
                  let month=decimalToHex((date.getMonth())+1);
                  let Dow=decimalToHex(date.getDay())
                  let day=decimalToHex(date.getDate());
                  let hour=decimalToHex(date.getHours());
                  let minute=decimalToHex(date.getMinutes());
                  let seconds=decimalToHex(date.getSeconds());
                  var base64String =hexToBase64(START+TYPE+COMMAND+LENGTH1+LENGTH2+CHECKSUM+SET_TIME+seconds+minute+hour+Dow+day+month+year+END);
                  await sendToPeripheral(deviceId,base64String);
                  if(!existing)
                  {
                  setDeviceID(deviceId)
                  setBed({id:deviceId, name: "Bed A", device:Name })
                  }
                Toast.show({
                  text1: 'Controller',
                  text2:"Controller Connected Successfully.   👋"
                  });
                await device.discoverAllServicesAndCharacteristics();
                return true;
            }).catch(async(e)=>{
              console.log("CONNECTION ERROR:",e)
              return false;
            });
          }return false;
        }
        else
        {
          console.log("DEVICE IS CONNECTED _ NO ACTION");
          return false;
        }
      }).catch((e)=>{
        console.log("Error while checking device connection: ",e);
        return false
      });
      return false;
    }
    const renderEmpty = () => <Empty text="This page is clean" />;
    
    const renderItem = (item,index) => {
      //console.log('item',item)
      return (
        <Device 
          {...item}
          key={index}
          iconLeft={require("../../../icons/bt-device.png")}
         // iconRight={require("../../../icons/connect.png")}
          onPress={() => {
            handleConnect(item.id,item.name)
            //console.log(item);

          //  navigation.navigate("DeviceView", { title: item.name, body:item.id });
          }}
        />
      );
    };

  const scanAndConnect=async()=> {
     console.log("SCANNING...")
   
    if(Platform.OS=='android'){
      const permission = await requestLocationPermission();
      if (permission) 
      { 
        manager.startDeviceScan (null, null, async(error, device) => 
        {
          console.log("DEVICE:",device?.name)
          if(error) console.log("ERROR:",error)
            if( device?.name?.toLowerCase().includes("octo"))
            {                
              setDevicesList(devicesList=>([...devicesList.filter(d => d.id !== device.id),{name:device.name,id:device.id}]))
            }
        });
        setTimeout(() => { 
          manager.stopDeviceScan();
      }, 8000);
    }
    }
    else{
      manager.startDeviceScan (null, null, async(error, device) => 
        {
          console.log("DEVICE:",device?.name)
          if(error) console.log("ERROR:",error)
            if(device?.name?.toLowerCase().includes("octo"))
            {                
              setDevicesList(devicesList=>([...devicesList.filter(d => d.id !== device.id),{name:device.name,id:device.id}]))
            }
        });
        setTimeout(() => { 
          manager.stopDeviceScan();
      }, 8000);
    }

  }
  
  const startScan=()=>{
  //  manager.enable();
    setTimeout(() => {   scanAndConnect(); }, 1000);
   } 
  //////////////////////////
  const disconnect=async()=>{
    let res= await manager.cancelDeviceConnection(deviceId);
    setBed({id:null,name:null,device:null});
   }
   const bedEdit=()=>{
    navigation.navigate('Edit', {item:bed})
   }

  const renderBed=()=>{
  if(bed.id===null){
  return(
    <Text style={styles.empty}>
      You dont have any beds!
    </Text>)}
  else{
  return (<View>
    <Bed
        disconnect={disconnect}
        bedEdit={bedEdit}
        id={bed.id}
        name={bed.name}
        device={bed.device} /> 
    </View>) }}

 
 


  return (
    <View style={{...globalStyles.container, backgroundColor:colors.background}}>
      <ScrollView>
        <Pressable onPress={()=>startScan()}>
          <View style={styles.btnWrapper}>
            <FontAwesomeIcon icon={faPlus} style={styles.plusIcon} size={50} />
            <Text style={styles.reading}>Add New Bed</Text>
          </View>
        </Pressable>
        <View style={styles.wrapper}>
          <Text style={{...styles.title,color:colors.text}}>Connected Bed </Text>
        </View>
    
        <View style={styles.cardWrapper}>
      
          { renderBed()}
      
        </View>
       
        <Subtitle title=" Available Devices" />
        {devicesList.length>0?(devicesList.map((device,index)=>renderItem(device,index))):renderEmpty()}
        {/* <FlatList 
          data={devicesList}
          ListEmptyComponent={() => renderEmpty()}
          renderItem={(item) => renderItem(item.item)}
          keyExtractor={(item,index) => index.toString()}
        /> */}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: globalColors.black,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  btnWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: globalColors.blue,
    height: 80,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
  },
  cardWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    maxHeight: 330,
    backgroundColor: globalColors.blue,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#fff",
  },
  reading: { fontSize: 35, color: globalColors.yellow },
  plusIcon: { color: globalColors.yellow, marginRight: 10 },
  empty: { fontSize: 25, color: globalColors.white },
});
