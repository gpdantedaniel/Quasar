import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, updateDoc, addDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { Platform } from "react-native";
import * as Sentry from 'sentry-expo';

// AsyncThunk functions
const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async ({ quiz }, thunkAPI) => {
    try {
      const auth = getAuth();
      const questionsRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId, 'questions');
      // Fetch questions by ascending chronological order
      const q = query(questionsRef, orderBy('creation', 'asc'));
      const querySnapshot = await getDocs(q);
      const questions = querySnapshot.docs.map((doc) => {
        const question = doc.data();
        question.creation = question.creation.toDate().toString();
        question.docId = doc.id;
        return question
      });
      return questions

    } catch(error) {
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    }
  }
)

const addQuestion = createAsyncThunk(
  'questions/addQuestion',
  async({ quiz, data }, thunkAPI) => {
    try{
      // Generate a creation Timestamp to fetch chronologically
      const creation = Timestamp.now();
      data.creation = creation;
      const auth = getAuth();
      const questionsRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId, 'questions');
      const docRef = await addDoc(questionsRef, data);
      // Conver the Timestamp to String and add docId
      data.creation = creation.toDate().toString();
      data.docId = docRef.id;
      // "data" is the question Object itself
      return data
    } catch(error) {
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
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
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
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
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
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
      state.questions = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuestions.fulfilled, (state, action) => {
      // The questions are chronologically ordered
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
