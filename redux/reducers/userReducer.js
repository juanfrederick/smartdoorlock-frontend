import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const URL = process.env.EXPO_PUBLIC_API_URL;

const initialState = {
  lockId: null,
  email: null,
  id: null,
  isLoading: false,
  userError: null,
  phoneToken: null,
};

const getUserData = createAsyncThunk(
  "user/getUserData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${URL}/api/user/lock/details`, {
        headers: {
          Authorization: `Bearer ${payload}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async (payload, { rejectWithValue }) => {
    const { dataUpdate, token } = payload;
    try {
      const response = await fetch(`${URL}/api/user/lock/details`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataUpdate),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      // console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addPhoneToken: (state, action) => {
      state.phoneToken = action.payload;
    },
    resetUserState: (state) => {
      state.lockId = null;
      state.email = null;
      state.id = null;
      state.isLoading = false;
      state.userError = null;
    },
  },
  extraReducers: (builder) => {
    /** get User Data */
    builder.addCase(getUserData.pending, (state, action) => {
      state.isLoading = true;
      state.userError = null;
    });

    builder.addCase(getUserData.fulfilled, (state, action) => {
      console.log("getUserData-fullfiled", action.payload);
      const { email, id, lockId } = action.payload;
      state.isLoading = false;
      state.email = email;
      state.id = id;
      state.lockId = lockId;
    });

    builder.addCase(getUserData.rejected, (state, action) => {
      console.log("getUserData-rejected", action.payload);
      state.userError = action.payload;
      state.isLoading = false;
    });

    builder.addCase(updateUserData.pending, (state, action) => {
      state.isLoading = true;
      state.userError = null;
    });

    builder.addCase(updateUserData.fulfilled, (state, action) => {
      console.log("---updateUserData-fullfiled", action.payload);
      const { email, id, lockId } = action.payload;
      state.isLoading = false;
      state.email = email;
      state.id = id;
      state.lockId = lockId;
    });

    builder.addCase(updateUserData.rejected, (state, action) => {
      console.log("---updateUserData-rejected", action.payload);
      state.userError = action.payload;
      state.isLoading = false;
    });
  },
});

export default userSlice.reducer;
export const { resetUserState, addPhoneToken } = userSlice.actions;
export { getUserData, updateUserData };
