import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { globalStyles } from "../../styles/global";
import Bed from "./bed";
import Empty from "../../components/empty";
import {useTheme} from "../../components/theme/ThemeProvider"  
const renderEmpty = () => <Empty text="You dont have any beds!" />;
export default function Alarms() {
  const {colors, isDark, setScheme} = useTheme();
  console.log(colors)
  const [list, setList] = useState([
    { id: "1", name: "Bed A" },
    //{ id: "2", name: "Bed B" },
  ]);
  const renderItem = (item) => {
    return (
      <Bed
        name={item.name}
        onPress={() => {
          console.log(item);
        }}
      />
    );
  };
  return (
    <View style={{...globalStyles.container, backgroundColor:colors.background}}>
      <FlatList
        data={list}
        ListEmptyComponent={() => renderEmpty()}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  
});
