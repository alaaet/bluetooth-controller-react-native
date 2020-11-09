import  React, {  useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch ,
} from 'react-native';
import { globalStyles, globalColors } from '../../styles/global';
import {useTheme} from '../../components/theme/ThemeProvider';
import Separator from "../../components/separator";

function  General () {
  
  const {colors, isDark, setScheme} = useTheme();
  const toggleScheme = () => {
    isDark ? setScheme('light') : setScheme('dark');
  }
  const text = isDark ? 'Dark mode 🌙' : 'Light mode 🌞';
  const [soundsList, setSoundsList] = useState({});
  const separatorColor = colors.separator;
 

  return (
    <View style={{...globalStyles.container, backgroundColor:colors.background }}>    
      <Text style={{...globalStyles.titleText,color:colors.text}}>Theme
      </Text>
      <Separator color={separatorColor} ml={1} mr={1}/>
      <View style={styles.switchWrapper}>
        <Switch 
        trackColor={{ false: globalColors.blue, true: globalColors.blue }}
        thumbColor={isDark ? globalColors.yellow : globalColors.yellow}
        value={isDark} onValueChange={toggleScheme}/> 
        <View style={{...styles.messagecontainer, borderColor: colors.primary , borderColor: colors.primary}}>
            <Text style={{...styles.messagestyle, color: colors.text, }}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({  
  soundsList: {
    backgroundColor: 'white',
  },
  soundText: {
    fontSize: 18,
    paddingVertical: 4,
    fontWeight: '400',
    color: globalColors.blue,  
  },
  wrapper:{
    flex:4,
    justifyContent: 'center',
  },
  switchWrapper:{
    flex:4,
    justifyContent: 'flex-start',
    alignItems: 'center',    
  }, 
  messagestyle:{
    fontSize: 18,
  },
  messagecontainer:{
    margin: 24,
    padding: 12,
    borderRadius: 4,
    borderWidth: 2,        
  }
});

export default General;
