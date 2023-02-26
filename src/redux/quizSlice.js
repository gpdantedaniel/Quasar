import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  docId: null,
  name: null,
  topic: null,
  description: null,
  lastTaken: null,
  creation: null,
  lastQuestionIndex: null,
  points: null,
}

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // Load a selected quiz
    loadQuiz: (state, action) => {
      state = Object.assign(state, action.payload);
    },
 
    // Update name, topic, and description
    updateDescriptors: () => {},
    // Update lastQuestionIndex and points
    updateProgressIdentifiers: () => {},
    // Add questions to the quiz
    addQuestions: (state, action) => { state.questions = [...state.questions, action.payload] },

    // Clear the currently stored quiz
    clearQuiz: (state) => {
      state = initialState
    },

  } 
})

export const { 
  loadQuiz, 
  updateName, 
  updateTopic, 
  updateDescription, 
  addQuestions,
  clearQuiz
} = quizSlice.actions;

export default quizSlice.reducer;