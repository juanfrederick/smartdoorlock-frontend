import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import InputField from "../components/InputField";
import { resetAuthState, userLogin } from "../redux/reducers/authReducer";
import { useIsFocused } from "@react-navigation/native";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { isLoading, loginError, isLogin, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isFocused) {
      if (!isLoading && user) {
        navigation.navigate("Home");
      }
    }
  }, [navigation, user, isLoading, isFocused]);

  useEffect(() => {
    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", () => {
        BackHandler.exitApp();
        return true;
      });
    }
  }, [isFocused]);

  /** This is for reseting the state when navigating back to the login page */
  useEffect(() => {
    if (isFocused) {
      setEmail("");
      setPassword("");
      dispatch(resetAuthState());
    }
  }, [isFocused]);

  useEffect(() => {
    if (isLogin) {
      navigation.navigate("Home");
    }
  }, [isLogin]);

  const loginHandler = () => {
    // navigation.navigate("Home");
    const data = {
      email,
      password,
    };
    dispatch(userLogin(data));
  };

  const signupHandler = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      {loginError && <Text>{loginError}</Text>}
      <InputField
        label="Email"
        value={email}
        setValue={setEmail}
        type="email"
      />
      <InputField
        label="Password"
        value={password}
        setValue={setPassword}
        type="password"
      />
      <Button title="Login" onPress={loginHandler} disabled={isLoading} />
      <Button title="Signup" onPress={signupHandler} />
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

export default Login;
