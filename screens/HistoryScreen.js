import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { BackHandler, Button, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getLockHistory } from "../redux/reducers/lockReducer";
import HistoryListItem from "../components/HistoryListItem";
import { removeData } from "../routes/asynchStorageFunc";

const HistoryScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { lockHistory, lockError } = useSelector((state) => state.lock);

  useEffect(() => {
    if (isFocused) {
      dispatch(getLockHistory(user.token));

      BackHandler.addEventListener("hardwareBackPress", () => {
        navigation.navigate("Home");
        return true;
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (lockError === "Request is not authorized") {
      console.log("---home-screen request is not authorized");
      dispatch(resetAuthState());
      dispatch(resetUserState());
      dispatch(resetLockState());

      removeData("token").then(() => {
        navigation.navigate("Login");
      });
    }
  }, [isFocused, lockError]);

  return (
    <View style={styles.container}>
      <Text>HistoryScreen</Text>
      <View>
        {/* <HistoryListItem email={"asd@gmail"} date="12 okt 2023" status={true} /> */}
        {lockHistory.map((val) => {
          return (
            <HistoryListItem
              key={val.id}
              date={val.date}
              email={val.email}
              status={val.status}
            />
          );
        })}
      </View>
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

export default HistoryScreen;
