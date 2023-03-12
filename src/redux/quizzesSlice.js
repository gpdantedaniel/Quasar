import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, query, orderBy, getDocs, Timestamp, addDoc } from 'firebase/firestore';

const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async(thunkAPI) => {
    try {
      console.log('FETCHING QUIZZES');
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
      console.log(error);
    }
  }
)

const createQuiz = createAsyncThunk(
  'quizzes/createQuiz',
  async({ descriptors }, thunkAPI) => {
    try {
      console.log('descriptors: ', descriptors);
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
      };
  
      const quizRef = await addDoc(quizzesRef, quiz);
      // Add the docId and transform all Firestore Timestamps to strings
      quiz.docId = quizRef.id;
      quiz.lastTaken = quiz.lastTaken.toDate().toString();
      quiz.creation = quiz.creation.toDate().toString();
      return quiz
    } catch(error) { 
      console.log(error) 
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
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchQuizzes.fulfilled, (state, action) => {
      console.log('action payload: ', action.payload);
      state.quizzes = action.payload;
    })

    builder.addCase(createQuiz.fulfilled, (state, action) => {
      console.log('action.payload: ', action.payload);
      state.quizzes.push(action.payload);
    })
  }
})

export const { addQuiz, reflectQuizUpdates} = quizzesSlice.actions;

export { fetchQuizzes, createQuiz }

export default quizzesSlice.reducer;
