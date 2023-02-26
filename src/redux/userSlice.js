import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  docId: null,
  firstName: null,
  lastName: null,
  email: null,
  creation: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Load user information
    loadUser: (state, { payload }) => {
      state = Object.assign(state, payload)
    },

    clearUser: (state) => {
      state = initialState;
    }
  } 
})

export const { loadUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

export const selectUserState = (state) => state.user;