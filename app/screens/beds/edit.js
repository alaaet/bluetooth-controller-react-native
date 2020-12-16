import React,{useState,useEffect} from "react";
import { StyleSheet, View, Text, Pressable,TextInput } from "react-native";
import { globalColors,globalStyles } from "../../styles/global";
import {useTheme} from '../../components/theme/ThemeProvider';
import {saveBedToStorage} from "../../utils/phoneStorage";
import { useNavigation } from "@react-navigation/native";
import { bedService } from "../../services";


export default function Edit(props) {
    const navigation = useNavigation();
    const {colors} = useTheme();    
    const [bed,setBed] = useState(props.route.params?.item);   
    console.log("BED after edit: ",bed)
  return (
    <View style={{...globalStyles.container, backgroundColor:colors.background}}>
      <TextInput style={styles.input}  onChangeText={val=>{setBed({...bed,name:val});}} value={bed.name}>  
      </TextInput>
      <Pressable style={styles.button} backgroundColor = {globalColors.blue}  onPress={async()=>{
          await saveBedToStorage(bed);
          bedService.setBed(bed);
          navigation.goBack();
          } }><Text style={styles.btnText}>
				Save</Text></Pressable>
        </View>
  )
}

const styles = StyleSheet.create({
    input: {
        fontSize:25,
        color: '#555555',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 5,
        width: '100%', 
        borderBottomColor: globalColors.blue,
        borderBottomWidth: 1,
        alignSelf: 'center',
        backgroundColor: '#ffffff'
    },
    button: {
        alignSelf:"center",
            justifyContent:"center",
        width: '100%',
        marginTop: 20,
        backgroundColor : '#2196f3',
        padding: 15,
        borderRadius: 5,
        marginBottom:10,
        position:'absolute',
		bottom:0,

        },
    btnText: {
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
    },
})