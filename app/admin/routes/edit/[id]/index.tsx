//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabaseClient as supabase } from "@/database/client";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, router } from "expo-router";

function EditRoute() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState("");
  const [pickupCoords, setPickupCoords] = useState({ lat: "", lng: "" });
  const [dropoffCoords, setDropoffCoords] = useState({ lat: "", lng: "" });
  const [runsFrom, setRunsFrom] = useState("");
  const [runsUntil, setRunsUntil] = useState("");
  const [runsEvery, setRunsEvery] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    fetchRoute();
  }, [id]);

  const fetchRoute = async () => {
    try {
      const { data, error } = await supabase
        .from("routes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setRoute(data.route);
        setPickupCoords({
          lat: data.pickup_lat.toString(),
          lng: data.pickup_long.toString(),
        });
        setDropoffCoords({
          lat: data.drop_off_lat.toString(),
          lng: data.drop_off_long.toString(),
        });
        setRunsFrom(data.runs_from);
        setRunsUntil(data.runs_untill);
        setRunsEvery(data.runs_every.toString());
        setAvailable(data.available);
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching route: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from("routes")
        .update({
          route,
          pickup_lat: pickupCoords.lat,
          pickup_long: pickupCoords.lng,
          drop_off_lat: dropoffCoords.lat,
          drop_off_long: dropoffCoords.lng,
          runs_from: runsFrom,
          runs_untill: runsUntil,
          runs_every: parseFloat(runsEvery),
          available,
        })
        .eq("id", id);

      if (error) throw error;
      Alert.alert("Success", "Route updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Error updating route: " + error.message);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete Route", "Are you sure you want to delete this route?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase
              .from("routes")
              .delete()
              .eq("id", id);

            if (error) throw error;
            Alert.alert("Success", "Route deleted successfully", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (error) {
            Alert.alert("Error", "Error deleting route: " + error.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Route</Text>

      <TextInput
        style={styles.input}
        placeholder="Route Name"
        value={route}
        onChangeText={setRoute}
      />

      <View style={styles.locationSection}>
        <Text style={styles.subtitle}>Pickup Location</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(pickupCoords.lat),
              longitude: parseFloat(pickupCoords.lng),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setPickupCoords({
                lat: latitude.toString(),
                lng: longitude.toString(),
              });
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(pickupCoords.lat),
                longitude: parseFloat(pickupCoords.lng),
              }}
              title="Pickup Location"
              pinColor="green"
            />
          </MapView>
        </View>
      </View>

      <View style={styles.locationSection}>
        <Text style={styles.subtitle}>Drop-off Location</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(dropoffCoords.lat),
              longitude: parseFloat(dropoffCoords.lng),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setDropoffCoords({
                lat: latitude.toString(),
                lng: longitude.toString(),
              });
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(dropoffCoords.lat),
                longitude: parseFloat(dropoffCoords.lng),
              }}
              title="Drop-off Location"
              pinColor="red"
            />
          </MapView>
        </View>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.subtitle}>Operating Hours</Text>
        <View style={styles.timeInputContainer}>
          <View style={styles.timeInputWrapper}>
            <Text style={styles.timeLabel}>From:</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="09:00"
              value={runsFrom}
              onChangeText={setRunsFrom}
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View style={styles.timeInputWrapper}>
            <Text style={styles.timeLabel}>To:</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="17:00"
              value={runsUntil}
              onChangeText={setRunsUntil}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Runs Every (minutes)"
        value={runsEvery}
        onChangeText={setRunsEvery}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, !available && styles.buttonInactive]}
        onPress={() => setAvailable(!available)}
      >
        <Text style={styles.buttonText}>
          {available ? "Available" : "Not Available"}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Route</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Route</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  locationSection: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
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
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 200,
  },
  timeSection: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  timeInputWrapper: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonInactive: {
    backgroundColor: "#f44336",
  },
  buttonContainer: {
    gap: 10,
    marginVertical: 10,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditRoute;
