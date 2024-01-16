const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const URL = process.env.EXPO_PUBLIC_API_URL;

const getLock = createAsyncThunk(
  "lock/getLock",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${URL}/api/lock/data`, {
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
      return rejectWithValue(error.message);
    }
  }
);

const unlockDoor = createAsyncThunk(
  "lock/unlockDoor",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${URL}/api/lock/on`, {
        method: "POST",
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
      return rejectWithValue(error.message);
    }
  }
);

const lockDoor = createAsyncThunk(
  "lock/lockDoor",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${URL}/api/lock/off`, {
        method: "POST",
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
      return rejectWithValue(error.message);
    }
  }
);

const getLockHistory = createAsyncThunk(
  "lock/getLockHistory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${URL}/api/lock/history`, {
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
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  id: null,
  lockStatus: null,
  lockError: null,
  isLoading: false,
  lockHistory: [],
};

const lockSlice = createSlice({
  name: "lock",
  initialState,
  reducers: {
    resetLockState: (state) => {
      state.id = null;
      state.lockStatus = null;
      state.lockError = null;
      state.isLoading = false;
      state.lockHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLock.pending, (state, action) => {
      state.lockError = null;
    });
    builder.addCase(getLock.fulfilled, (state, action) => {
      console.log("---getLock-fullfiled", action.payload);
      const { id, led, buzzer, relay } = action.payload;
      state.lockStatus = led && buzzer && relay;
      state.id = id;
    });
    builder.addCase(getLock.rejected, (state, action) => {
      console.log("---getLock-rejected", action.payload);
      state.lockStatus = null;
      state.lockError = action.payload;
    });

    builder.addCase(unlockDoor.pending, (state, action) => {
      state.lockError = null;
      state.isLoading = true;
    });
    builder.addCase(unlockDoor.fulfilled, (state, action) => {
      console.log("---unlockDoor-fullfiled", action.payload);
      const { led, buzzer, relay } = action.payload.status;

      state.lockStatus = led && buzzer && relay;
      state.isLoading = false;
    });
    builder.addCase(unlockDoor.rejected, (state, action) => {
      console.log("---unlockDoor-rejected", action.payload);
      state.lockStatus = null;
      state.lockError = action.payload;
      state.isLoading = false;
    });

    builder.addCase(lockDoor.pending, (state, action) => {
      state.lockError = null;
      state.isLoading = true;
    });
    builder.addCase(lockDoor.fulfilled, (state, action) => {
      console.log("---lockDoor-fullfiled", action.payload);
      const { led, buzzer, relay } = action.payload.status;

      state.lockStatus = led && buzzer && relay;
      state.isLoading = false;
    });
    builder.addCase(lockDoor.rejected, (state, action) => {
      console.log("---lockDoor-rejected", action.payload);
      state.lockStatus = null;
      state.lockError = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getLockHistory.pending, (state, action) => {
      // state.lockError = null;
      state.isLoading = true;
    });
    builder.addCase(getLockHistory.fulfilled, (state, action) => {
      console.log("---getLockHistory-fullfiled", action.payload);
      const { data } = action.payload;
      state.lockHistory = data;
      state.isLoading = false;
    });
    builder.addCase(getLockHistory.rejected, (state, action) => {
      console.log("---getLockHistory-rejected", action.payload);
      // state.lockError = action.payload;
      state.isLoading = false;
    });
  },
});

export default lockSlice.reducer;
export { getLock, unlockDoor, lockDoor, getLockHistory };
export const { resetLockState } = lockSlice.actions;
