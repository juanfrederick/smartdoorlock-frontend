import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storeData, removeData } from "../../routes/asynchStorageFunc";

const URL = process.env.EXPO_PUBLIC_API_URL;

const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSignup = createAsyncThunk(
  "auth/userSignup",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${URL}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userLogout = createAsyncThunk(
  "auth/userLogout",
  async (payload, { rejectWithValue }) => {
    const { dataUpdated, token } = payload;
    try {
      console.log("asdasdasdasda", payload);
      console.log("asdasdasdasdassss", payload);
      const response = await fetch(`${URL}/api/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataUpdated),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  loginError: null,
  signupError: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoading: (state) => {
      state.isLoading = true;
    },
    resetAuthState: (state) => {
      state.loginError = null;
      state.signupError = null;
      state.isLoading = false;
      state.user = null;
    },
    setSignupError: (state, action) => {
      state.signupError = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    /** Login reducer */
    builder.addCase(userLogin.pending, (state, action) => {
      state.isLoading = true;
      state.loginError = null;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      console.log("fullfiled", action.payload);
      state.isLoading = false;
      state.user = action.payload;
      storeData("token", action.payload);
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.isLoading = false;
      state.loginError = action.payload;
    });

    /** Signup reducer */
    builder.addCase(userSignup.pending, (state, action) => {
      state.isLoading = true;
      state.signupError = null;
    });
    builder.addCase(userSignup.fulfilled, (state, action) => {
      console.log("fullfiled", action.payload);
      state.isLoading = false;
      state.user = action.payload;
      storeData("token", action.payload);
    });
    builder.addCase(userSignup.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.isLoading = false;
      state.signupError = action.payload;
    });

    /** Signup reducer */
    builder.addCase(userLogout.pending, (state, action) => {
      state.isLoading = true;
      state.signupError = null;
    });
    builder.addCase(userLogout.fulfilled, (state, action) => {
      console.log("fullfiled", action.payload);
      state.isLoading = false;
      removeData("token");
    });
    builder.addCase(userLogout.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.isLoading = false;
      state.signupError = action.payload;
    });
  },
});

export default authSlice.reducer;

export { userLogin, userSignup, userLogout };
export const { setIsLoading, resetAuthState, setSignupError, setUser } =
  authSlice.actions;
