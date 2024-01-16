import React, { useEffect, useState } from "react";
import { BackHandler, Button, StyleSheet, Text, View } from "react-native";
import InputField from "../components/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAuthState,
  setSignupError,
  userSignup,
} from "../redux/reducers/authReducer";
import { useIsFocused } from "@react-navigation/native";

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setconfirmPw] = useState("");

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { isLoading, signupError, isLogin, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isFocused) {
      if (!isLoading && user) {
        navigation.navigate("Home");
      }
    }
  }, [navigation, isLoading, isFocused, user]);

  useEffect(() => {
    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", () => {
        navigation.navigate("Login");
        return true;
      });
    }
  }, []);

  /** This is for reseting the state when navigating back to the login page */
  useEffect(() => {
    if (isFocused) {
      setEmail("");
      setPassword("");
      setconfirmPw("");
      dispatch(resetAuthState());
    }
  }, [isFocused]);

  useEffect(() => {
    if (isLogin) {
      navigation.navigate("Home");
    }
  }, [isLogin]);

  const signupHandler = () => {
    // navigation.navigate("Home");
    if (password !== confirmPw) {
      dispatch(setSignupError("Password and confirm password not same"));
      return;
    }

    const data = { email, password };

    dispatch(userSignup(data));
  };

  return (
    <View style={styles.container}>
      <Text>Signup</Text>
      {signupError && <Text>{signupError}</Text>}
      <InputField label="Email" value={email} setValue={setEmail} />
      <InputField label="Password" value={password} setValue={setPassword} />
      <InputField
        label="Confirm Password"
        value={confirmPw}
        setValue={setconfirmPw}
      />
      <Button title="signup" onPress={signupHandler} disabled={isLoading} />
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
});

export default Signup;
