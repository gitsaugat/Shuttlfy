//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { supabaseClient as supabase } from "@/database/client";
import { useLocalSearchParams, router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

export default function PickupLocations() {
  const { routeId } = useLocalSearchParams();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeDetails, setRouteDetails] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchLocations();
    fetchRouteDetails();
  }, [routeId]);

  const fetchRouteDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("routes")
        .select("*")
        .eq("id", routeId)
        .single();

      if (error) throw error;
      setRouteDetails(data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch route details");
    }
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("pickup_locations")
        .select("*")
        .eq("route", routeId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setLocations(data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch pickup locations");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    try {
      const { error } = await supabase.from("pickup_locations").insert([
        {
          route: routeId,
          lat: latitude,
          long: longitude,
        },
      ]);

      if (error) throw error;

      fetchLocations();
      Alert.alert("Success", "Pickup location added successfully");
    } catch (error) {
      Alert.alert("Error", "Could not add pickup location");
    }
  };

  const handleDeleteLocation = async (locationId) => {
    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this pickup location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("pickup_locations")
                .delete()
                .eq("id", locationId);

              if (error) throw error;

              fetchLocations();
              Alert.alert("Success", "Location deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Could not delete location");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>
          Pickup Locations for Route: {routeDetails?.route}
        </Text>

        <View style={styles.mapSection}>
          <Text style={styles.subtitle}>Add New Location</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(routeDetails?.pickup_lat || 42.93311142),
                longitude: parseFloat(routeDetails?.pickup_long || -78.881111),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleAddLocation}
            >
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.long,
                  }}
                  pinColor={selectedLocation === location.id ? "blue" : "red"}
                  onPress={() => setSelectedLocation(location.id)}
                />
              ))}
            </MapView>
          </View>
          <Text style={styles.mapHelper}>
            Tap on the map to add a new pickup location
          </Text>
        </View>

        <View style={styles.locationsSection}>
          <Text style={styles.subtitle}>Existing Locations</Text>
          {locations.length === 0 ? (
            <Text style={styles.noLocations}>
              No pickup locations added yet
            </Text>
          ) : (
            locations.map((location) => (
              <View
                key={location.id}
                style={[
                  styles.locationCard,
                  selectedLocation === location.id && styles.selectedCard,
                ]}
              >
                <TouchableOpacity
                  style={styles.locationContent}
                  onPress={() => setSelectedLocation(location.id)}
                >
                  <View>
                    <Text style={styles.coordinates}>
                      Lat: {location.lat.toFixed(6)}
                    </Text>
                    <Text style={styles.coordinates}>
                      Long: {location.long.toFixed(6)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteLocation(location.id)}
                  >
                    <Feather name="trash-2" size={20} color="#d92d20" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
  },
  mapSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapHelper: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  locationsSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  selectedCard: {
    borderColor: "#2196F3",
    backgroundColor: "#f5f9ff",
  },
  locationContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  coordinates: {
    fontSize: 14,
    color: "#333",
  },
  deleteButton: {
    padding: 8,
  },
  noLocations: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginTop: 20,
  },
});
