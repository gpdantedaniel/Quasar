import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

// AsyncThunk functions
const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async ({ quiz }, thunkAPI) => {
    try {
      const auth = getAuth();
      const questionsRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId, 'questions');
      const querySnapshot = await getDocs(questionsRef);
      const questions = querySnapshot.docs.map((doc) => ({...doc.data(), docId: doc.id}));
      return questions

    } catch(error) {
      console.log(error);
      return []
    }
  }
)

const addQuestion = createAsyncThunk(
  'questions/addQuestion',
  async({ quiz, data }, thunkAPI) => {
    try{
      const auth = getAuth();
      const questionsRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId, 'questions');
      const docRef = await addDoc(questionsRef, data);
      return {docId: docRef.id, ...data}
    } catch(error) {
      console.log(error)
    }

  }
)

const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async({ quiz, question, update }, thunkAPI) => {
    try {
      const auth = getAuth();
      const docRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId, 'questions', question.docId);
      await updateDoc(docRef, update);
      return { question, update }
    } catch(error) {
      console.log(error)
    }
  }
)

const deleteQuestion = createAsyncThunk(
  'questions/deleteQuestion',
  async({ quiz, question }, thunkAPI) => {
    try {
      const auth = getAuth();
      const docRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId, 'questions', question.docId);
      await deleteDoc(docRef);
      return { question }
    } catch(error) {
      console.log(error);
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
    clearQuestions: (state, action) => {
      state = initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuestions.fulfilled, (state, action) => {
      state.questions = action.payload;
    })

    builder.addCase(updateQuestion.fulfilled, (state, action) => {
      // If the question exists (outputs -1 when not found)
      const index = state.questions.findIndex(question => question.docId === action.payload.question.docId);
      // docId will not be replaced as the source does not carry the docId attribute
      state.questions[index] = Object.assign(state.questions[index], action.payload.update)
    })

    builder.addCase(addQuestion.fulfilled, (state, action) => {
      // Push the question directly to the stored questions
      state.questions.push(action.payload);
    })

    builder.addCase(deleteQuestion.fulfilled, (state, action) => {
      // Remove the question specifically by docId
      state.questions = state.questions.filter(question => question.docId !== action.payload.question.docId)
    })
  }
})

export const { clearQuestions } = questionsSlice.actions;
export { fetchQuestions, updateQuestion, addQuestion, deleteQuestion }

export default questionsSlice.reducer;
