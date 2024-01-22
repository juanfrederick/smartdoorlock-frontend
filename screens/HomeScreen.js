import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View, BackHandler } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthState, userLogout } from "../redux/reducers/authReducer";
import { removeData, retrieveData } from "../routes/asynchStorageFunc";
import { getUserData, resetUserState } from "../redux/reducers/userReducer";
import {
  getLock,
  lockDoor,
  resetLockState,
  unlockDoor,
} from "../redux/reducers/lockReducer";
import { useIsFocused } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { lockId, userError, phoneToken } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const { lockStatus, lockError, isLoading } = useSelector(
    (state) => state.lock
  );

  useEffect(() => {
    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", () => {
        BackHandler.exitApp();
        return true;
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      if (user) {
        console.log("ini user", user);
        dispatch(getUserData(user.token));
      }

      if (!user) {
        navigation.navigate("Login");
      }
    }
  }, [user, isFocused]);

  useEffect(() => {
    if (lockId && user) {
      dispatch(getLock(user.token));
    }
  }, [lockId]);

  useEffect(() => {
    if (userError === "Request is not authorized") {
      console.log("---home-screen request is not authorized");
      dispatch(resetAuthState());
      dispatch(resetUserState());
      dispatch(resetLockState());

      removeData("token").then(() => {
        navigation.navigate("Login");
      });
    }
  }, [isFocused, userError]);

  const logoutHandler = () => {
    dispatch(
      userLogout({ dataUpdated: { phoneToken: phoneToken }, token: user.token })
    );
    navigation.navigate("Login");
    dispatch(resetAuthState());
    dispatch(resetUserState());
  };

  const handleAuthenticationPress = async () => {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();

      if (!isAvailable) {
        console.log("Biometrics not available on this device");
        return;
      }

      const hasBiometrics = await LocalAuthentication.isEnrolledAsync();

      if (!hasBiometrics) {
        console.log("No biometrics enrolled on this device");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to Unlock",
        // fallbackLabel: "",
      });

      if (result.success) {
        console.log("LOCK ONN");
        dispatch(unlockDoor(user.token));
      } else {
        console.log("Authentication failed or user canceled");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const onHandler = async () => {
    await handleAuthenticationPress();
  };

  const offHandler = () => {
    console.log("LOCK OFF");
    dispatch(lockDoor(user.token));
  };

  return (
    <View style={styles.container}>
      {lockError && <Text>{lockError}</Text>}
      <Text>{phoneToken}</Text>
      <Text>HomeScreen, Welcome back {user !== null && user.email}!</Text>
      <View style={styles.logoutBtnCont}>
        <Button title="logout" onPress={logoutHandler} />
      </View>
      {lockStatus !== null && (
        <Button
          title={lockStatus ? "off" : "on"}
          onPress={lockStatus ? offHandler : onHandler}
          disabled={isLoading}
        />
      )}
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
    gap: 10,
  },
  buttonContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    bottom: 0,
  },
  logoutBtnCont: {
    position: "absolute",
    top: 50,
    right: 10,
  },
});

export default HomeScreen;
