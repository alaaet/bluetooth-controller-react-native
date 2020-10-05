import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
const Subtitle = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.line} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flexDirection: 'row', marginVertical: 15, alignContent: 'center'},
  title: {marginLeft: 10, fontSize: 18, fontWeight: 'bold', color: 'grey'},
  line: {
    borderBottomWidth: 1,
    marginLeft: 5,
    marginTop: 3,
    flex: 1,
    borderColor: '#eceff1',
  },
});
export default Subtitle;
