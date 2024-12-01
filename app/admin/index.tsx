//@ts-nocheck
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function AdminDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> Dashboard</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/admin/routes")}
        >
          <View style={styles.iconContainer}>
            <Feather name="map" size={32} color="#2196F3" />
          </View>
          <Text style={styles.cardTitle}>Manage Routes</Text>
          <Text style={styles.cardDescription}>
            Add, edit, or remove bus routes and schedules
          </Text>
          <View style={styles.arrowContainer}>
            <Feather name="chevron-right" size={24} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/admin/shuttle")}
        >
          <View style={styles.iconContainer}>
            <Feather name="truck" size={32} color="#4CAF50" />
          </View>
          <Text style={styles.cardTitle}>Manage Shuttles</Text>
          <Text style={styles.cardDescription}>
            Track and manage shuttle fleet locations
          </Text>
          <View style={styles.arrowContainer}>
            <Feather name="chevron-right" size={24} color="#666" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/admin/pickup")}
        >
          <View style={styles.iconContainer}>
            <Feather name="home" size={32} color="#fc4e03" />
          </View>
          <Text style={styles.cardTitle}>Manage Pickup Locations</Text>
          <Text style={styles.cardDescription}>
            Track and manage pick up locations
          </Text>
          <View style={styles.arrowContainer}>
            <Feather name="chevron-right" size={24} color="#666" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  arrowContainer: {
    position: "absolute",
    right: 20,
    top: "50%",
    marginTop: -12,
  },
});
