import AsyncStorage from "@react-native-async-storage/async-storage";

// Save data to AsyncStorage
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    // console.log("Data saved successfully");
  } catch (error) {
    console.error("Error saving data: ", error);
  }
};

// Retrieve data from AsyncStorage
const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // Data found
      // console.log("Data retrieved successfully:", JSON.parse(value));
      return JSON.parse(value);
    } else {
      // No data found
      // console.log("No data found");
    }
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
};

// Remove data from AsyncStorage
const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    // console.log("Data removed successfully");
  } catch (error) {
    console.error("Error removing data: ", error);
  }
};

export { storeData, retrieveData, removeData };
