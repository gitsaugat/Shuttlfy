import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const TimeCard = ({
  routeName,
  routeNumber,
  departureTime,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons name="bus" size={24} color="#2196F3" />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.shuttleNumber}>Shuttle #{routeNumber}</Text>
        <Text style={styles.departureTime}>{departureTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  shuttleNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  departureTime: {
    fontSize: 14,
    color: "#666",
  },
});
