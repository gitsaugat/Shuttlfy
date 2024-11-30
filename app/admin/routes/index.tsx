//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { supabaseClient as supabase } from "@/database/client";
import { router, useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

export default function RouteList() {
  const navigation = useRouter();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from("routes")
        .select("*")
        .order("route", { ascending: true });

      if (error) throw error;
      setRoutes(data);
    } catch (error) {
      alert("Error fetching routes: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRoutes();
  };

  const handleDelete = async (routeId, routeName) => {
    Alert.alert(
      "Delete Route",
      `Are you sure you want to delete "${routeName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("routes")
                .delete()
                .eq("id", routeId);

              if (error) throw error;
              fetchRoutes();
              Alert.alert("Success", "Route deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Error deleting route: " + error.message);
            }
          },
        },
      ]
    );
  };

  const getRegionForRoute = (
    pickupLat,
    pickupLong,
    dropoffLat,
    dropoffLong
  ) => {
    const minLat = Math.min(pickupLat, dropoffLat);
    const maxLat = Math.max(pickupLat, dropoffLat);
    const minLong = Math.min(pickupLong, dropoffLong);
    const maxLong = Math.max(pickupLong, dropoffLong);

    const midLat = (minLat + maxLat) / 2;
    const midLong = (minLong + maxLong) / 2;
    const latDelta = (maxLat - minLat) * 1.5;
    const longDelta = (maxLong - minLong) * 1.5;

    return {
      latitude: midLat,
      longitude: midLong,
      latitudeDelta: Math.max(latDelta, 0.0922),
      longitudeDelta: Math.max(longDelta, 0.0421),
    };
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Available Routes</Text>

        {routes.length === 0 ? (
          <Text style={styles.noRoutes}>No routes available</Text>
        ) : (
          routes.map((route) => {
            const pickupLat = parseFloat(route.pickup_lat);
            const pickupLong = parseFloat(route.pickup_long);
            const dropoffLat = parseFloat(route.drop_off_lat);
            const dropoffLong = parseFloat(route.drop_off_long);

            return (
              <View
                key={route.id}
                style={[
                  styles.routeCard,
                  !route.available && styles.inactiveRoute,
                ]}
              >
                <TouchableOpacity
                  style={styles.routeContent}
                  onPress={() => router.push(`/admin/routes/edit/${route.id}`)}
                >
                  <View style={styles.routeHeader}>
                    <Text style={styles.routeName}>{route.route}</Text>
                    <View style={styles.headerRight}>
                      <View
                        style={[
                          styles.statusBadge,
                          route.available
                            ? styles.activeBadge
                            : styles.inactiveBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: route.available ? "#1b873f" : "#d92d20" },
                          ]}
                        >
                          {route.available ? "Active" : "Inactive"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDelete(route.id, route.route);
                        }}
                      >
                        <Feather name="trash-2" size={20} color="#d92d20" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={getRegionForRoute(
                        pickupLat,
                        pickupLong,
                        dropoffLat,
                        dropoffLong
                      )}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      pitchEnabled={false}
                      rotateEnabled={false}
                    >
                      <Marker
                        coordinate={{
                          latitude: pickupLat,
                          longitude: pickupLong,
                        }}
                        title="Pickup"
                        pinColor="green"
                      />
                      <Marker
                        coordinate={{
                          latitude: dropoffLat,
                          longitude: dropoffLong,
                        }}
                        title="Drop-off"
                        pinColor="red"
                      />
                    </MapView>
                  </View>

                  <View style={styles.scheduleInfo}>
                    <Text style={styles.label}>Schedule:</Text>
                    <Text style={styles.scheduleText}>
                      Runs every {route.runs_every} minutes{"\n"}
                      {route.runs_from} to {route.runs_untill}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/admin/routes/create")}
      >
        <View style={styles.fabInner}>
          <Text style={styles.fabIcon}>+</Text>
        </View>
        <View style={styles.fabTextContainer}>
          <Text style={styles.fabText}>Add New Route</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
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
  noRoutes: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeContent: {
    flex: 1,
  },
  inactiveRoute: {
    opacity: 0.7,
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "#e6f4ea",
  },
  inactiveBadge: {
    backgroundColor: "#fce8e6",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 4,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  scheduleInfo: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabInner: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  fabIcon: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: -2,
  },
  fabTextContainer: {
    marginLeft: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
