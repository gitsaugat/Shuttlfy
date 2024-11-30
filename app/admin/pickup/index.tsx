//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { supabaseClient as supabase } from "@/database/client";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function RouteSelection() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from("routes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRoutes(data || []);
    } catch (error) {
      Alert.alert("Error", "Could not fetch routes");
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (routeId) => {
    router.push(`/admin/pickup/${routeId}`);
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
      <Text style={styles.title}>Select a Route</Text>
      {routes.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="map" size={24} color="#666" />
          <Text style={styles.noRoutes}>No routes available</Text>
          <Text style={styles.emptyStateHelper}>
            Please create a route first
          </Text>
        </View>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.routeCard}
              onPress={() => handleRouteSelect(item.id)}
            >
              <View style={styles.routeInfo}>
                <Text style={styles.routeName}>{item.route}</Text>
                <Text style={styles.routeDetails}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginBottom: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  routeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "500",
  },
  routeDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  noRoutes: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
  },
  emptyStateHelper: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});
