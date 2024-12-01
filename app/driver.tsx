//@ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import * as Location from "expo-location";
import { supabaseClient as supabase } from "@/database/client";
import { AuthContext } from "@/contexts/authContext";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

const driver = () => {
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedShuttle, setSelectedShuttle] = useState("");
  const [routes, setRoutes] = useState([]);
  const [shuttles, setShuttles] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [trackingId, setTrackingId] = useState(null);
  const { isLoggedIn, setIsLoggedIn, userInfo, setUserInfo } =
    useContext(AuthContext);

  useEffect(() => {
    fetchData();
    requestLocationPermission();
    getCurrentLocation();

    // Cleanup on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      stopTracking();
    };
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  };

  const fetchData = async () => {
    try {
      const { data: routesData } = await supabase.from("routes").select("*");
      const { data: shuttlesData } = await supabase
        .from("shuttles")
        .select("*");

      setRoutes(
        routesData?.map((route) => ({
          key: route.id,
          value: route.route,
        })) || []
      );

      setShuttles(
        shuttlesData?.map((shuttle) => ({
          key: shuttle.id,
          value: `Shuttle ${shuttle.shuttle_number}`,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission denied");
    }
  };

  const startTracking = async () => {
    if (!selectedRoute || !selectedShuttle || !currentLocation) return;

    try {
      // Insert initial tracking record
      const { data, error } = await supabase
        .from("shuttle_locations")
        .insert({
          route: selectedRoute,
          shuttle: selectedShuttle,
          driver: userInfo?.userInfo[0]?.id,
          current_lat: currentLocation.latitude,
          current_long: currentLocation.longitude,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setTrackingId(data.id);
      setIsTracking(true);

      // Start location watching
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 15000, // Update every 15 seconds
          distanceInterval: 10,
        },
        async (location) => {
          try {
            // Update location in database
            await supabase
              .from("shuttle_locations")
              .update({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                timestamp: new Date().toISOString(),
              })
              .eq("id", data.id);

            setCurrentLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          } catch (error) {
            console.error("Error updating location:", error);
          }
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error("Error starting tracking:", error);
    }
  };

  const stopTracking = async () => {
    try {
      // Remove location subscription
      if (locationSubscription) {
        locationSubscription.remove();
      }

      // Delete tracking record from database
      if (trackingId) {
        await supabase.from("shuttle_locations").delete().eq("id", trackingId);
      }

      setIsTracking(false);
      setLocationSubscription(null);
      setTrackingId(null);
    } catch (error) {
      console.error("Error stopping tracking:", error);
    }
  };

  // ... Rest of the render code with MapView remains the same ...

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Driver Dashboard</Text>

        <View style={styles.selectContainer}>
          <SelectList
            placeholder="Select Route"
            setSelected={setSelectedRoute}
            data={routes}
            save="key"
            boxStyles={styles.selectBox}
            disabled={isTracking}
          />

          <SelectList
            placeholder="Select Shuttle"
            setSelected={setSelectedShuttle}
            data={shuttles}
            save="key"
            boxStyles={styles.selectBox}
            disabled={isTracking}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isTracking ? styles.stopButton : styles.startButton,
            (!selectedRoute || !selectedShuttle) && styles.disabledButton,
          ]}
          onPress={isTracking ? stopTracking : startTracking}
          disabled={!selectedRoute || !selectedShuttle}
        >
          <Text style={styles.buttonText}>
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </Text>
        </TouchableOpacity>

        {isTracking && (
          <Text style={styles.trackingText}>Location tracking active...</Text>
        )}

        <View style={styles.mapContainer}>
          {currentLocation && (
            <MapView style={styles.map} initialRegion={currentLocation}>
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
              >
                <View style={styles.markerContainer}>
                  <MaterialIcons
                    name="directions-bus"
                    size={30}
                    color={isTracking ? "#4CAF50" : "#666"}
                  />
                </View>
              </Marker>
            </MapView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default driver;

// ... Styles remain the same ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  selectContainer: {
    gap: 16,
    marginBottom: 30,
  },
  selectBox: {
    borderRadius: 8,
    borderColor: "#ddd",
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  trackingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontStyle: "italic",
  },
  mapContainer: {
    marginTop: 20,
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    elevation: Platform.OS === "android" ? 5 : 0,
    shadowColor: Platform.OS === "ios" ? "#000" : "transparent",
    shadowOffset:
      Platform.OS === "ios" ? { width: 0, height: 2 } : { width: 0, height: 0 },
    shadowOpacity: Platform.OS === "ios" ? 0.25 : 0,
    shadowRadius: Platform.OS === "ios" ? 3.84 : 0,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
