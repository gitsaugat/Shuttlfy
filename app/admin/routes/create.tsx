//@ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { supabaseClient as supabase } from "@/database/client";
import MapView, { Marker } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";

const windowWidth = Dimensions.get("window").width;

export default function AdminRouteForm() {
  const [route, setRoute] = useState("");
  const [pickupCoords, setPickupCoords] = useState({
    lat: "42.93311142",
    lng: "-78.881111",
  });
  const [dropoffCoords, setDropoffCoords] = useState({
    lat: "42.93311142",
    lng: "-78.881111",
  });
  const [runsFrom, setRunsFrom] = useState("");
  const [runsUntil, setRunsUntil] = useState("");
  const [runsEvery, setRunsEvery] = useState("");
  const [available, setAvailable] = useState(true);

  const defaultRegion = {
    latitude: 42.93311142,
    longitude: -78.881111,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase.from("routes").insert([
        {
          route,
          pickup_lat: pickupCoords.lat,
          pickup_long: pickupCoords.lng,
          drop_off_lat: dropoffCoords.lat,
          drop_off_long: dropoffCoords.lng,
          runs_from: runsFrom,
          runs_untill: runsUntil,
          runs_every: parseFloat(runsEvery),
          available,
        },
      ]);

      if (error) throw error;
      alert("Route added successfully!");
    } catch (error) {
      alert("Error adding route: " + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Route</Text>
      <View style={styles.locationSection}>
        <Text style={styles.subtitle}>Route Name</Text>
        <View style={styles.mapContainer}>
          <TextInput
            style={styles.input}
            placeholder="Route Name"
            value={route}
            onChangeText={setRoute}
          />
        </View>
      </View>

      <View style={styles.locationSection}>
        <Text style={styles.subtitle}>Pickup Location</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={defaultRegion}
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
            />
          </MapView>
        </View>
        <View style={styles.coordsDisplay}>
          <Text>Lat: {parseFloat(pickupCoords.lat).toFixed(6)}</Text>
          <Text>Long: {parseFloat(pickupCoords.lng).toFixed(6)}</Text>
        </View>
      </View>

      <View style={styles.locationSection}>
        <Text style={styles.subtitle}>Drop-off Location</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={defaultRegion}
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
            />
          </MapView>
        </View>
        <View style={styles.coordsDisplay}>
          <Text>Lat: {parseFloat(dropoffCoords.lat).toFixed(6)}</Text>
          <Text>Long: {parseFloat(dropoffCoords.lng).toFixed(6)}</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.subtitle}>Operating Hours</Text>
        <View style={styles.timePickerContainer}>
          <View style={styles.timePicker}>
            <Text>Runs From:</Text>
            <TextInput
              style={styles.input}
              placeholder="00:00:00"
              value={runsFrom}
              onChangeText={setRunsFrom}
              keyboardType="default"
            />
          </View>
          <View style={styles.timePicker}>
            <Text>Runs Until</Text>
            <TextInput
              style={styles.input}
              placeholder="00:00:00"
              value={runsUntil}
              onChangeText={setRunsUntil}
              keyboardType="default"
            />
          </View>
        </View>
      </View>
      <View style={styles.locationSection}>
        <Text style={styles.subtitle}>Runs Every ( mins )</Text>
        <View style={styles.mapContainer}>
          <TextInput
            style={styles.input}
            placeholder="30"
            value={runsEvery}
            onChangeText={setRunsEvery}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !available && styles.buttonInactive]}
        onPress={() => setAvailable(!available)}
      >
        <Text style={styles.buttonText}>
          {available ? "Available" : "Not Available"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Route</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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
  coordsDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
  },
  timeContainer: {
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
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  timePicker: {
    alignItems: "center",
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
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
