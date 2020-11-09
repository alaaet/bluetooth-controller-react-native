import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from './theme/ThemeProvider';

const Separator = (props) => {
  const {colors} = useTheme();
  return (
    <View
      style={[
        styles.separator,
        {
          borderColor: colors.separator,
          marginLeft: props.ml? props.ml : 60,
          marginRight: props.mr? props.mr:25,
          flex: props.flex?props.flex:1,
        },
      ]}
    />
  );
};
const styles = StyleSheet.create({
  separator: {
    //flex: 1,
    borderTopWidth: 1,
  },
});
export default Separator;
