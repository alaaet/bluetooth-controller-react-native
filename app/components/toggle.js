import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {useTheme} from './theme/ThemeProvider';
import {globalColors} from '../styles/global'

const toggle = (props) => {
  const {colors} = useTheme();
  const separatorColor = colors.separator;
  return (
    <View style={styles.container}>
      <Text style={{...styles.text,color:colors.text}}>{props.value ? 'ON' : 'OFF'}</Text>
      <Switch
      trackColor={{ false: separatorColor, true: globalColors.blue }}
      thumbColor={props.value ? globalColors.yellow : globalColors.grey}
        style={styles.switch}
        value={props.value}
        onValueChange={props.onValueChange}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    flexDirection: 'row',
  },
  text: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
  },
  switch: {
    width: 50,
  },
});
export default toggle;
