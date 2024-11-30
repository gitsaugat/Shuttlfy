//@ts-nocheck
import { useRouter, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity } from "react-native";
import { LogOut } from "@/components/auth/authInput";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: "#1A73E8",
        },
        headerBackButtonDisplayMode: "default",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginLeft: 10 }}
          >
            <TabBarIcon name="arrow-back-circle" color={"white"} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="routes"
        options={{
          title: "Routes",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="map" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="shuttles"
        options={{
          title: "Shuttles",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="truck" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
