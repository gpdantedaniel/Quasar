import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  topic: null,
  description: null,
  lastQuestion: null,
  correctlyAnswered: null,
  questions: [],
}

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    loadQuiz: () => {},
    updateName: () => {},
    updateTopic: () => {},
    updateDescription: () => {},
    addQuestions: (state, action) => {
      state.questions = [...state.questions, action.payload];
    },
  }
})

export const { 
  loadQuiz, 
  updateName, 
  updateTopic, 
  updateDescription, 
  addQuestions
} = quizSlice.actions;

export default quizSlice.reducer;