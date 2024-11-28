//@ts-nocheck
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import * as Location from "expo-location";
import { supabaseClient as supabase } from "@/database/client";
import { AuthContext } from "@/contexts/authContext";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

const driver = () => {
  const { isLoggedIn, setIsLoggedIn, userInfo, setUserInfo } =
    useContext(AuthContext);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedShuttle, setSelectedShuttle] = useState("");
  const [routes, setRoutes] = useState([]);
  const [shuttles, setShuttles] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    fetchData();
    requestLocationPermission();
    getCurrentLocation();
  }, [isLoggedIn]);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
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
    if (!selectedRoute || !selectedShuttle) return;

    setIsTracking(true);
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      async (location) => {
        try {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCurrentLocation(newLocation);

          // Animate map to new location
          mapRef.current?.animateToRegion(
            {
              ...newLocation,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            1000
          );

          await supabase.from("shuttle_locations").upsert({
            route_id: selectedRoute,
            shuttle_id: selectedShuttle,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error updating location:", error);
        }
      }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

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

        {currentLocation && (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                image={"./"}
                title="Current Location"
                description={
                  isTracking ? "Tracking Active" : "Tracking Inactive"
                }
              >
                <TabBarIcon name={"bus"} color={"black"} />
              </Marker>
            </MapView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

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

export default driver;
