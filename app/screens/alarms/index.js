import React, { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { globalStyles } from "../../styles/global";
import Bed from "./bed";
import Empty from "../../components/empty";
const renderEmpty = () => <Empty text="You dont have any beds!" />;
export default function Alarms() {
  const [list, setList] = useState([
    { id: "1", name: "Bed A" },
    { id: "2", name: "Bed B" },
    { id: "3", name: "Bed C" },
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
    <View style={globalStyles.container}>
      <FlatList
        data={list}
        ListEmptyComponent={() => renderEmpty()}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
