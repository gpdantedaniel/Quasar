import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filename: null,
  name: null,
  topic: null,
  description: null,
  questions: [],
  lastQuestionIndex: null,
  points: null,
}

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // Load a locally imported quiz
    loadQuiz: () => {},
    // Clear the currently stored quiz
    clearQuiz: () => {},
    // Update name, topic, and description
    updateDescriptors: () => {},
    // Update lastQuestionIndex and points
    updateProgressIdentifiers: () => {},
    // Add questions to the quiz
    addQuestions: (state, action) => { state.questions = [...state.questions, action.payload] },

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