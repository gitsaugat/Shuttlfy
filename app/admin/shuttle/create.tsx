//@ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabaseClient as supabase } from "@/database/client";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";

export default function CreateShuttle() {
  const [shuttleNumber, setShuttleNumber] = useState("");

  const handleSubmit = async () => {
    if (!shuttleNumber.trim()) {
      Alert.alert("Error", "Please enter a shuttle number");
      return;
    }

    try {
      const { error } = await supabase.from("shuttles").insert([
        {
          shuttle_number: shuttleNumber,
        },
      ]);

      if (error) throw error;

      Alert.alert("Success", "Shuttle added successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Error adding shuttle: " + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Shuttle</Text>

      <View style={styles.formSection}>
        <Text style={styles.label}>Shuttle Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter shuttle number"
          value={shuttleNumber}
          onChangeText={setShuttleNumber}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Shuttle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  formSection: {
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
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },

  submitButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
