import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ShuttleRouteCard = ({
  routeName,
  routeNumber,
  departureTime,
  arrivalTime,
  distance,
  status = false,
  onPress,
}) => {
  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case true:
        return "#4CAF50"; // Green
      case false:
        return "#F44336"; // Red
      default:
        return "#2196F3"; // Blue
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons name="bus" size={40} color="#2196F3" />
        <Text style={styles.routeNumberText}>#{routeNumber}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.routeNameText}>{routeName}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <Text style={styles.statusText}>{"Status"}</Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.timeText}>Departure: {departureTime}</Text>
          </View>
          <View style={styles.timeItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.timeText}>Arrival: {arrivalTime}</Text>
          </View>
        </View>

        <View style={styles.additionalInfoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="map-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Distance: {distance} MILES</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  routeNumberText: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
  },
  detailsContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  routeNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  timeContainer: {
    marginBottom: 10,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  additionalInfoContainer: {
    flexDirection: "row",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
});

export default ShuttleRouteCard;
