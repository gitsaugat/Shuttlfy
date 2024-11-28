//@ts-nocheck

import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ROUTES = [
  {
    id: "campus/tops",
    name: "TOPS",
    pickup: {
      latitude: 42.93311142,
      longitude: -78.881111,
    },
    dropoff: {
      latitude: 42.9394862,
      longitude: -78.8888097,
    },
  },
  {
    id: "campus/wegmans",
    name: "Wegmans",
    pickup: {
      latitude: 42.93311142,
      longitude: -78.881111,
    },
    dropoff: {
      latitude: 42.9374392,
      longitude: -78.882316,
    },
  },
  {
    id: "campus/stack",
    name: "Stack",
    pickup: {
      latitude: 42.93311142,
      longitude: -78.881111,
    },
    dropoff: {
      latitude: 42.932849,
      longitude: -78.887688,
    },
  },
  {
    id: "campus/monarch",
    name: "Monarch",
    pickup: {
      latitude: 42.93311143,
      longitude: -78.881111,
    },
    dropoff: {
      latitude: 43.0858219,
      longitude: -78.884255,
    },
  },
  {
    id: "campus/niagara_falls",
    name: "Niagara Falls",
    pickup: {
      latitude: 42.93311143,
      longitude: -78.881111,
    },
    dropoff: {
      latitude: 43.0858219,
      longitude: -79.0536008,
    },
  },
  {
    id: "campus/towers",
    name: "Towers",
    pickup: {
      latitude: 42.93311143,
      longitude: -78.881111,
    },
    dropoff: {
      latitude: 42.9362495,
      longitude: -78.884255,
    },
  },
  {
    id: "campus/coyer_field",
    name: "Coyer Field",
    pickup: {
      latitude: 42.93311142,
      longitude: -78.881111,
    },
    dropoff: {
      latitude: 42.9348603,
      longitude: -78.8880042,
    },
  },
];
export default function ShuttleTimesScreen() {
  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <Text style={styles.routeName}>{item.name}</Text>
      <View style={styles.timeContainer}>
        <Text style={styles.timesTitle}>Pickup Times:</Text>
        <Text style={styles.times}>7:00 AM, 12:00 PM, 5:00 PM</Text>
        <Text style={styles.timesTitle}>Drop-off Locations:</Text>
        <Text style={styles.locationDetails}>
          Latitude: {item.dropoff.latitude.toFixed(4)}
          {"\n"}
          Longitude: {item.dropoff.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={ROUTES}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scheduleItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  routeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeContainer: {
    alignItems: "center",
  },
  timesTitle: {
    fontWeight: "bold",
    marginTop: 5,
  },
  times: {
    marginBottom: 10,
  },
  locationDetails: {
    textAlign: "center",
  },
});
