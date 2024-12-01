//@ts-nocheck
import ShuttleRouteCard from "@/components/cards/routeCard";
import { TimeCard } from "@/components/cards/timeCard";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { router } from "expo-router";
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Button,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ScrollView } from "react-native";
import { RouteContext } from "@/contexts/routeContext";
import { getTimeSlots } from "@/utils/time";
import { supabaseClient } from "@/database/client";
import { MaterialIcons } from "@expo/vector-icons";

const BUFFALO_STATE = {
  latitude: 42.93311142,
  longitude: -78.881111,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function ExploreScreen() {
  const { selectedRoute, setSelectedRoute } = useContext(RouteContext);
  const [shuttleSchedule, setShuttleSchedule] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeShuttles, setActiveShuttles] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const mapRef = useRef(null);

  const fetchPickupLocations = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("pickup_locations")
        .select("*")
        .eq("route", selectedRoute.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setPickupLocations(data || []);
    } catch (error) {
      Alert.alert("Error", "Could not fetch pickup locations");
    }
  };

  const fetchActiveShuttles = async () => {
    try {
      const { data: shuttles, error } = await supabaseClient
        .from("shuttle_locations")
        .select(
          `
          *,
          shuttles (
            shuttle_number
          )
        `
        )
        .eq("route", selectedRoute.id)
        .eq("is_active", true);

      if (error) throw error;
      setActiveShuttles(shuttles || []);
    } catch (error) {
      Alert.alert("Error fetching active shuttles:");
    }
  };

  useEffect(() => {
    if (selectedRoute) {
      setModalVisible(true);
      fetchPickupLocations();

      if (shuttleSchedule.length == 0) {
        let timeSlots = getTimeSlots(
          selectedRoute.runs_from,
          selectedRoute.runs_untill
        );
        if (timeSlots.length > 0) {
          setShuttleSchedule(timeSlots);
        }
      }

      fetchActiveShuttles();

      // Set up real-time subscription for shuttle locations
      const subscription = supabaseClient
        .channel("shuttle_locations_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "shuttle_locations",
            filter: `route_id=eq.${selectedRoute.id}`,
          },
          () => {
            fetchActiveShuttles();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (selectedRoute && mapRef.current) {
      // Calculate the bounds that include all markers
      const coords = [
        {
          latitude: selectedRoute.drop_off_lat,
          longitude: selectedRoute.drop_off_long,
        },
        {
          latitude: selectedRoute.pickup_lat,
          longitude: selectedRoute.pickup_long,
        },

        ...pickupLocations.map((loc) => ({
          latitude: loc.lat,
          longitude: loc.long,
        })),
        ...activeShuttles.map((shuttle) => ({
          latitude: shuttle.current_lat,
          longitude: shuttle.current_long,
        })),
      ];

      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [selectedRoute, pickupLocations, activeShuttles]);

  const handleMarkerPress = (route) => {
    setModalVisible(true);
  };

  const CustomMarker = ({ type }) => (
    <View style={styles.markerContainer}>
      <MaterialIcons
        name={
          type === "shuttle"
            ? "directions-bus"
            : type === "pickup"
            ? "add-location"
            : "location-on"
        }
        size={type === "shuttle" ? 30 : 24}
        color={
          type === "shuttle" ? "#4CAF50" : type === "pickup" ? "#2196F3" : "red"
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} showsUserLocation={true}>
        {selectedRoute && (
          <Marker
            key={`Destination-${selectedRoute.id}`}
            coordinate={{
              latitude: selectedRoute.drop_off_lat,
              longitude: selectedRoute.drop_off_long,
            }}
            title={`${selectedRoute.route} Destination`}
            onPress={() => handleMarkerPress(selectedRoute)}
          >
            <CustomMarker type="dropoff" />
          </Marker>
        )}

        {pickupLocations.map((location, index) => (
          <Marker
            key={`pickup/drop off -${location.id}`}
            coordinate={{
              latitude: location.lat,
              longitude: location.long,
            }}
            title={`Pickup Location ${index + 1}`}
          >
            <CustomMarker type="pickup" />
          </Marker>
        ))}

        {activeShuttles.map((shuttle) => (
          <Marker
            key={`shuttle-${shuttle.id}`}
            coordinate={{
              latitude: shuttle.current_lat,
              longitude: shuttle.current_long,
            }}
            title={`Shuttle ${shuttle.shuttles.shuttle_number}`}
            description={`Active on ${selectedRoute.route}`}
          >
            <CustomMarker type="shuttle" />
          </Marker>
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
                    <Text style={styles.routeTitle}>
                      Route Timings
                      {activeShuttles.length > 0 && (
                        <Text style={styles.activeShuttleText}>
                          {` • ${activeShuttles.length} Active ${
                            activeShuttles.length === 1 ? "Shuttle" : "Shuttles"
                          }`}
                        </Text>
                      )}
                      {activeShuttles.length < 1 && (
                        <Text style={styles.noShuttles}>
                          {` • No Active Shuttles`}
                        </Text>
                      )}
                    </Text>
                    <ScrollView>
                      {shuttleSchedule?.map((shuttle) => (
                        <TimeCard
                          key={Math.random()}
                          onPress={() => {}}
                          routeName={selectedRoute.route
                            .replace("/", "-")
                            .toUpperCase()}
                          routeNumber={shuttle}
                          departureTime={shuttle}
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
    backgroundColor: "rgba(0,0,0,0.2)",
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
  activeShuttleText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  noShuttles: {
    color: "red",
    fontSize: 14,
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
  markerContainer: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
