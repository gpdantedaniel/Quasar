import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice";
import userReducer from './userSlice'
import questionsReducer from "./questionsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    quiz: quizReducer,
    questions: questionsReducer,
  },
})