import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, FlatList } from "react-native";
import { globalColors, globalStyles } from "../../styles/global";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Bed from "./bed";

export default function Beds(props) {
  const [list, setList] = useState([
    { id: "1", name: "Bed A" },
    { id: "2", name: "Bed B" },
    { id: "3", name: "Bed C" },
    { id: "4", name: "Bed D" },
    { id: "5", name: "Bed E" },
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
      <Pressable>
        <View style={styles.btnWrapper}>
          <FontAwesomeIcon icon={faPlus} style={styles.plusIcon} size={50} />
          <Text style={styles.reading}>Add New Bed</Text>
        </View>
      </Pressable>
      <View style={styles.wrapper}>
        <Text style={styles.title}>BEDS List</Text>
      </View>
      <View style={styles.cardWrapper}>
        <FlatList
          data={list}
          ListEmptyComponent={() => renderEmpty()}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
        />
      </View>
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
});
