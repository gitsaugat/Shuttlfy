//@ts-nocheck
import React, { useEffect } from "react";
import { View, Text, Alert } from "react-native";
import * as Linking from "expo-linking";
import { supabaseClient as supabase } from "../../database/client";

export default function VerificationHandler() {
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const { hostname, path, queryParams } = Linking.parse(event.url);

      if (hostname === "supabase.co" && path.includes("verify")) {
        try {
          const { token } = queryParams;

          if (token) {
            const { error } = await supabase.auth.verifyOtp({
              type: "email",
              token,
            });

            if (error) {
              Alert.alert("Verification Failed", error.message);
            } else {
              Alert.alert("Success", "Email verified successfully!");
            }
          }
        } catch (err) {
          console.error("Verification error:", err);
          Alert.alert("Error", "Something went wrong during verification");
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
}
