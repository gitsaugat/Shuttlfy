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
  Alert,
} from "react-native";
import { supabaseClient as supabase } from "@/database/client";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

export default function ShuttleList() {
  const [shuttles, setShuttles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShuttles = async () => {
    try {
      const { data, error } = await supabase
        .from("shuttles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShuttles(data);
    } catch (error) {
      Alert.alert("Error", "Error fetching shuttles: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShuttles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchShuttles();
  };

  const handleDelete = async (id, shuttleNumber) => {
    Alert.alert(
      "Delete Shuttle",
      `Are you sure you want to delete shuttle "${shuttleNumber}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("shuttles")
                .delete()
                .eq("id", id);

              if (error) throw error;
              fetchShuttles();
              Alert.alert("Success", "Shuttle deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Error deleting shuttle: " + error.message);
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Shuttles</Text>

        {shuttles.length === 0 ? (
          <Text style={styles.noShuttles}>No shuttles available</Text>
        ) : (
          shuttles.map((shuttle) => (
            <View key={shuttle.id} style={styles.shuttleCard}>
              <View style={styles.shuttleHeader}>
                <Text style={styles.shuttleNumber}>
                  Shuttle #{shuttle.shuttle_number}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleDelete(shuttle.id, shuttle.shuttle_number)
                  }
                  style={styles.deleteButton}
                >
                  <Feather name="trash-2" size={20} color="#d92d20" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/admin/shuttle/create")}
      >
        <View style={styles.fabInner}>
          <Text style={styles.fabIcon}>+</Text>
        </View>
        <View style={styles.fabTextContainer}>
          <Text style={styles.fabText}>Add New Shuttle</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  noShuttles: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  shuttleCard: {
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
  shuttleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  shuttleNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
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
  locationInfo: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
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
