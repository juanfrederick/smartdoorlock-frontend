import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  BackHandler,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getDetectHistory } from "../redux/reducers/lockReducer";

const DetectScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const { user } = useSelector((state) => state.auth);
  const { detectHistory } = useSelector((state) => state.lock);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      dispatch(getDetectHistory(user.token));

      BackHandler.addEventListener("hardwareBackPress", () => {
        navigation.navigate("Home");
        return true;
      });
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text>DetectScreen</Text>
      <View>
        {detectHistory.map((val) => {
          return (
            <View>
              <Text key={val.id}>{val.date}</Text>
              {val.cropImage.map((val, index) => {
                return (
                  <Image
                    key={index}
                    source={{ uri: `data:image/jpeg;base64,${val}` }}
                    alt="test"
                    style={{ width: 200, height: 200 }}
                  />
                );
              })}
            </View>
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
        <Button
          title="detect"
          onPress={() => {
            navigation.navigate("Detect");
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

export default DetectScreen;
