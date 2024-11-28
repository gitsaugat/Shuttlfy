//@ts-nocheck
import React, { useContext } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { TabBarIcon } from "../navigation/TabBarIcon";
import { AuthContext } from "@/contexts/authContext";
export const AuthInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#888"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 12,
  },
});

export const LogOut = ({ focused, color }) => {
  const { setIsLoggedIn, setUserInfo } = useContext(AuthContext);
  function handleLogout() {
    setIsLoggedIn(false);
    setUserInfo({});
  }
  return (
    <TabBarIcon
      name={focused ? "log-out" : "log-out-outline"}
      color={color}
      onPress={() => handleLogout()}
      style={{ marginRight: "10" }}
    />
  );
};
