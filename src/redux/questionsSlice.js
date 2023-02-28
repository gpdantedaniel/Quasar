import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";

// AsyncThunk functions
const getQuestions = createAsyncThunk(
  'questions/getQuestions',
  async ({ user, quiz }, thunkAPI) => {
    try {
      const questionsRef = collection(getFirestore(), 'users', user.docId, 'quizzes', quiz.docId, 'questions');
      const querySnapshot = await getDocs(questionsRef);
      const questions = querySnapshot.docs.map((doc) => ({...doc.data(), docId: doc.id}));
      return questions

    } catch(error) {
      console.log(error);
      return []
    }
  }
)

const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async({ user, quiz, docId, data}, thunkAPI) => {
    try {
      const docRef = doc(getFirestore(), 'users', user.docId, 'quizzes', quiz.docId, 'questions', docId);
      await updateDoc(docRef, data);
      return { docId, data }

    } catch(error) {
      console.log(error)
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
    addQuestion: (state, action) => {
      state.questions = [...state.questions, action.payload];
    },
    
  },
  extraReducers: (builder) => {
    builder.addCase(getQuestions.fulfilled, (state, action) => {
      state.questions = action.payload;
    })

    builder.addCase(updateQuestion.fulfilled, (state, action) => {
      const questions = state.questions;
      console.log('questions: ', questions);
    })
  }
})

export const { addQuestion } = questionsSlice.actions;
export { getQuestions, updateQuestion }

export default questionsSlice.reducer;
