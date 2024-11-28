//@ts-nocheck

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
import ShuttleRouteCard from "@/components/cards/routeCard";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ScrollView } from "react-native";
import { RouteContext } from "@/contexts/routeContext";

export default function ExploreScreen() {
  const { selectedRoute, setSelectedRoute } = useContext(RouteContext);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(true);
    console.log(selectedRoute);
  }, []);

  const handleMarkerPress = (route) => {
    setSelectedRoute(route);
    setModalVisible(true);
  };

  const shuttleTimes = [
    { time: "7:00 AM", availability: "High" },
    { time: "9:30 AM", availability: "Medium" },
    { time: "12:00 PM", availability: "Low" },
    { time: "2:30 PM", availability: "High" },
    { time: "5:00 PM", availability: "Medium" },
    { time: "7:30 PM", availability: "Low" },
  ];

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "High":
        return "green";
      case "Medium":
        return "orange";
      case "Low":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: 42.93311142,
          longitude: -78.881111,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {ROUTES.map((route) => (
          <Marker
            key={route.id}
            coordinate={route.dropoff}
            title={`${route.name} Drop-off`}
            pinColor="red"
            onPress={() => handleMarkerPress(route)}
          />
        ))}
      </MapView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {true && (
                  <>
                    <Text style={styles.routeTitle}>Route Timings</Text>
                    <ScrollView>
                      {shuttleTimes.map((slot, index) => (
                        <ShuttleRouteCard
                          key={index}
                          onPress={() => {}}
                          routeName={"Test"}
                          routeNumber="N01"
                          departureTime="Every 30 Minutes"
                          arrivalTime="08:15 AM"
                          distance="12.5"
                          iconName="environment"
                        />
                      ))}
                    </ScrollView>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  timeSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  time: {
    fontSize: 16,
  },
  availability: {
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    fontWeight: "bold",
    color: "black",
  },
});

export default ExploreScreen;
