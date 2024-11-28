//@ts-nocheck
import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

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
