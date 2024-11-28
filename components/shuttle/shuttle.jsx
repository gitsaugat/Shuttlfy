import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { TabBarIcon } from "../navigation/TabBarIcon";
const Shuttle = () => {
  return (
    <View style={styles.shuttleInfo}>
      <TabBarIcon name={"bus"} color={"white"} />
    </View>
  );
};

const styles = StyleSheet.create({
  shuttleInfo: {
    margin: 10,
    flex: 1,
    backgroundColor: "gray",
    padding: 8,
    borderRadius: 3,
  },
  text: {
    color: "white",
  },
});

export default Shuttle;
