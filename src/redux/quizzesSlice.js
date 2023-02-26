import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  quizzes: [],
};

export const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    addQuiz: (state, action) => {
      state.quizzes = [...state.quizzes, action.payload];
    }
  }
})

export const { addQuiz } = quizzesSlice.actions;

export default quizzesSlice.reducer;
