import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const InputField = ({ label, value, setValue, type }) => {
  return (
    <View style={styles.textInputContainer}>
      <Text>{label}</Text>
      <TextInput
        value={value}
        style={styles.textInput}
        onChangeText={(value) => setValue(value)}
        secureTextEntry={type === "password"}
        keyboardType={type === "email" ? "email-address" : "default"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    width: "70%",
    height: "150px",
  },
  textInput: {
    width: "full",
    height: "80px",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});

export default InputField;
