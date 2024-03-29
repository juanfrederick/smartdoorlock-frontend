import { StatusBar } from "expo-status-bar";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch } from "react-redux";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import HomeScreen from "./screens/HomeScreen";
import store from "./redux/store";
import { useEffect } from "react";
import { setIsLoading, setUser } from "./redux/reducers/authReducer";
import { retrieveData } from "./routes/asynchStorageFunc";
import SettingScreen from "./screens/SettingScreen";
import HistoryScreen from "./screens/HistoryScreen";

import usePushNotifications from "./hooks/usePushNotificationState";
import { addPhoneToken } from "./redux/reducers/userReducer";
import DetectScreen from "./screens/DetectScreen";

const Stack = createNativeStackNavigator();

const Route = () => {
  const dispatch = useDispatch();
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    retrieveData("token").then((res) => {
      if (res) {
        dispatch(setIsLoading());
        dispatch(setUser(res));
      }
    });
  }, [retrieveData]);

  useEffect(() => {
    if (expoPushToken.data) {
      dispatch(addPhoneToken(expoPushToken.data));
    }
    console.log("This is token", expoPushToken);
  }, [expoPushToken]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detect"
          component={DetectScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Route />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: "4px",
  },
});
