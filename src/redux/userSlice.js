import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import * as Sentry from 'sentry-expo';

const initialState = {
  docId: null,
  firstName: null,
  lastName: null,
  email: null,
  creation: null,
};

const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async(thunkAPI) => {
    try {
      const auth = getAuth();
      const docRef = doc(getFirestore(), 'users', auth.currentUser.uid);
      const userDoc = await getDoc(docRef);
      const user = userDoc.data();
      // Set the docId and convert the Timestamps to Strings
      user.docId = userDoc.id;
      user.creation = user.creation.toDate().toString();
      return user

    } catch(error) {
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state = initialState;
    }
  } ,

  extraReducers: (builder) => {

    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state = Object.assign(state, action.payload);
    })
  }
})

export const { clearUser } = userSlice.actions;

export { fetchUser }

export default userSlice.reducer;
