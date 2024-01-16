import React from "react";
import { StyleSheet, Text, View } from "react-native";

const HistoryListItem = ({ email, date, status }) => {
  return (
    <View style={style.container}>
      <Text style={style.email}>{email}</Text>
      <View style={style.dateStatusCont}>
        <Text>{date}</Text>
        <Text style={status ? style.textSuccess : style.textError}>
          {status ? "Unlock" : "Lock"}
        </Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  email: {
    fontWeight: "bold",
  },
  dateStatusCont: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  textError: {
    color: "red",
  },
  textSuccess: {
    color: "green",
  },
});

export default HistoryListItem;
