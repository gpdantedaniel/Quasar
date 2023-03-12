import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { doc, Firestore, getDocs, getFirestore, Timestamp, updateDoc, collection, query, orderBy, addDoc } from 'firebase/firestore'
import { getAuth } from "firebase/auth";

const initialState = {
  quizzes: [],

  docId: null,
  name: null,
  topic: null,
  description: null,
  lastTaken: null,
  creation: null,
  lastQuestionIndex: null,
  points: null,
}

const deleteQuiz = createAsyncThunk(
  'quiz/deleteQuiz',
  async({user, quiz}, thunkAPI) => {

  }
)

const updateLastTaken = createAsyncThunk(
  'quiz/updateLastTaken',
  async({user, quiz}, thunkAPI) => {
    try {
      const quizRef = doc(getFirestore(), 'users', user.docId, 'quizzes', quiz.docId);
      const lastTaken = Timestamp.now();
      await updateDoc(quizRef, { lastTaken });
      return { lastTaken: lastTaken.toDate().toString()}

    } catch(error) {
      console.log(error);
    }
  }
)

const resetProgress = createAsyncThunk(
  'quiz/resetProgress',
  async({ user, quiz }, thunkAPI) => {
    try {
      const quizRef = doc(getFirestore(), 'users', user.docId, 'quizzes', quiz.docId);
      await updateDoc(quizRef, {
        lastQuestionIndex: 0,
        points: 0,
      });
      return
    } catch(error) {
      console.log(error);
    }
  }
)

const updateProgress = createAsyncThunk(
  'quiz/updateProgress',
  async({ user, quiz, questions, isCorrect}, thunkAPI) => {
    try {
      const quizRef = doc(getFirestore(), 'users', user.docId, 'quizzes', quiz.docId);
      await updateDoc(quizRef, {
        lastQuestionIndex: (
          quiz.lastQuestionIndex < questions.length - 1
          ? quiz.lastQuestionIndex + 1
          : 0 // Reset if the end is reached
          ),
        points: isCorrect ? quiz.points + 1 : quiz.points,
      });
      return { isCorrect }
    } catch(error) {
      console.log(error)
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
      console.log(error);
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

  },

  extraReducers: (builder) => {

    builder.addCase(setDescriptors.fulfilled, (state, action) => {
      state.name = action.payload.descriptors.name;
      state.topic = action.payload.descriptors.topic;
      state.description = action.payload.descriptors.description;
    })
    
    builder.addCase(updateProgress.fulfilled, (state, action) => {
      state.lastQuestionIndex = state.lastQuestionIndex + 1;
      state.points = action.payload.isCorrect ? state.points + 1 : state.points;
    })

    builder.addCase(resetProgress.fulfilled, (state) => {
      state.lastQuestionIndex = 0;
      state.points = 0;
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
  addQuestions,
  clearQuiz
} = quizSlice.actions;

export { updateProgress, resetProgress, updateLastTaken, setDescriptors }

export default quizSlice.reducer;