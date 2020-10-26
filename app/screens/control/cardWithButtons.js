import React from "react";
import { StyleSheet, Image, Pressable, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { globalColors } from "../../styles/global";

import {
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../../shared/card";

export default function CardWithButtons({ icon }) {
  return (
    <Card style={styles.cardWrapper} bgColor={globalColors.white}>
      <View style={styles.wrapper}>
        <View style={styles.arrowWrapper}>
          <Pressable>
            <FontAwesomeIcon
              icon={faChevronCircleUp}
              style={styles.arrow}
              size={50}
            />
          </Pressable>
        </View>
        <View style={styles.wrapperCenter}>
          <Image style={styles.icon}source={icon} />
        </View>
        <View style={styles.arrowWrapper}>
          <Pressable>
            <FontAwesomeIcon
              icon={faChevronCircleDown}
              style={styles.arrow}
              size={50}
            />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardWrapper: { backgroundColor: "grey" },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    justifyContent: "space-between",
  },
  arrowWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    color: globalColors.blue,
  },
  wrapperCenter: {
    width: 120,
    height: 60,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 120,
    height: 60,
  },
});
