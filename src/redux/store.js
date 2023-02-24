import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice";
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    user: userReducer,
  },
})