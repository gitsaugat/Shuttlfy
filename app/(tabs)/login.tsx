//@ts-nocheck
import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { supabaseClient as supabase } from "../../database/client";
import { AuthInput } from "../../components/auth/authInput";

import { AuthContext } from "@/contexts/authContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { isLoggedIn, setIsLoggedIn, userInfo, setUserInfo } =
    useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const authData = data;
    const authError = error;

    if (authError) {
      Alert.alert("Login Error", error.message);
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", authData.user?.email);

      if (error) {
        Alert.alert("Login Error");
      } else {
        setUserInfo({ auth: authData, userInfo: data });
        setIsLoggedIn(true);

        if (data.length > 0) {
          if (data[0].user_type == "student") {
            router.push("/");
          }
          if (data[0].user_type == "driver") {
            router.push("/driver");
          }
        }
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shuttle App Login</Text>

      <View style={styles.formContainer}>
        <AuthInput placeholder="Email" value={email} onChangeText={setEmail} />
        <AuthInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text>Don't have an account? </Text>
          <Link href="/register" style={styles.registerLink}>
            Register
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  loginButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  registerLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
