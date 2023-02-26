import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, getFirestore } from "firebase/firestore";


// AsyncThunk functions
const getQuestions = createAsyncThunk(
  'questions/getQuestions',
  async ({ user, quiz }, thunkAPI) => {
    try {
      const questionsRef = collection(getFirestore(), 'users', user.docId, 'quizzes', quiz.docId, 'questions');
      const querySnapshot = await getDocs(questionsRef);
      const questions = querySnapshot.docs.map((doc) => doc.data());
      return questions
    } catch(error) {
      console.log(error);
      return []
    }
  }
)

const initialState = {
  questions: [],
}

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    // wloadQuestions: (state, action) => {}
  },
  extraReducers: (builder) => {
    builder.addCase(getQuestions.fulfilled, (state, action) => {
      state.questions = action.payload;
    })
  }
})

export const { loadQuestions } = questionsSlice.actions;
export { getQuestions }

export default questionsSlice.reducer;
