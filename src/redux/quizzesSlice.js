import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, query, orderBy, getDocs, Timestamp, addDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo'

const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async(thunkAPI) => {
    try {
      const auth = getAuth();
      const quizzesRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes');
      const q = query(quizzesRef, orderBy('lastTaken', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      // Add docId to all quizzes and change Firestore Timestamps to strings
      const quizzes = docs.map((doc) => ({...doc.data(), ...{docId: doc.id}})).map((quiz) => { 
        quiz.lastTaken = quiz.lastTaken.toDate().toString();
        quiz.creation = quiz.creation.toDate().toString();
        return quiz
      });

      return quizzes

    } catch(error) {
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    }
  }
)

const createQuiz = createAsyncThunk(
  'quizzes/createQuiz',
  async({ descriptors }, thunkAPI) => {
    try {
      const auth = getAuth();
      const quizzesRef = collection(getFirestore(), 'users', auth.currentUser.uid, 'quizzes');
      const quiz = {
        name: descriptors.name,
        topic: descriptors.topic,
        description: descriptors.description,
        lastTaken: Timestamp.now(),
        creation: Timestamp.now(),
        lastQuestionIndex: 0,
        points: 0,
        status: "start",
      };
  
      const quizRef = await addDoc(quizzesRef, quiz);
      // Add the docId and transform all Firestore Timestamps to strings
      quiz.docId = quizRef.id;
      quiz.lastTaken = quiz.lastTaken.toDate().toString();
      quiz.creation = quiz.creation.toDate().toString();
      return quiz

    } catch(error) { 
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    }
  }
)


const deleteQuiz = createAsyncThunk(
  'quiz/deleteQuiz',
  async({ quiz }, thunkAPI) => {
    try {
      const functions = getFunctions(getApp());
      const deleteQuizRecursively = httpsCallable(functions, 'deleteQuiz');
      await deleteQuizRecursively({ quiz });
      return { quiz }

    } catch(error) {
      Platform.OS === 'web' 
      ? Sentry.Browser.captureException(error)
      : Sentry.Native.captureException(error)
    }
  }
)


const initialState = {
  quizzes: [],
};

export const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    addQuiz: (state, action) => {
      state.quizzes = [...state.quizzes, action.payload];
    },
    reflectQuizUpdates: (state, action) => {
      const index = state.quizzes.findIndex(quiz => quiz.docId == action.payload.quiz.docId);
      state.quizzes[index] = action.payload.quiz;
    },
    deleteQuizFromQuizzes: (state, action) => {
      const index = state.quizzes.findIndex(quiz => quiz.docId == action.payload.quiz.docId);
      state.quizzes[index] = action.payload.quiz;
    },
    clearQuizzes: (state, action) => {
      state = initialState;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchQuizzes.fulfilled, (state, action) => {
      state.quizzes = action.payload;
    })

    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.quizzes.push(action.payload);
    })

    builder.addCase(deleteQuiz.fulfilled, (state, action) => {
      state.quizzes = state.quizzes.filter(quiz => quiz.docId !== action.payload.quiz.docId)
    })
  }
})

export const { addQuiz, reflectQuizUpdates, clearQuizzes } = quizzesSlice.actions;

export { fetchQuizzes, createQuiz, deleteQuiz }

export default quizzesSlice.reducer;
