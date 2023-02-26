import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice";
import userReducer from './userSlice'
import quizzesReducer from './quizzesSlice'
import questionsReducer from "./questionsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    quizzes: quizzesReducer,
    quiz: quizReducer,
    questions: questionsReducer,
  },
})