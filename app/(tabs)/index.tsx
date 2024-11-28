//@ts-nocheck
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import ShuttleRouteCard from "@/components/cards/routeCard";
import { supabaseClient } from "@/database/client";

// context API
import { AuthContext } from "@/contexts/authContext";
import { RouteContext } from "@/contexts/routeContext";

export default function RouteListScreen() {
  const [routes, setRoutes] = useState();

  const { selectedRoute, setSelectedRoute } = useContext(RouteContext);
  const { isLoggedIn, setIsLoggedIn, userInfo, setUserInfo } =
    useContext(AuthContext);

  async function getRoutes() {
    try {
      const { data: routes, error } = await supabaseClient
        .from("routes")
        .select("*");

      if (error) throw error;
      return routes;
    } catch (error) {
      Alert.alert("Error fetching routes:", error);
      return [];
    }
  }

  useEffect(() => {
    // Check login status
    if (!isLoggedIn) {
      setTimeout(() => router.replace("/login"), 1000);
      return;
    }

    const fetchData = async () => {
      const data = await getRoutes();
      setRoutes(data);
    };

    fetchData();
  }, [isLoggedIn, router]);

  const router = useRouter();

  const navigateToDetails = (routeName) => {
    router.push(`/map`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.routeItem}
      onPress={() => navigateToDetails(item.name)}
    >
      <ShuttleRouteCard
        onPress={() => {
          setSelectedRoute(item);
          navigateToDetails(item.name);
        }}
        routeName={item.route}
        routeNumber="N01"
        departureTime={`Every ${item.runs_every} Minutes`}
        arrivalTime="08:15 AM"
        distance="12.5"
        iconName="environment"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Route</Text>
      <FlatList
        data={routes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // SafeAreaView container should take up the full height
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  flatListContainer: {
    flexGrow: 1, // Ensures the flat list can grow and take up remaining space
    paddingBottom: 20,
  },
  routeItem: {
    marginLeft: "8%",
    marginRight: "8%",
    marginTop: "2%",
    marginBottom: "2%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  routeImage: {
    borderRadius: 25,
    marginRight: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  routeDetails: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
});
