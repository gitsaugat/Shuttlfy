//@ts-nocheck
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { supabaseClient as supabase } from "../../database/client";
import { AuthInput } from "../../components/auth/authInput";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    // Basic validation
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
        },
      },
    });

    if (error) {
      Alert.alert("Registration Error", error.message);
    } else {
      // Optional: Store additional user details in a custom users table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user?.id,
        email,
        user_type: userType,
      });

      if (profileError) {
        Alert.alert("Error Creating Profile, Please try again later");
      }

      router.replace("/login");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register for Shuttle App</Text>

      <View style={styles.formContainer}>
        <AuthInput placeholder="Email" value={email} onChangeText={setEmail} />
        <AuthInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AuthInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === "student" && styles.selectedUserType,
            ]}
            onPress={() => setUserType("student")}
          >
            <Text style={styles.userTypeButtonText}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === "driver" && styles.selectedUserType,
            ]}
            onPress={() => setUserType("driver")}
          >
            <Text style={styles.userTypeButtonText}>Driver</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text>Already have an account? </Text>
          <Link href="/login" style={styles.loginLink}>
            Login
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
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  userTypeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedUserType: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  userTypeButtonText: {
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  loginLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
