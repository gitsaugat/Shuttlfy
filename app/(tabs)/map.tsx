//@ts-nocheck

export const ROUTES = [];

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
import { getTimeSlots } from "@/utils/time";
export default function ExploreScreen() {
  const { selectedRoute, setSelectedRoute } = useContext(RouteContext);

  const [shuttleSchedule, setShuttleSchedule] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(true);
    if (selectedRoute) {
      if (shuttleSchedule.length == 0) {
        let timeSlots = getTimeSlots(
          selectedRoute.runs_from,
          selectedRoute.runs_untill
        );

        if (timeSlots.length > 0) {
          setShuttleSchedule(timeSlots);
        }
      } else {
        console.log(shuttleSchedule, "");
      }
    }
  }, [selectedRoute]);

  const handleMarkerPress = (route) => {
    setModalVisible(true);
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
        {selectedRoute && (
          <Marker
            key={selectedRoute.id}
            coordinate={{
              latitude: selectedRoute.drop_off_lat,
              longitude: selectedRoute.drop_off_long,
            }}
            title={`${selectedRoute.route} Drop Off`}
            pinColor="red"
            onPress={() => {
              handleMarkerPress(selectedRoute);
            }}
          />
        )}
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
                      {shuttleSchedule?.map((shuttle) => (
                        <ShuttleRouteCard
                          key={Math.random()}
                          onPress={() => {}}
                          routeName={selectedRoute.route
                            .replace("/", "-")
                            .toUpperCase()}
                          routeNumber="N01"
                          departureTime={shuttle}
                          arrivalTime="08:15 AM"
                          distance=""
                          status={selectedRoute.available}
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
