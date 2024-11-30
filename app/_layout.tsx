import "expo-router/entry";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import RouteProvider, { RouteContext } from "@/contexts/routeContext";
import AuthProvider, { AuthContext } from "@/contexts/authContext";
import { RequireAuth } from "@/components/auth/requireAuth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RouteProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#f4f4f4" },
              headerTintColor: "#000",
              headerBackTitle: "Back",
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerBackVisible: false,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                title: "Login",
                headerBackVisible: false,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="register"
              options={{
                title: "Register",
                headerBackVisible: false,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="map"
              options={{
                title: "Map",
                headerBackVisible: true,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="driver"
              options={{
                title: "Driver Portal",
                headerBackVisible: true,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="admin/index"
              options={{
                title: "Admin",
                headerBackVisible: true,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="admin/routes/index"
              options={{
                title: "Routes",
                headerBackVisible: true,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="admin/routes/create"
              options={{
                title: "Create Route",
                headerBackVisible: true,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="admin/routes/edit/[id]/index"
              options={{
                title: "Edit Route",
                headerBackVisible: true,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="admin/shuttle/index"
              options={{
                title: "Shuttles",
                headerBackVisible: true,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen
              name="admin/shuttle/create"
              options={{
                title: "Add Shuttle",
                headerBackVisible: true,
                headerStyle: {
                  backgroundColor: "#1A73E8",
                },
              }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </RouteProvider>
    </AuthProvider>
  );
}
