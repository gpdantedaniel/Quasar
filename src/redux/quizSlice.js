import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { doc, getFirestore, Timestamp, updateDoc } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import * as Sentry from 'sentry-expo';
import { Platform } from "react-native";

const initialState = {
  docId: null,
  name: null,
  topic: null,
  description: null,
  lastTaken: null,
  creation: null,
  lastQuestionIndex: null,
  points: null,
  status: null,
}

const updateLastTaken = createAsyncThunk(
  'quiz/updateLastTaken',
  async({ quiz }, thunkAPI) => {
    try {
      const auth = getAuth();
      const quizRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId);
      const lastTaken = Timestamp.now();
      await updateDoc(quizRef, { lastTaken });
      return { lastTaken: lastTaken.toDate().toString()}

    } catch(error) {
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    }
  }
)

const resetProgress = createAsyncThunk(
  'quiz/resetProgress',
  async({ quiz }, thunkAPI) => {
    try {
      const auth = getAuth();
      const quizRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId);
      await updateDoc(quizRef, {
        lastQuestionIndex: 0,
        points: 0,
        status: "start",
      });
      return

    } catch(error) {
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    }
  }
)

const updateProgress = createAsyncThunk(
  'quiz/updateProgress',
  async({ quiz, isCorrect, length}, thunkAPI) => {
    try {
      const auth = getAuth();
      const quizRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId);
       // If lastQuestionIndex is the last index available
      const lastIndex = quiz.lastQuestionIndex >= length - 1;
      
      const update = {
        lastQuestionIndex: (lastIndex ? 0 : quiz.lastQuestionIndex + 1),
        points: isCorrect ? quiz.points + 1 : quiz.points,
        status: (lastIndex ? "completed" : "inprogress")
      }
      await updateDoc(quizRef, update);
      return { update }

    } catch(error) {
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    }
  }
)

const setDescriptors = createAsyncThunk(
  'quiz/setDescriptors',
  async({ quiz, descriptors }, thunkAPI) => {
    try {
      const auth = getAuth();
      const quizRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'quizzes', quiz.docId);
      await updateDoc(quizRef, {
        name: descriptors.name,
        topic: descriptors.topic,
        description: descriptors.description,
      })
      return { descriptors }

    } catch(error) {
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    }
  }
)

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // Load a selected quiz
    loadQuiz: (state, action) => {
      state = Object.assign(state, action.payload.quiz);
    },
    clearQuiz: (state) => {
      state = initialState
    },
  },

  extraReducers: (builder) => {
    builder.addCase(setDescriptors.fulfilled, (state, action) => {
      state.name = action.payload.descriptors.name;
      state.topic = action.payload.descriptors.topic;
      state.description = action.payload.descriptors.description;
    })
    
    builder.addCase(updateProgress.fulfilled, (state, action) => {
      state = Object.assign(state, action.payload.update);
      // state.lastQuestionIndex = state.lastQuestionIndex + 1;
      // state.points = action.payload.isCorrect ? state.points + 1 : state.points;
    })

    builder.addCase(resetProgress.fulfilled, (state) => {
      state.lastQuestionIndex = 0;
      state.points = 0;
      state.status = "start";
    })

    builder.addCase(updateLastTaken.fulfilled, (state, action) => {
      state.lastTaken = action.payload.lastTaken
    })

  }
})

export const { 
  loadQuiz, 
  updateName, 
  updateTopic, 
  updateDescription, 
  clearQuiz
} = quizSlice.actions;

export { updateProgress, resetProgress, updateLastTaken, setDescriptors }

export default quizSlice.reducer;