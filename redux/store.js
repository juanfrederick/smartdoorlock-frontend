import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer.js";
import userReducer from "./reducers/userReducer.js";
import lockReducer from "./reducers/lockReducer.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    lock: lockReducer,
  },
});

export default store;
