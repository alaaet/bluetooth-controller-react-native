import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from './theme/ThemeProvider';

const BluetoothListLayout = (props) => {
  const {colors} = useTheme();
  return (
    <View style={{...styles.container, backgroundColor:colors.background }}>
      <Text style={{...styles.title,color:colors.text}}>{props.title}</Text>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    
  },
  title: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
export default BluetoothListLayout;
