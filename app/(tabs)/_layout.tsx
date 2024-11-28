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
        tabBarStyle: {
          display: "none",
          backgroundColor: "#333", // Dark background for the tab bar
        },
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
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
        name="index"
        options={{
          href: {
            pathname: "/",
          },
          title: "Routes",
          headerLeft: () => null,
          headerRight: ({ color, focused }) => (
            <LogOut color={color} focused={focused} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "location" : "location-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          href: {
            pathname: "/map",
            params: {},
          },
          title: "Explore",
          headerRight: ({ color, focused }) => (
            <LogOut color={color} focused={focused} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "map" : "map-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: {
            pathname: "/explore",
          },
          title: "Shuttle Times",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "bus" : "bus-outline"} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          href: {
            pathname: "/login",
          },
          title: "User Login",
          headerLeft: () => null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "bus" : "bus-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          href: {
            pathname: "/register",
          },
          title: "User Registration",
          headerLeft: () => null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "bus" : "bus-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="verification"
        options={{
          href: {
            pathname: "/verification",
          },
          title: "User Verification",
          headerLeft: () => null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "bus" : "bus-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="driver"
        options={{
          href: {
            pathname: "/driver",
          },
          title: "Driver Portal",
          headerLeft: () => null,
          headerRight: ({ color, focused }) => (
            <LogOut color={color} focused={focused} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "bus" : "bus-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
