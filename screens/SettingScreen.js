import React, { useEffect, useState } from "react";
import { BackHandler, Button, StyleSheet, Text, View } from "react-native";
import InputField from "../components/InputField";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../redux/reducers/userReducer";
import { useIsFocused } from "@react-navigation/native";

const SettingScreen = ({ navigation }) => {
  const [lockIdValue, setLockIdValue] = useState("");

  const { lockId, phoneToken } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", () => {
        navigation.navigate("Home");
        return true;
      });
    }
  }, []);

  useEffect(() => {
    if (lockId) {
      setLockIdValue(lockId);
    }
  }, [lockId]);

  const updateHandler = () => {
    const data = {
      dataUpdate: {
        lockId: lockIdValue,
        phoneToken,
      },
      token: user.token,
    };
    dispatch(updateUserData(data));
  };

  return (
    <View style={styles.container}>
      <Text>SettingScreen</Text>
      <InputField
        label="Lock Id"
        setValue={setLockIdValue}
        value={lockIdValue}
      />
      <Button title="Update" onPress={updateHandler} />
      <View style={styles.buttonContainer}>
        <Button
          title="setting"
          onPress={() => {
            navigation.navigate("Settings");
          }}
        />
        <Button
          title="home"
          onPress={() => {
            navigation.navigate("Home");
          }}
        />
        <Button
          title="history"
          onPress={() => {
            navigation.navigate("History");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    bottom: 0,
  },
});

export default SettingScreen;
