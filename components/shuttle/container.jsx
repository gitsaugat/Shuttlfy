import React from "react";
import { StyleSheet, View, Alert, SafeAreaView } from "react-native";
import { TextInput, FlatList, Text } from "react-native";
import Shuttle from "./shuttle";
const ShuttleContainer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.shuttleContainer}>
        <Text> Shuttle Times </Text>
        <Shuttle />
        <Shuttle />
        <Shuttle />
        <Shuttle />
      </View>
    </View>
  );
};

export default ShuttleContainer;

const styles = StyleSheet.create({
  shuttleContainer: {
    zIndex: 1,
    width: "100%",
    margin: "auto",
    backgroundColor: "black",
    padding: "5%",
    bottom: "0%",
    position: "absolute",
  },
  container: {
    flex: 1,
  },
});
