import React,{useState,useEffect} from 'react'
import { View, Text, TextInput ,StyleSheet,Pressable } from 'react-native'
import {useTheme} from '../../components/theme/ThemeProvider';
import { useNavigation } from "@react-navigation/native";
import Separator from "../../components/separator";
import {globalColors} from "../../styles/global"
import { Slider } from 'react-native-elements';
import Card from "../../components/card";
import CheckBox from "@react-native-community/checkbox";
import AsyncStorage from '@react-native-community/async-storage';

const EditMode = (props) => {
    const [mode,setMode] = useState(props.route.params?.item);
    const [currentModes,setCurrentModes] = useState([]);
    const {colors} = useTheme();
    const navigation = useNavigation();
    const MODES_STORAGE_KEY="modes";
    const separatorColor = colors.separator;

      const readModeFromStorage = async () => {
        try {
          const modeFromStorage =JSON.parse( await AsyncStorage.getItem(MODES_STORAGE_KEY))  
          if (modeFromStorage !== null) {
            setCurrentModes(modeFromStorage);
           console.log("Modes were read from storage memory!");
          }
        } catch (e) {
         console.log(e.message)
        }
      }
    const saveModeToStorage = async (tempModes) => {
        try {
          if(tempModes.length>0)       
          await AsyncStorage.setItem(MODES_STORAGE_KEY,JSON.stringify(tempModes));
          console.log("Modes were saved to storage memory!");
        } catch (e) {
          console.log(e.message)
        }
      }
      
      useEffect(()=>{
        readModeFromStorage();
      },[])

    return (
        <View style={{...styles.container, backgroundColor:colors.background}}>
           <View style={styles.wrapper}>
                <TextInput
                style={{...styles.textInput,color:colors.text}}
                    onChangeText={text => setMode({...mode,name:text})}
                    value={mode.name}                    
                />
            </View>
            <Separator color={separatorColor} ml={1} mr={1} flex={0.02}/>
            <Card  bgColor={colors.card} >
                <View style={styles.cardContentWrapper}>
                    <View style={styles.content}>
                         <Text style={{...styles.motorLabel,color:colors.text}}> Back motor</Text> 
                         { /* <CheckBox 
                            value={mode.motor1direction=="Up"}
                            onValueChange={()=>{
                                    setMode({...mode,motor1direction:"Up"});
                                }}
                            style={styles.checkbox}
                            tintColors={{ true: globalColors.blue, false: colors.text }}
                            />
					    <Text style={{...styles.label,color:colors.text}}>Up</Text>
                       <CheckBox 
                            value={mode.motor1direction=="Down"}
                            onValueChange={()=>{
                                setMode({...mode,motor1direction:"Down"});
                            }}
                            style={styles.checkbox}
                            tintColors={{ true: globalColors.blue, false: colors.text }}
                        />
					    <Text style={{...styles.label,color:colors.text}}>Down</Text>*/}
                    </View>
                    <View style={styles.slider}>
                        <Slider
                            value={mode.motor1scale}
                            onValueChange={(value) => setMode({...mode,motor1scale:value })}
                            maximumValue={34}
                            minimumValue={0}
                            step={1}
                           minimumTrackTintColor={globalColors.blue}
                           thumbTintColor={globalColors.yellow}
                        />
                        <Text style={{color:colors.text}}  >Value:{mode.motor1scale}</Text>
                    </View>
                </View>
            </Card>
            <Card  bgColor={colors.card} >
                <View style={styles.cardContentWrapper}>
                    <View style={styles.content}>
                         <Text style={{...styles.motorLabel,color:colors.text}}>Leg motor</Text> 
                         {/*<CheckBox 
                            value={mode.motor2direction=="Up"}
                            onValueChange={()=>{
                                setMode({...mode,motor2direction:"Up"});
                            }}
                            style={styles.checkbox}
                            tintColors={{ true: globalColors.blue, false: colors.text }}
                            />
					    <Text style={{...styles.label,color:colors.text}}>Up</Text>
                        <CheckBox 
                            value={mode.motor2direction=="Down"}
                            onValueChange={()=>{
                                setMode({...mode,motor2direction:"Down"});
                            }}
                            style={styles.checkbox}
                            tintColors={{ true: globalColors.blue, false: colors.text }}
                            />
					    <Text style={{...styles.label,color:colors.text}}>Down</Text>*/}
                    </View>
                    <View style={styles.slider}>
                        <Slider
                            value={mode.motor2scale}
                            onValueChange={(value) => setMode({...mode,motor2scale:value })}
                            maximumValue={16}
                            minimumValue={0}
                            step={1}
                            minimumTrackTintColor={globalColors.blue}
                            thumbTintColor={globalColors.yellow}
                        />
                        <Text style={{color:colors.text}}>Value:{mode.motor2scale}</Text>
                    </View>
                </View>
            </Card>

           <View style={styles.btnWrapper} >
           <Pressable style={{...styles.button,marginTop:30}} backgroundColor = '#2196f3' onPress={async()=>{
                const tempModes = currentModes.map( item=>{
                    if (item.id == mode.id)return mode;
                    else return item;});
                    console.log(tempModes);
                    setCurrentModes(tempModes);
                    await saveModeToStorage(tempModes);
                navigation.goBack();
                }}><Text style={styles.btnText}>
				Save</Text></Pressable>

            </View>
            <View style={styles.btnWrapper} >

            <Pressable style={styles.button} backgroundColor = 'red'  onPress={()=>{navigation.goBack();} }><Text style={styles.btnText}>
				Cancel</Text></Pressable>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
	container: {	
        flexDirection: 'column',
        padding: 10,
        marginBottom: 0,
        height: "100%"
    },
    wrapper: {
        padding: 10,
        marginVertical:10,
        paddingVertical:10,
      },    
      btnWrapper: {
        marginVertical: 5
      },
      textInput:{
          fontSize:18
      },
      cardContentWrapper: {
        flexDirection: "column",
        alignItems:"flex-start",
        padding: 0,
        marginHorizontal:10,
        justifyContent: "space-between",
      },
     slider:{
        alignSelf: 'stretch', justifyContent: 'center'
     },
     content:{
        flexDirection: "row",
        alignItems: "center",
        padding: 0,
        justifyContent: "space-between",
     },
     checkbox: {
        alignSelf: "center",
       marginHorizontal:Platform.OS === 'ios' ? 10: 0
      }, 
      motorLabel:{
          marginRight:20,
          
      },
      button: {
		alignSelf:"center",
         justifyContent:"center",
		width: '100%',
		padding: 15,
		borderRadius: 5,
		marginBottom:10,

      },
      btnText: {
		color: "white",
		fontSize: 20,
		justifyContent: "center",
		textAlign: "center",
	  },

});

export default EditMode
